import schema2component from "@/utils/schema2component"

let warehouseCode = localStorage.getItem("warehouseCode")

const columns = [
    {
        dbField: "r.id",
        name: "id",
        label: "ID",
        hidden: true
    },
    {
        dbField: "r.order_no",
        name: "abnormalOrderNo",
        label: "${'table.exceptionTrackingNumber' | t}",
        searchable: true
    },
    {
        dbField: "r.stock_abnormal_type",
        name: "stockAbnormalType",
        label: "${'table.exceptionType' | t}",
        type: "mapping",
        source: "${StockAbnormalType}",
        searchable: {
            type: "select",
            source: "${StockAbnormalType}"
        }
    },
    {
        dbField: "r.abnormal_order_no",
        name: "orderNo",
        label: "原始单号",
        hidden: true
    },
    {
        dbField: "r.replay_no",
        name: "replayNo",
        label: "${'table.reviewOrderNumber' | t}"
    },
    {
        dbField: "r.stock_abnormal_status",
        name: "stockAbnormalStatus",
        label: "${'table.status' | t}",
        type: "mapping",
        source: "${StockAbnormalStatus}",
        searchable: {
            type: "select",
            source: "${StockAbnormalStatus}"
        }
    },
    {
        dbField: "r.warehouse_code",
        name: "warehouseCode",
        label: "${'table.warehouse' | t}"
    },

    {
        dbField: "r.container_code",
        name: "containerCode",
        label: "${'table.containerCode' | t}",
        searchable: true
    },
    {
        dbField: "r.container_slot_code",
        name: "containerSlotCode",
        label: "${'table.containerSlotCode' | t}"
    },
    {
        dbField: "g.bar_code_list",
        name: "barCodeList",
        label: "${'skuArea.barcode' | t}",
        searchable: true
    },
    {
        dbField: "r.sku_code",
        name: "skuCode",
        label: "${'skuArea.skuCode' | t}"
    },

    {
        dbField: "r.sku_id",
        name: "skuId",
        label: "商品id",
        hidden: true
    },
    {
        dbField: "r.qty_abnormal",
        name: "qtyAbnormal",
        label: "${'table.profit' | t}"
    },
    {
        dbField: "r.stock_abnormal_reason",
        name: "stockAbnormalReason",
        label: "${'table.differenceReason' | t}",
        type: "mapping",
        source: "${StockAbnormalReason}"
    },
    {
        dbField: "r.reason_desc",
        name: "reasonDesc",
        label: "${'table.causeDescription' | t}"
    },
    {
        dbField: "r.container_stock_id",
        name: "containerStockId",
        label: "库存id",
        hidden: true
    },

    {
        dbField: "r.sku_batch_stock_id",
        name: "skuBatchStockId",
        label: "${'table.lotNumber' | t}"
    },

    {
        dbField: "r.sku_batch_attribute_id",
        name: "skuBatchAttributeId",
        label: "批次属性id",
        hidden: true
    },
    {
        dbField: "r.create_time",
        name: "createTime",
        label: "${'table.creationTime' | t}",
        tpl: "${createTime/1000|date:YYYY-MM-DD HH\\:mm\\:ss}",
        searchable: {
            type: "input-date-range",
            valueFormat: "x"
        }
    },
    {
        dbField: "r.update_time",
        name: "updateTime",
        label: "${'table.updated' | t}",
        tpl: "${updateTime/1000|date:YYYY-MM-DD HH\\:mm\\:ss}"
    }
]

const searchIdentity = "WStockAbnormalRecord"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'inventorAnomalies.title' | t}",
    toolbar: [],
    initApi: "/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "paramConfigTable",
            api: {
                method: "POST",
                url:
                    "/search/search?page=${page}&perPage=${perPage}&createTime-op=bt&warehouseCode-op=eq&warehouseCode=" +
                    warehouseCode,
                dataType: "application/json"
            },
            defaultParams: {
                searchIdentity: searchIdentity,
                showColumns: showColumns,
                searchObject: {
                    tables: "w_stock_abnormal_record r left join (select sku_id, group_concat(distinct bar_code separator ' ') bar_code_list from m_sku_barcode_data group by sku_id) g on r.sku_id = g.sku_id",
                    orderBy: "r.create_time desc"
                }
            },
            autoFillHeight: true,
            autoGenerateFilter: {
                columnsNum: 3,
                showBtnToolbar: true
            },
            headerToolbar: [
                "reload",
                {
                    type: "export-excel",
                    label: "${'button.export' | t}",
                    api:
                        "/search/search?page=${1}&perPage=${100000}&createTime-op=bt&warehouseCode-op=eq&warehouseCode=" +
                        warehouseCode,
                    fileName: "container_stock"
                }
            ],
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: [
                ...columns,
                {
                    type: "operation",
                    label: "${'table.operation' | t}",
                    width: 130,
                    buttons: [
                        {
                            label: "${'button.close' | t}",
                            type: "button",
                            level: "link",
                            disabledOn: "${stockAbnormalStatus !== 'NEW'}",
                            actionType: "dialog",
                            dialog: {
                                title: "${'toast.prompt' | t}",
                                body: "${'toast.sureToCloseOrder' | t}",
                                actions: [
                                    {
                                        label: "${'button.cancel' | t}",
                                        actionType: "cancel",
                                        type: "button"
                                    },
                                    {
                                        label: "${'button.confirm' | t}",
                                        actionType: "ajax",
                                        primary: true,
                                        type: "button",
                                        api: {
                                            method: "post",
                                            url: "/wms/stock/abnormal/record/manualClose",
                                            data: ["${id}"]
                                        },
                                        close: true,
                                        reload: "paramConfigTable"
                                    }
                                ]
                            }
                            // actionType: "ajax",
                            // confirmText: "${'toast.sureToCloseOrder' | t}",
                            // confirmTitle: "${'button.close' | t}",
                            // api: {
                            //     method: "post",
                            //     url: "/wms/stock/abnormal/record/manualClose",
                            //     data: ["${id}"]
                            // },
                            // reload: "paramConfigTable"
                        },
                        {
                            label: "${'button.adjustInventoryOrder' | t}",
                            type: "button",
                            level: "link",
                            disabledOn: "${stockAbnormalStatus !== 'NEW'}",
                            actionType: "dialog",
                            dialog: {
                                title: "${'toast.prompt' | t}",
                                body: "${'toast.confirmGenerateOrder' | t}",
                                actions: [
                                    {
                                        label: "${'button.cancel' | t}",
                                        actionType: "cancel",
                                        type: "button"
                                    },
                                    {
                                        label: "${'button.confirm' | t}",
                                        actionType: "ajax",
                                        primary: true,
                                        type: "button",
                                        api: {
                                            method: "post",
                                            url: "/wms/stock/abnormal/record/createAdjustmentOrder",
                                            data: ["${id}"]
                                        },
                                        close: true,
                                        reload: "paramConfigTable"
                                    }
                                ]
                            }
                        },
                        {
                            label: "${'button.takeInventoryAgain' | t}",
                            type: "button",
                            level: "link",
                            disabledOn: "${stockAbnormalStatus !== 'NEW'}",
                            actionType: "dialog",
                            dialog: {
                                title: "${'toast.prompt' | t}",
                                body: "${'toast.confirmRecount' | t}",
                                actions: [
                                    {
                                        label: "${'button.cancel' | t}",
                                        actionType: "cancel",
                                        // primary: true,
                                        type: "button"
                                    },
                                    {
                                        label: "${'button.confirm' | t}",
                                        actionType: "ajax",
                                        primary: true,
                                        type: "button",
                                        api: {
                                            method: "post",
                                            url: "/wms/stock/abnormal/record/createRecheckOrder",
                                            data: ["${id}"]
                                        },
                                        close: true,
                                        reload: "paramConfigTable"
                                    }
                                ]
                            }
                        }
                    ],
                    toggled: true
                }
            ]
        }
    ]
}

export default schema2component(schema)

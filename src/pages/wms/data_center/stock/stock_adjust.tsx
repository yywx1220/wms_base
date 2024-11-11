import schema2component from "@/utils/schema2component"

let warehouseCode = localStorage.getItem("warehouseCode")

const columns = [
    {
        name: "id",
        label: "ID",
        hidden: true
    },

    {
        name: "orderNo",
        label: "${'table.adjustmentOrderNo' | t}",
        searchable: true
    },
    {
        name: "status",
        label: "${'table.status' | t}",
        type: "mapping",
        source: "${StockAdjustmentOrderStatus}",
        searchable: {
            type: "select",
            source: "${StockAdjustmentOrderStatus}"
        }
    }
    // {
    //     name: "description",
    //     label: "${'table.description' | t}"
    // }
]

const detailColumns = [
    {
        dbField: "d.id",
        name: "id",
        label: "ID",
        hidden: true
    },
    {
        dbField: "d.container_code",
        name: "containerCode",
        label: "${'table.containerNumber' | t}"
    },
    {
        dbField: "d.container_slot_code",
        name: "containerSlotCode",
        label: "${'table.containerLatticeSlogan' | t}"
    },
    {
        dbField: "d.sku_code",
        name: "skuCode",
        label: "${'skuArea.skuCode' | t}"
    },
    {
        dbField: "g.bar_code_list",
        name: "barCodeList",
        label: "${'skuArea.barcode' | t}"
    },
    {
        dbField: "d.qty_adjustment",
        name: "qtyAdjustment",
        label: "${'table.adjustQuantity' | t}"
    },
    {
        dbField: "d.increase_or_decrease",
        name: "increaseOrDecrease",
        label: "${'table.increaseOrDecrease' | t}",
        type: "mapping",
        source: "${IncreaseOrDecrease}"
    },
    {
        dbField: "d.sku_id",
        name: "skuId",
        label: "商品id",
        hidden: true
    },
    {
        dbField: "d.stock_abnormal_record_id",
        name: "stockAbnormalRecordId",
        label: "库存异常单ID",
        hidden: true
    },
    {
        dbField: "d.stock_adjustment_order_id",
        name: "stockAdjustmentOrderId",
        label: "库存调整单ID",
        hidden: true
    },
    {
        dbField: "d.container_stock_id",
        name: "containerStockId",
        label: "库存id",
        hidden: true
    }
]

const searchIdentity = "WStockAdjustmentOrder"
const searchDetailIdentity = "WStockAdjustmentDetail"
const showColumns = columns
const showDetailColumns = detailColumns

const detailDialog = {
    title: "${'modal.stockAdjustmentOrderDetails' | t}",
    actions: [],
    closeOnEsc: true,
    closeOnOutside: true,
    size: "xl",
    body: [
        {
            type: "crud",
            name: "stockAdjustmentDetailTable",
            api: {
                method: "POST",
                url: "/search/search?page=${page}&perPage=${perPage}&createTime-op=bt&stockAdjustmentOrderId=${id}&stockAdjustmentOrderId-op=eq",
                dataType: "application/json"
            },
            defaultParams: {
                searchIdentity: searchDetailIdentity,
                showColumns: showDetailColumns,
                searchObject: {
                    tables: "w_stock_adjustment_detail d left join (select sku_id, group_concat(distinct bar_code separator ' ') bar_code_list from m_sku_barcode_data group by sku_id) g on d.sku_id = g.sku_id",
                }
            },
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: detailColumns
        }
    ]
}

const schema = {
    type: "page",
    title: "${'wms.menu.inventoryAdjustment' | t}",
    toolbar: [],
    initApi: "post:/mdm/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "stockAdjustmentTable",
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
                    tables: "w_stock_adjustment_order",
                    orderBy: "create_time desc",
                }
            },
            autoFillHeight: true,
            autoGenerateFilter: {
                columnsNum: 3,
                showBtnToolbar: true
            },
            headerToolbar: [
                "reload"
                // {
                //     type: "export-excel",
                //     label: "${'button.export' | t}",
                //     api:
                //         "/search/search?page=${1}&perPage=${100000}&createTime-op=bt&warehouseCode-op=eq&warehouseCode=" +
                //         warehouseCode,
                //     fileName: "container_stock"
                // }
            ],
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: [
                ...columns,
                {
                    type: "operation",
                    label: "${'table.operation' | t}",
                    // width: 130,
                    buttons: [
                        {
                            label: "${'button.detail' | t}",
                            type: "button",
                            level: "link",
                            actionType: "dialog",
                            dialog: detailDialog
                        },
                        {
                            label: "${'button.adjustInventory' | t}",
                            type: "button",
                            level: "link",
                            disabledOn: "${status !== 'NEW'}",
                            actionType: "dialog",
                            dialog: {
                                title: "${'toast.prompt' | t}",
                                body: "${'toast.confirmAjust' | t}",
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
                                            url: "/wms/stock/adjustment/adjust",
                                            data: ["${id}"]
                                        },
                                        close: true,
                                        reload: "stockAdjustmentTable"
                                    }
                                ]
                            }
                            // actionType: "ajax",
                            // confirmText: "${'toast.confirmAjust' | t}",
                            // confirmTitle: "${'toast.prompt' | t}",
                            // api: {
                            //     method: "post",
                            //     url: "/wms/stock/adjustment/adjust",
                            //     data: ["${id}"]
                            // },
                            // reload: "stockAdjustmentTable"
                        },
                        {
                            label: "${'button.close' | t}",
                            type: "button",
                            level: "link",
                            disabledOn: "${status !== 'NEW'}",
                            actionType: "dialog",
                            dialog: {
                                title: "${'toast.prompt' | t}",
                                body: "${'toast.confirmToClose' | t}",
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
                                            url: "/wms/stock/adjustment/close",
                                            data: ["${id}"]
                                        },
                                        close: true,
                                        reload: "stockAdjustmentTable"
                                    }
                                ]
                            }
                            // actionType: "ajax",
                            // confirmText: "${'toast.confirmToClose' | t}",
                            // confirmTitle: "${'button.close' | t}",
                            // api: {
                            //     method: "post",
                            //     url: "/wms/stock/adjustment/close",
                            //     data: ["${id}"]
                            // },
                            // reload: "stockAdjustmentTable"
                        }
                    ],
                    toggled: true
                }
            ]
        }
    ]
}

export default schema2component(schema)

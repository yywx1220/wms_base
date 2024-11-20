import schema2component from "@/utils/schema2component"
import { CustomActionType } from "@/pages/wms/station/instances/stocktake/customActionType"
import { debounce } from "lodash"
import { DEBOUNCE_TIME } from "@/pages/wms/station/constant"

let warehouseCode = localStorage.getItem("warehouseCode")

const columns = [
    {
        name: "id",
        label: "ID",
        dbField: "t.id",
        hidden: true
    },
    {
        name: "orderNo",
        label: "${'table.countOrderNumber' | t}",
        dbField: "o.order_no",
        searchable: true
    },
    // {
    //     name: "taskNo",
    //     label: "${'table.inventoryTaskNumber' | t}",
    //     dbField: "t.task_no",
    //     searchable: true
    // },
    // {
    //     name: "warehouseCode",
    //     label: "${'table.warehouse' | t}",
    //     dbField: "t.warehouse_code"
    // },
    // {
    //     name: "stocktakeType",
    //     label: "盘点类型",
    //     type: "mapping",
    //     source: "${StocktakeType}",
    //     searchable: {
    //         type: "select",
    //         source: "${StocktakeType}"
    //     }
    // },
    {
        name: "stockTaskDetailStatus",
        label: "${'table.status' | t}",
        dbField: "t.stocktake_task_status",
        source: "${StocktakeTaskStatus}",
        // type: "mapping",
        // source: "${StocktakeCreateMethod}",
        searchable: {
            type: "select",
            source: "${StocktakeTaskStatus}"
        }
    },
    {
        dbField: "t.create_user",
        label: "${'table.createdBy' | t}",
        name: "createUser"
    },
    {
        dbField: "t.create_time",
        name: "createTime",
        label: "${'table.creationTime' | t}",
        tpl: "${createTime/1000|date:YYYY-MM-DD HH\\:mm\\:ss}",
        searchable: {
            type: "input-date-range",
            valueFormat: "x"
        }
    },
    {
        dbField: "t.update_user",
        label: "${'table.modifiedBy' | t}",
        name: "updateUser"
    },
    {
        dbField: "t.update_time",
        label: "${'table.updated' | t}",
        name: "updateTime",
        tpl: "${updateTime/1000|date:YYYY-MM-DD HH\\:mm\\:ss}"
    }
    // {
    //     name: "inboundOrderType",
    //     label: "容器数"
    // },
    // ...create_update_columns
]

const detailColumns = [
    {
        dbField: "td.id",
        name: "id",
        label: "明细ID",
        hidden: true
    },
    {
        dbField: "td.stocktake_task_id",
        name: "stocktakeTaskId",
        label: "任务ID",
        hidden: true
    },
    {
        dbField: "g.bar_code_list",
        name: "barCodeList",
        label: "${'skuArea.barcode' | t}"
    },
    {
        dbField: "s.sku_name",
        name: "skuName",
        label: "${'skuArea.productName' | t}"
    },
    {
        dbField: "td.warehouse_code",
        name: "warehouseCode",
        label: "${'table.warehouse' | t}"
    },
    {
        dbField: "td.container_code",
        name: "containerCode",
        label: "${'table.containerCode' | t}"
    },
    {
        dbField: "td.container_face",
        name: "containerFace",
        label: "${'workLocationArea.face' | t}"
    },
    {
        dbField: "st.container_slot_code",
        name: "containerSlotCode",
        label: "${'table.containerSlotCode' | t}"
    },
    {
        dbField: "st.total_qty",
        name: "qtyOriginal",
        label: "${'table.inventoryQuantity' | t}"
    },
    {
        dbField: "td.stocktake_task_detail_status",
        name: "stockTaskDetailStatus",
        label: "${'table.status' | t}",
        source: "${StocktakeTaskDetailStatus}"
    }
]

const searchIdentity = "WStocktakeTask"
const searchDetailIdentity = "WStocktakeTaskDetail"
const showColumns = columns
const showDetailColumns = detailColumns

const detailDialog = {
    title: "${'inventoryCounting.detail.modal.title' | t}",
    actions: [],
    closeOnEsc: true,
    closeOnOutside: true,
    size: "xl",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "stocktakeTaskDetailTable",
            api: {
                method: "POST",
                url: "/search/search?page=${page}&perPage=${perPage}&stocktakeTaskId=${id}&stocktakeTaskId-op=eq",
                dataType: "application/json"
            },
            defaultParams: {
                searchIdentity: searchDetailIdentity,
                showColumns: showDetailColumns,
                searchObject: {
                    tables: "w_stocktake_task_detail td left join w_container_stock st on td.warehouse_code = st.warehouse_code and td.container_code = st.container_code and td.container_face = st.container_face inner join w_stocktake_order_detail od on st.id = od.unit_id and td.stocktake_order_id = od.stocktake_order_id left join w_stocktake_task t on td.stocktake_task_id = t.id left join (select sku_id, group_concat(distinct bar_code separator ' ') bar_code_list from m_sku_barcode_data group by sku_id) g on st.sku_id = g.sku_id left join m_sku_main_data s on st.sku_id = s.id"
                }
            },
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: detailColumns
        }
    ]
}

const schema = {
    type: "page",
    title: "${'modal.receiveInventoryList' | t}",
    toolbar: [],
    initApi: "/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "stocktakeTaskTable",
            api: {
                method: "POST",
                url:
                    "/search/search?page=${page}&perPage=${perPage}&createTime-op=bt&updateTime-op=bt&warehouseCode-op=eq&warehouseCode=" +
                    warehouseCode,
                dataType: "application/json"
            },
            defaultParams: {
                searchIdentity: searchIdentity,
                showColumns: showColumns,
                searchObject: {
                    tables: "w_stocktake_task t left join w_stocktake_order o on t.stocktake_order_id = o.id",
                    where: "t.stocktake_task_status in ('NEW')",
                    orderBy: "t.create_time desc"
                }
            },
            autoFillHeight: true,
            autoGenerateFilter: {
                columnsNum: 3,
                showBtnToolbar: true
            },
            headerToolbar: ["reload", "bulkActions"],
            bulkActions: [
                {
                    label: "${'button.receiveInBatches' | t}",
                    level: "primary",
                    // actionType: "ajax",
                    // api: {
                    //     method: "put",
                    //     url: `/station/api?apiCode=${CustomActionType.STOCKTAKE_EXECUTE_TASK}`,
                    //     data: {
                    //         taskIds: "${ids|split}"
                    //     }
                    // },
                    onClick: debounce(
                        async (e: any, props: any) => {
                            const { onCustomActionDispatch } = props
                            const { code } = await onCustomActionDispatch({
                                eventCode:
                                    CustomActionType.STOCKTAKE_EXECUTE_TASK,
                                data: {
                                    taskIds: props.data.ids.split(",")
                                }
                            })

                            if (code !== "-1") {
                                props.setModalVisible(false)
                                return
                            }
                        },
                        DEBOUNCE_TIME,
                        { leading: false }
                    ),
                    className: "batchTakeOrders"
                }
            ],
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            rowClassName: "takeOrderTableRow",
            columns: [
                ...columns,
                {
                    label: "${'button.detail' | t}",
                    type: "button",
                    level: "link",
                    actionType: "dialog",
                    dialog: detailDialog
                }
            ]
        }
    ]
}

export default schema2component(schema)

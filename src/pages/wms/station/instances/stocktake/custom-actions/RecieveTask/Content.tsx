import schema2component from "@/utils/schema2component"
import { CustomActionType } from "@/pages/wms/station/instances/stocktake/customActionType"
import { debounce } from "lodash"
import { DEBOUNCE_TIME } from "@/pages/wms/station/constant"

let warehouseCode = localStorage.getItem("warehouseCode")

const columns = [
    {
        name: "id",
        label: "ID",
        hidden: true
    },
    {
        name: "orderNo",
        label: "table.countOrderNumber",
        searchable: true
    },
    // {
    //     name: "taskNo",
    //     label: "table.inventoryTaskNumber",
    //     searchable: true
    // },
    // {
    //     name: "warehouseCode",
    //     label: "table.warehouse",
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
        name: "stocktakeTaskStatus",
        label: "table.status",
        source: "${StocktakeTaskStatus}",
        type: "mapping",
    },
    {
        label: "table.createdBy",
        name: "createUser"
    },
    {
        name: "createTime",
        label: "table.creationTime",
        tpl: "${createTime/1000|date:YYYY-MM-DD HH\\:mm\\:ss}",
        searchable: {
            type: "input-date-range",
            valueFormat: "x"
        }
    },
    {
        label: "table.modifiedBy",
        name: "updateUser"
    },
    {
        label: "table.updated",
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
        name: "id",
        label: "明细ID",
        hidden: true
    },
    {
        name: "stocktakeTaskId",
        label: "任务ID",
        hidden: true
    },
    {
        name: "barCodeList",
        label: "skuArea.barcode"
    },
    {
        name: "skuName",
        label: "skuArea.productName"
    },
    {
        name: "warehouseCode",
        label: "table.warehouse"
    },
    {
        name: "containerCode",
        label: "table.containerCode"
    },
    {
        name: "containerFace",
        label: "workLocationArea.face"
    },
    {
        name: "containerSlotCode",
        label: "table.containerSlotCode"
    },
    {
        name: "totalQty",
        label: "table.inventoryQuantity"
    },
    {
        name: "stocktakeTaskDetailStatus",
        label: "table.status",
        type: "mapping",
        source: "${StocktakeTaskDetailStatus}"
    }
]


const detailDialog = {
    title: "inventoryCounting.detail.modal.title",
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
                url: "/search/searchV2?page=${page}&perPage=${perPage}&stocktakeTaskId-eq=${id}",
                dataType: "application/json"
            },
            defaultParams: {
                searchIdentity: "findStocktakeTaskDetailByTaskId",
            },
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: detailColumns
        }
    ]
}

const schema = {
    type: "page",
    title: "modal.receiveInventoryList",
    toolbar: [],
    initApi: "post:/mdm/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "stocktakeTaskTable",
            api: {
                method: "POST",
                url:
                    "/search/searchV2?page=${page}&perPage=${perPage}&warehouseCode-eq=" +
                    warehouseCode,
                dataType: "application/json",
                data: {
                    searchIdentity: "searchStocktakeTask",
                    "stocktakeTaskStatus-il": ["NEW"],
                    "orderNo-ct": "${orderNo}",
                    "createTime-bt": "${createTime}",
                },
            },
            autoFillHeight: true,
            autoGenerateFilter: {
                columnsNum: 3,
                showBtnToolbar: true
            },
            headerToolbar: ["reload", "bulkActions"],
            bulkActions: [
                {
                    label: "button.receiveInBatches",
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
                    label: "button.detail",
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

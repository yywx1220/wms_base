import schema2component from "@/utils/schema2component"
import { Translation } from "react-i18next"
import React from "react"
import { stock_id_table } from "@/pages/wms/constants/select_search_api_contant"
import { debounce } from "lodash"
import { DEBOUNCE_TIME } from "@/pages/wms/station/constant"
import { CustomActionType } from "@/pages/wms/station/instances/stocktake/customActionType"

let warehouseCode = localStorage.getItem("warehouseCode")

let areaConditions =
    "&warehouseAreaCode-op=eq&warehouseAreaId=${warehouseAreaId}" +
    "&warehouseLogicCode-op=eq&warehouseLogicCode=${warehouseLogicCode}" +
    "&ownerCode-op=eq&ownerCode=${ownerCode}"

let barCodeCondition = {
    "barCode-op": "il",
    barCode: "${barCode}"
}

const columns = [
    {
        name: "id",
        label: "ID",
        hidden: true
    },
    {
        name: "orderNo",
        label: "${'table.countOrderNumber' | t}",
        searchable: true
    },
    // {
    //     name: "taskNo",
    //     dbField: "t.task_no",
    //     searchable: true
    // },
    // {
    //     name: "warehouseCode",
    //     label: "${'table.warehouse' | t}",
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
        label: "${'table.status' | t}",
        source: "${StocktakeTaskStatus}",
        type: "mapping"
    },
    {
        label: "${'table.createdBy' | t}",
        name: "createUser"
    },
    {
        name: "createTime",
        label: "${'table.creationTime' | t}",
        tpl: "${createTime/1000|date:YYYY-MM-DD HH\\:mm\\:ss}",
        searchable: {
            type: "input-date-range",
            valueFormat: "x"
        }
    },
    {
        label: "${'table.modifiedBy' | t}",
        name: "updateUser"
    },
    {
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
        label: "${'skuArea.barcode' | t}"
    },
    {
        name: "skuName",
        label: "${'skuArea.productName' | t}"
    },
    {
        name: "warehouseCode",
        label: "${'table.warehouse' | t}"
    },
    {
        name: "containerCode",
        label: "${'table.containerCode' | t}"
    },
    {
        name: "containerFace",
        label: "${'workLocationArea.face' | t}"
    },
    {
        name: "containerSlotCode",
        label: "${'table.containerSlotCode' | t}"
    },
    {
        name: "totalQty",
        label: "${'table.inventoryQuantity' | t}"
    },
    {
        name: "stocktakeTaskDetailStatus",
        label: "${'table.status' | t}",
        type: "mapping",
        source: "${StocktakeTaskDetailStatus}"
    }
]

const detailDialog = {
    title: "${'inventoryCounting.detail.modal.title' | t}",
    actions: [],
    closeOnEsc: true,
    closeOnOutside: true,
    size: "full",
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
                searchIdentity: "findStocktakeTaskDetailByTaskId"
            },
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: detailColumns
        }
    ]
}

const schema = {
    type: "page",
    initApi: "post:/mdm/config/dictionary/getAll",
    body: {
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
                "createTime-bt": "${createTime}"
            }
        },
        keepItemSelectionOnPageChange: true,
        autoFillHeight: true,
        autoGenerateFilter: {
            columnsNum: 3,
            showBtnToolbar: true
        },
        headerToolbar: ["reload"],
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
                close: true,
                onClick: debounce(
                    async (e: any, props: any) => {
                        const { onCustomActionDispatch } = props
                        const { code } = await onCustomActionDispatch({
                            eventCode: CustomActionType.STOCKTAKE_EXECUTE_TASK,
                            data: {
                                taskIds: props.data.ids.split(",")
                            }
                        })

                        // if (code !== "-1") {
                        //     props.setModalVisible(false)
                        //     return
                        // }
                    },
                    DEBOUNCE_TIME,
                    { leading: false }
                ),
                className: "batchTakeOrders"
            }
        ],
        footerToolbar: [
            "switch-per-page",
            "statistics",
            "pagination",
            {
                type: "bulkActions",
                align: "right"
            }
        ],
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
}

export default schema2component(schema)

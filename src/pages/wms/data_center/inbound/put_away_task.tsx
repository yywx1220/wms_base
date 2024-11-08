import schema2component from "@/utils/schema2component"
import { create_update_columns } from "@/utils/commonContants"

let warehouseCode = localStorage.getItem("warehouseCode")

const columns = [
    {
        name: "id",
        label: "ID",
        hidden: true
    },
    {
        name: "warehouseCode",
        label: "仓库",
        hidden: true
    },
    // {
    //     name: "ownerCode",
    //     label: "货主",
    //     hidden: true
    // },
    {
        name: "containerCode",
        label: "容器号",
        hidden: true
    },
    {
        name: "containerSpecCode",
        label: "容器规格",
        hidden: true
    },
    {
        name: "locationCode",
        label: "库位编码",
        hidden: true
    },
    {
        name: "orderNo",
        label: "${'table.putAwayTaskNo' | t}",
        searchable: true
    },
    {
        name: "taskNo",
        label: "${'table.internalTrackingNumber' | t}",
        searchable: true
    },
    {
        name: "taskType",
        label: "${'table.putAwayMethod' | t}",
        type: "mapping",
        source: "${PutAwayTaskType}",
        searchable: {
            type: "select",
            source: "${PutAwayTaskType}"
        }
    },
    {
        name: "taskStatus",
        label: "${'table.putAwayStatus' | t}",
        type: "mapping",
        source: "${PutAwayTaskStatusEnum}",
        searchable: {
            type: "select",
            source: "${PutAwayTaskStatusEnum}"
        }
    },
    // {
    //     name: "taskType",
    //     label: "入库类型",
    //     searchable: true
    // },
    {
        name: "workStationId",
        label: "${'station.operatingStation' | t}",
        searchable: true
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
        name: "updateTime",
        label: "${'table.completionTime' | t}",
        // tpl: "${auditTime/1000|date:YYYY-MM-DD HH\\:mm\\:ss}",
        tpl: "${updateTime/1000|date:YYYY-MM-DD HH\\:mm\\:ss}",
        searchable: {
            type: "input-date-range",
            valueFormat: "x"
        }
    }
]

const detailColumns = [
    // {
    //     name: "ownerCode",
    //     label: "货主"
    // },
    {
        name: "putAwayTaskId",
        label: "上架单ID",
        hidden: true
    },
    {
        name: "skuCode",
        label: "${'skuArea.skuCode' | t}"
    },
    // {
    //     name: "skuName",
    //     label: "商品名称"
    // },
    // {
    //     name: "status",
    //     label: "状态"
    // },
    {
        name: "qtyPlanPutAway",
        label: "${'table.plannedQuantity' | t}"
    },
    {
        name: "qtyPutAway",
        label: "${'table.qtyPutAway' | t}"
    },
    {
        name: "qtyAbnormal",
        label: "${'table.qtyDifferences' | t}"
    },
    // {
    //     name: "qtyAbnormal",
    //     label: "差异原因"
    // },
    {
        name: "containerCode",
        label: "${'table.containerCode' | t}"
    },
    {
        name: "containerSlotCode",
        label: "${'table.containerLatticeSlogan' | t}"
    },
    // {
    //     name: "locationCode",
    //     label: "库位"
    // }
    // {
    //     name: "stationCode",
    //     label: "操作台"
    // }
    // {
    //     name: "auditTime",
    //     label: "完成时间"
    // }
    {
        name: "batchAttributeId",
        label: "${'table.lotNumber' | t}"
    }
]

const searchIdentity = "WPutAwayTask"
const searchDetailIdentity = "WPutAwayTaskDetail"
const showColumns = columns

const showDetailColumns = detailColumns

const detailDialog = {
    // title: "${'table.inboundPlanDetails' | t}",
    title: "${'putAwayTask.detail.modal.title' | t}",
    actions: [],
    closeOnEsc: true,
    closeOnOutside: true,
    size: "xl",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "putAwayTaskDetailTable",
            api: {
                method: "POST",
                url: "/search/search?page=${page}&perPage=${perPage}&putAwayTaskId=${id}&putAwayTaskId-op=eq",
                dataType: "application/json"
            },
            defaultParams: {
                searchIdentity: searchDetailIdentity,
                showColumns: showDetailColumns,
                searchObject: {
                    tables: "w_put_away_task_detail"
                }
            },
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: detailColumns
        }
    ]
}

const schema = {
    type: "page",
    title: "${'wms.menu.putAwayTasks' | t}",
    toolbar: [],
    initApi: "/mdm/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "putAwayTaskTable",
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
                    tables: "w_put_away_task",
                    orderBy: "task_status, update_time desc"
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
                    method: "POST",
                    api: {
                        method: "POST",
                        url:
                            "/search/search?page=${1}&perPage=${100000}&createTime-op=bt&warehouseCode-op=eq&warehouseCode=" +
                            warehouseCode,
                        dataType: "application/json"
                    },
                    filename: "put_away_task",
                    defaultParams: {
                        searchIdentity: searchIdentity,
                        showColumns: showColumns
                    }
                }
            ],
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
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

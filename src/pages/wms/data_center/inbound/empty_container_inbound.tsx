import schema2component from "@/utils/schema2component"
import { container_spec } from "@/pages/wms/constants/select_search_api_contant"
import { create_update_columns } from "@/utils/commonContants"

let warehouseCode = localStorage.getItem("warehouseCode")

const form = [
    {
        label: "${'workLocationArea.containerSpecification' | t}",
        type: "select",
        name: "containerSpecCode",
        source: {
            ...container_spec,
            url:
                container_spec.url +
                "&containerType-op=il&containerType=SHELF,CONTAINER"
        },
        onEvent: {
            change: {
                actions: [{ actionType: "focus", componentId: "containerCode" }]
            }
        }
    },
    {
        id: "containerCode",
        label: "${'table.containerCode' | t}",
        type: "input-text",
        name: "containerCode",
        options: [{ label: "", value: "" }],
        onEvent: {
            enter: {
                actions: [{ actionType: "focus", componentId: "locationCode" }]
            }
        }
    },
    {
        id: "locationCode",
        label: "${'table.locationCode' | t}",
        type: "input-text",
        name: "locationCode"
    }
]

const add = {
    type: "button",
    actionType: "dialog",
    icon: "fa fa-plus",
    label: "${'button.add' | t}",
    target: "emptyContainerInboundOrderTable",
    dialog: {
        title: "${'menu.emptyContainerInboundOrder' | t}",
        closeOnEsc: true,
        body: {
            id: "inputForm",
            type: "form",
            api: "/wms/emptyContainerInbound?warehouseCode=" + warehouseCode,
            preventEnterSubmit: true,
            body: form
        }
    }
}

const columns = [
    {
        name: "id",
        label: "ID",
        hidden: true
    },
    {
        name: "orderNo",
        label: "${'table.orderNo' | t}",
        searchable: true
    },
    {
        name: "inboundWay",
        label: "${'table.inboundMethod' | t}",
        source: "${EmptyContainerInboundWay}",
        searchable: {
            type: "select",
            source: "${EmptyContainerInboundWay}"
        }
    },
    {
        name: "planCount",
        label: "${'table.plannedQuantity' | t}",
        searchable: true
    },
    {
        name: "inboundStatus",
        // label: "状态",
        label: "${'table.status' | t}",
        type: "mapping",
        source: "${PutAwayTaskStatusEnum}",
        searchable: {
            type: "select",
            source: "${PutAwayTaskStatusEnum}"
        }
    },
    ...create_update_columns,
    {
        name: "warehouseCode",
        label: "${'table.warehouseCode' | t}",
        hidden: true
    }
]

const detailColumns = [
    {
        name: "emptyContainerInboundOrderId",
        label: "空箱入库单id",
        hidden: true
    },
    {
        name: "containerCode",
        label: "${'table.containerCode' | t}"
    },
    {
        name: "containerSpecCode",
        label: "${'workLocationArea.containerSpecification' | t}"
    },
    {
        name: "locationCode",
        label: "${'table.inboundGroundCode' | t}"
    },
    {
        name: "inboundStatus",
        label: "${'table.status' | t}",
        type: "mapping",
        source: "${PutAwayTaskStatusEnum}"
    }
]

const searchIdentity = "WEmptyContainerInboundOrder"
const searchDetailIdentity = "WEmptyContainerInboundOrderDetail"
const showColumns = columns
const showDetailColumns = detailColumns

const detailDialog = {
    title: "${'emptyContainerInboundOrder.detail.modal.title' | t}",
    actions: [],
    closeOnEsc: true,
    closeOnOutside: true,
    size: "xl",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "emptyContainerInboundOrderDetailTable",
            api: {
                method: "POST",
                url: "/search/search?page=${page}&perPage=${perPage}&emptyContainerInboundOrderId=${id}&emptyContainerInboundOrderId-op=eq",
                dataType: "application/json"
            },
            defaultParams: {
                searchIdentity: searchDetailIdentity,
                showColumns: showDetailColumns
            },
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: detailColumns
        }
    ]
}

const schema = {
    type: "page",
    title: "${'menu.emptyContainerInboundOrder' | t}",
    toolbar: [],
    initApi: "/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "emptyContainerInboundOrderTable",
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
                    orderBy: "inbound_status, update_time desc"
                }
            },
            autoFillHeight: true,
            autoGenerateFilter: {
                columnsNum: 3,
                showBtnToolbar: true
            },
            headerToolbar: [add],
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

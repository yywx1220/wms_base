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
    //     label: "${'table.productOwner' | t}",
    //     searchable: false,
    //     hidden: true
    // },
    {
        name: "lpnCode",
        label: "${'table.LPNNo' | t}",
        searchable: true
    },
    {
        name: "customerOrderNo",
        label: "${'table.customerOrderNo' | t}",
        searchable: true
    },
//     {
//         name: "inboundOrderType",
//         label: "订单类型",
//         hidden: true
//     },
    {
        name: "inboundPlanOrderStatus",
        label: "${'table.status' | t}",
        type: "mapping",
        source: "${InboundPlanOrderStatus}",
        searchable: {
            type: "select",
            source: "${InboundPlanOrderStatus}"
        }
    },

    {
        name: "orderNo",
        label: "${'table.orderNo' | t}",
        searchable: true
    },
    {
        name: "sender",
        label: "${'table.shipper' | t}",
        searchable: true
    },
    {
        name: "skuKindNum",
        label: "${'table.skuTypes' | t}",
        searchable: true
    },
    {
        name: "storageType",
        label: "${'table.storageType' | t}",
        type: "mapping",
        source: "${StorageType}",
        searchable: {
            type: "select",
            source: "${StorageType}"
        }
    },
    {
        name: "totalBox",
        label: "${'table.boxesNumber' | t}"
    },
    {
        name: "totalQty",
        label: "${'table.totalQuantity' | t}"
    },
    {
        name: "trackingNumber",
        label: "${'table.theTrackingNumber' | t}",
        searchable: true
    },
    {
        name: "shippingMethod",
        label: "${'table.modeOfCarriage' | t}",
        searchable: true
    },
    ...create_update_columns,
    {
        type: "tpl",
        name: "remark",
        label: "${'table.remark' | t}",
        tpl: "${remark|truncate:30}",
        popOver: {
            trigger: "hover",
            position: "left-top",
            showIcon: false,
            body: {
                type: "tpl",
                tpl: "${remark}"
            }
        }
    }
]

const detailColumns = [
    {
        name: "inboundPlanOrderId",
        label: "入库通知单ID",
        hidden: true
    },
    {
        name: "batchAttributes",
        label: "${'table.batchAttributes' | t}"
    },
    {
        name: "boxNo",
        label: "${'table.lpnNumber' | t}"
    },
    {
        name: "brand",
        label: "${'table.brand' | t}"
    },
    {
        name: "color",
        label: "${'table.color' | t}"
    },
    {
        name: "containerCode",
        label: "${'table.containerNumber' | t}"
    },
    {
        name: "containerSlotCode",
        label: "${'table.containerLatticeSlogan' | t}"
    },
    {
        name: "containerSpecCode",
        label: "${'table.containerSpecificationNumber' | t}"
    },
    {
        name: "qtyAbnormal",
        label: "${'skuArea.qtyAbnormal' | t}"
    },
    {
        name: "qtyAccepted",
        label: "${'table.acceptanceQuantity' | t}"
    },
    {
        name: "qtyRestocked",
        label: "${'table.plannedQuantity' | t}"
    },
    {
        name: "qtyUnreceived",
        label: "${'table.unreceivedQuantity' | t}"
    },
    {
        name: "responsibleParty",
        label: "${'table.responsibleParty' | t}"
    },
    {
        name: "size",
        label: "${'table.size' | t}"
    },
    {
        name: "skuCode",
        label: "${'table.skuCode' | t}"
    },
    {
        name: "skuName",
        label: "${'table.skuName' | t}"
    },
    // {
    //     name: "ownerCode",
    //     label: "${'table.productOwner' | t}"
    // },
    {
        name: "style",
        label: "${'table.style' | t}"
    }
]

const searchIdentity = "WInboundPlanOrder"
const searchDetailIdentity = "WInboundPlanOrderDetail"
const showColumns = columns
const showDetailColumns = detailColumns

const detailDialog = {
    title: "${'table.inboundPlanDetails' | t}",
    actions: [],
    closeOnEsc: true,
    closeOnOutside: true,
    size: "xl",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "inboundPlanOrderDetailTable",
            api: {
                method: "POST",
                url: "/search/search?page=${page}&perPage=${perPage}&inboundPlanOrderId=${id}&inboundPlanOrderId-op=eq",
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
    title: "${'menu.inboundOrder' | t}",
    toolbar: [],
    initApi: "post:/mdm/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "inboundPlanOrderTable",
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
                    orderBy: "inbound_plan_order_status, update_time desc"
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
                    filename: "inbound_plan_order",
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

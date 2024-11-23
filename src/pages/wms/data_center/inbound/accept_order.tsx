import schema2component from "@/utils/schema2component"

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
    {
        name: "orderNo",
        label: "table.acceptOrderNo",
        searchable: true
    },
    {
        name: "identifyNo",
        label: "table.containerCode"
    },
    {
        name: "acceptMethod",
        label: "table.acceptMethod",
        type: "mapping",
        source: "${AcceptMethodEnum}",
        searchable: {
            type: "select",
            source: "${AcceptMethodEnum}"
        }
    },
    {
        name: "acceptOrderStatus",
        label: "table.acceptOrderStatus",
        type: "mapping",
        source: "${AcceptOrderStatusEnum}",
        searchable: {
            type: "select",
            source: "${AcceptOrderStatusEnum}"
        }
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
        name: "updateTime",
        label: "table.completionTime",
        // tpl: "${auditTime/1000|date:YYYY-MM-DD HH\\:mm\\:ss}",
        tpl: "${updateTime/1000|date:YYYY-MM-DD HH\\:mm\\:ss}",
        searchable: {
            type: "input-date-range",
            valueFormat: "x"
        }
    }
]

const detailColumns = [
    {
        name: "acceptOrderId",
        label: "收货单ID",
        hidden: true
    },
    {
        name: "skuCode",
        label: "skuArea.skuCode"
    },
    {
        name: "skuName",
        label: "skuArea.skuName"
    },
    {
        name: "qtyAccepted",
        label: "table.acceptedQuantity"
    },
    {
        name: "targetContainerCode",
        label: "table.containerCode"
    },
    {
        name: "targetContainerSlotCode",
        label: "table.containerLatticeSlogan"
    },
    {
        name: "workStationId",
        label: "操作台"
    }
]

const searchIdentity = "WAcceptOrder"
const searchDetailIdentity = "WAcceptOrderDetail"
const showColumns = columns

const showDetailColumns = detailColumns

const detailDialog = {
    title: "accept.order.detail.modal.title",
    actions: [],
    closeOnEsc: true,
    closeOnOutside: true,
    size: "xl",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "acceptOrderDetailTable",
            api: {
                method: "POST",
                url: "/search/search?page=${page}&perPage=${perPage}&acceptOrderId=${id}&acceptOrderId-op=eq",
                dataType: "application/json"
            },
            defaultParams: {
                searchIdentity: searchDetailIdentity,
                showColumns: showDetailColumns,
                searchObject: {
                    tables: "w_accept_order_detail"
                }
            },
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: detailColumns
        }
    ]
}

const schema = {
    type: "page",
    title: "wms.menu.receiptManagement",
    toolbar: [],
    initApi: "post:/mdm/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "AcceptOrderTable",
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
                    tables: "w_accept_order",
                    orderBy: "accept_order_status, update_time desc"
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
                    label: "button.export",
                    method: "POST",
                    api: {
                        method: "POST",
                        url:
                            "/search/search?page=${1}&perPage=${100000}&createTime-op=bt&warehouseCode-op=eq&warehouseCode=" +
                            warehouseCode,
                        dataType: "application/json"
                    },
                    filename: "accept_order",
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

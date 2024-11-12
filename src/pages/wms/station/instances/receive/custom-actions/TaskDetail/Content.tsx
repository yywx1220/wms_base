import schema2component from "@/utils/schema2component"

let warehouseCode = localStorage.getItem("warehouseCode")

const columns = [
    {
        name: "skuCode",
        dbField: "smd.sku_code",
        label: "商品编码",
        searchable: true
    },
    {
        name: "skuName",
        dbField: "smd.sku_name",
        label: "商品名称",
        searchable: true
    },
    {
        name: "requiredQty",
        dbField: "ot.required_qty",
        label: "需求数量"
    },
    {
        name: "operatedQty",
        dbField: "ot.operated_qty",
        label: "待收数量"
    },
    {
        name: "operatedQty",
        dbField: "ot.operated_qty",
        label: "异常数量"
    }
]

const searchIdentity = "WReceiveTaskDetail"
const showColumns = columns

const schema = {
    type: "page",
    // title: "订单详情",
    toolbar: [],
    initApi: "post:/mdm/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            name: "ReceiveOrderDetailTable",
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
                searchObject: {}
            },
            autoFillHeight: true,
            autoGenerateFilter: {
                columnsNum: 3,
                showBtnToolbar: false
            },
            headerToolbar: ["reload"],
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns
        }
    ]
}

export default schema2component(schema)

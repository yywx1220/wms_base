import schema2component from "@/utils/schema2component"

let warehouseCode = localStorage.getItem("warehouseCode")

const columns = [
    {
        name: "customerOrderNo",
        dbField: "opo.customer_order_no",
        label: "客户单号",
        searchable: true
    },
    {
        name: "customerOrderNo",
        dbField: "opo.customer_order_no",
        label: "LPN号",
        searchable: true
    },
    {
        name: "customerOrderType",
        dbField: "opo.customer_order_type",
        label: "入库类型",
        searchable: true
    },
    {
        name: "customerOrderType",
        dbField: "opo.customer_order_type",
        label: "货主",
        searchable: true
    },
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
    },
    {
        name: "operatedQty",
        dbField: "ot.operated_qty",
        label: "容器状态"
    },
    {
        name: "skuAttributes",
        dbField: "sba.sku_attributes",
        label: "批次属性"
    }
]

const searchIdentity = "WOutboundOperationTask"
const showColumns = columns

const schema = {
    type: "page",
    // title: "订单详情",
    toolbar: [],
    initApi: "/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            name: "PickingOrderTable",
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
                    tables: "w_operation_task ot, w_picking_order_detail pod, w_outbound_plan_order opo, w_sku_batch_attribute sba, m_sku_main_data smd",
                    where: "ot.detail_id = pod.id and pod.outbound_order_plan_id = opo.id and ot.sku_batch_attribute_id = sba.id and ot.sku_id = smd.id and ot.required_qty > 0",
                    orderBy: "ot.update_time desc"
                }
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

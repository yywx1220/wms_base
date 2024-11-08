import schema2component from "@/utils/schema2component"

let warehouseCode = localStorage.getItem("warehouseCode")

const columns = [
    {
        name: "id",
        dbField: "ot.id",
        hidden: true
    },
    {
        name: "warehouseCode",
        dbField: "ot.warehouse_code",
        label: "${'table.warehouseCode' | t}"
    },
    {
        name: "customerOrderNo",
        dbField: "opo.customer_order_no",
        label: "${'table.customerOrderNo' | t}",
        searchable: true
    },
    {
        name: "customerOrderType",
        dbField: "opo.customer_order_type",
        label: "${'table.orderType' | t}",
        searchable: true
    },
    {
        name: "skuCode",
        dbField: "smd.sku_code",
        label: "${'skuArea.skuCode' | t}",
        searchable: true
    },
    {
        name: "skuName",
        dbField: "smd.sku_name",
        label: "${'skuArea.productName' | t}",
        searchable: true
    },
    {
        name: "stationCode",
        dbField: "ot.assigned_station_slot",
        hidden: true
    },
    {
        name: "priority",
        dbField: "ot.priority",
        label: "${'table.priority' | t}"
    },
    {
        name: "requiredQty",
        dbField: "ot.required_qty",
        label: "${'table.qtyRequired' | t}"
    },
    {
        name: "operatedQty",
        dbField: "ot.operated_qty",
        label: "${'table.qtyPicked' | t}"
    },

    {
        name: "sourceContainerCode",
        dbField: "ot.source_container_code",
        label: "${'table.sourceContainerNumber' | t}",
        searchable: true
    },
    {
        name: "sourceContainerSlot",
        dbField: "ot.source_container_slot",
        label: "${'table.sourceContainerLattice' | t}"
    },
    // {
    //     name: "sourceContainerFace",
    //     dbField: "ot.source_container_face",
    //     label: "来源容器面"
    // },
    // {
    //     name: "boxNo",
    //     dbField: "ot.box_no",
    //     label: "箱号"
    // },
    {
        name: "targetContainerCode",
        dbField: "ot.target_container_code",
        label: "${'table.targetContainerNumber' | t}",
        searchable: true
    },
    {
        name: "targetContainerSlotCode",
        dbField: "ot.target_container_slot_code",
        label: "${'table.targetContainerLattice' | t}"
    },

    {
        name: "targetLocationCode",
        dbField: "ot.target_location_code",
        label: "${'table.seedingWallLattices' | t}",
        searchable: true
    },
    {
        name: "taskStatus",
        dbField: "ot.task_status",
        label: "${'table.taskStatus' | t}"
    },
    // {
    //     name: "taskType",
    //     dbField: "ot.task_type",
    //     label: "任务类型"
    // },

    {
        name: "skuAttributes",
        dbField: "sba.sku_attributes",
        label: "${'table.batchAttributes' | t}"
    }
]

const searchIdentity = "WOutboundOperationTask"
const showColumns = columns

const schema = {
    type: "page",
    // title: "订单详情",
    toolbar: [],
    initApi: "/mdm/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "PickingOrderTable",
            api: {
                method: "POST",
                url:
                    "/search/search?page=${page}&perPage=${perPage}&stationCode-op=jck&createTime-op=bt&taskStatus-op=il&taskStatus=NEW,PROCESSING&warehouseCode-op=eq&warehouseCode=" +
                    warehouseCode,
                dataType: "application/json"
            },
            defaultParams: {
                searchIdentity: searchIdentity,
                showColumns: showColumns,
                searchObject: {
                    tables: "w_operation_task ot, w_picking_order po, w_picking_order_detail pod, w_outbound_plan_order opo, w_sku_batch_attribute sba, m_sku_main_data smd, w_warehouse_area swa",
                    where: "ot.order_id = po.id and ot.detail_id = pod.id and pod.outbound_order_plan_id = opo.id and ot.sku_batch_attribute_id = sba.id and ot.sku_id = smd.id and po.warehouse_area_id = swa.id and ot.required_qty > 0 and swa.warehouse_area_work_type = 'ROBOT'",
                    orderBy: "ot.update_time desc"
                }
            },
            autoFillHeight: true,
            autoGenerateFilter: {
                columnsNum: 3,
                showBtnToolbar: true
            },
            bulkActions: [
                {
                    type: "button",
                    label: "${'button.batchRetry' | t}",
                    actionType: "ajax",
                    api: {
                        method: "PUT",
                        url: "/station/api?apiCode=CONTAINER_TASK_RESEND",
                        data: {
                            ids: "${ARRAYMAP(selectedItems, item => item.id)}"
                        },
                        messages: {
                            success: "success"
                        }
                    },
                    confirmText: "${'modal.confirmBatchRetry' | t}"
                }
            ],
            headerToolbar: ["bulkActions", "reload"],
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns
        }
    ]
}

export default schema2component(schema)

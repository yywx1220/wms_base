import schema2component from "@/utils/schema2component"
import { create_update_columns, enable_options } from "@/utils/commonContants"
import { warehouse_area_id } from "@/pages/wms/constants/select_search_api_contant"

let warehouseCode = localStorage.getItem("warehouseCode")

const form = {
    type: "form",
    api: {
        url: "/wms/warehouseLogic/createOrUpdate"
    },
    body: [
        {
            type: "hidden",
            name: "id"
        },
        {
            type: "hidden",
            name: "version"
        },
        {
            label: "${'table.reservoirAreaCode' | t}",
            name: "warehouseAreaId",
            type: "select",
            source: warehouse_area_id,
            required: true
        },
        {
            label: "${'table.logicalAreaEncoding' | t}",
            name: "warehouseLogicCode",
            type: "input-text",
            required: true
        },
        {
            label: "${'table.logicalAreaName' | t}",
            name: "warehouseLogicName",
            type: "input-text",
            required: true
        },
        {
            label: "${'table.warehouseLogicType' | t}",
            name: "warehouseLogicType",
            type: "select",
            source: "${WarehouseLogicType}"
        },
        {
            label: "${'table.remark' | t}",
            name: "remark",
            type: "input-text"
        },
        {
            label: "${'table.status' | t}",
            name: "enable",
            type: "switch",
            value: true,
            options: enable_options,
            required: true
        },
        {
            label: "${'table.warehouseCode' | t}",
            name: "warehouseCode",
            type: "hidden",
            value: warehouseCode
        }
    ]
}
const add = {
    type: "button",
    actionType: "drawer",
    icon: "fa fa-plus",
    label: "${'button.add' | t}",
    target: "role",
    drawer: {
        title: "${'button.add' | t}",
        closeOnEsc: true,
        body: form
    }
}

const columns = [
    {
        name: "id",
        label: "ID",
        hidden: true
    },
    {
        name: "version",
        label: "Version",
        hidden: true
    },
    {
        name: "warehouseCode",
        label: "${'table.warehouseCode' | t}",
        hidden: true
    },
    {
        name: "warehouseAreaId",
        label: "${'table.reservoirAreaCode' | t}",
        type: "mapping",
        source: warehouse_area_id,
        searchable: {
            type: "select",
            source: warehouse_area_id
        }
    },
    {
        name: "warehouseLogicCode",
        label: "${'table.logicalAreaEncoding' | t}",
        searchable: true
    },
    {
        name: "warehouseLogicName",
        label: "${'table.logicalAreaName' | t}"
    },
    {
        name: "warehouseLogicType",
        label: "${'table.warehouseLogicType' | t}",
        type: "mapping",
        source: "${WarehouseLogicType}"
    },
    {
        name: "remark",
        label: "${'table.remark' | t}"
    },
    {
        name: "enable",
        label: "${'table.status' | t}",
        type: "mapping",
        map: enable_options
    },
    ...create_update_columns
]

const searchIdentity = "WWarehouseLogic"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'logicalAreaManagement.title' | t}",
    toolbar: [],
    initApi: "/mdm/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "role",
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
                    orderBy: "update_time desc"
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
                    type: "operation",
                    label: "${'table.operation' | t}",
                    width: 100,
                    buttons: [
                        {
                            label: "${'button.modify' | t}",
                            type: "button",
                            actionType: "drawer",
                            drawer: {
                                title: "${'button.modify' | t}",
                                closeOnEsc: true,
                                closeOnOutside: true,
                                body: form
                            }
                        }
                    ],
                    toggled: true
                }
            ]
        }
    ]
}

export default schema2component(schema)

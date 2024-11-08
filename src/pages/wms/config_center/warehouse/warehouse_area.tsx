import schema2component from "@/utils/schema2component"
import { create_update_columns, enable_options } from "@/utils/commonContants"
import { warehouse_area_group } from "@/pages/wms/constants/select_search_api_contant"

let warehouseCode = localStorage.getItem("warehouseCode")

const form = {
    type: "form",
    api: {
        url: "/wms/warehouseArea/createOrUpdate"
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
            label: "${'table.warehouseAreaEncoding' | t}",
            name: "warehouseGroupCode",
            type: "select",
            source: warehouse_area_group,
            required: true
        },
        {
            label: "${'table.reservoirAreaCode' | t}",
            name: "warehouseAreaCode",
            type: "input-text",
            required: true
        },
        {
            label: "${'table.reservoirAreaName' | t}",
            name: "warehouseAreaName",
            type: "input-text",
            required: true
        },
        {
            label: "${'table.reservoirAreaType' | t}",
            name: "warehouseAreaType",
            type: "select",
            source: "${WarehouseAreaType}",
            required: true
        },
        {
            label: "${'table.reservoirAreaPurpose' | t}",
            name: "warehouseAreaUse",
            type: "select",
            source: "${WarehouseAreaUse}",
            required: true
        },
        {
            label: "${'table.reservoirAreaWorkType' | t}",
            name: "warehouseAreaWorkType",
            type: "select",
            source: "${WarehouseAreaWorkType}",
            required: true
        },
        {
            label: "${'table.floor' | t}",
            name: "level",
            type: "input-number"
        },
        {
            label: "${'table.temperatureLimits' | t}",
            name: "temperatureLimit",
            type: "input-number"
        },
        {
            label: "${'table.humidityLimitation' | t}",
            name: "wetLimit",
            type: "input-number"
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
            options: enable_options
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
        name: "warehouseGroupCode",
        label: "${'table.warehouseAreaEncoding' | t}",
        type: "mapping",
        source: warehouse_area_group,
        searchable: {
            type: "select",
            source: warehouse_area_group
        }
    },
    {
        name: "warehouseAreaCode",
        label: "${'table.reservoirAreaCode' | t}",
        searchable: true
    },
    {
        name: "warehouseAreaName",
        label: "${'table.reservoirAreaName' | t}"
    },
    {
        name: "warehouseAreaType",
        label: "${'table.reservoirAreaType' | t}",
        type: "mapping",
        source: "${WarehouseAreaType}"
    },
    {
        name: "warehouseAreaUse",
        label: "${'table.reservoirAreaPurpose' | t}",
        type: "mapping",
        source: "${WarehouseAreaUse}"
    },
    {
        name: "warehouseAreaWorkType",
        label: "${'table.reservoirAreaWorkType' | t}",
        type: "mapping",
        source: "${WarehouseAreaWorkType}",
        searchable: {
            type: "select",
            source: "${WarehouseAreaWorkType}"
        }
    },
    {
        name: "level",
        label: "${'table.floor' | t}"
    },
    {
        name: "temperatureLimit",
        label: "${'table.temperatureLimits' | t}"
    },
    {
        name: "wetLimit",
        label: "${'table.humidityLimitation' | t}"
    },
    {
        name: "remark",
        label: "${'table.remark' | t}"
    },
    {
        name: "enable",
        label: "${'table.status' | t}",
        type: "mapping",
        map: enable_options,
        searchable: {
            type: "select",
            options: enable_options
        }
    },
    ...create_update_columns
]

const searchIdentity = "WWarehouseArea"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'reservoirAreaManagement.title' | t}",
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

import schema2component from "@/utils/schema2component"
import {
    create_update_columns,
    enable_options,
    true_false_options
} from "@/utils/commonContants"

let warehouseCode = localStorage.getItem("warehouseCode")

const form = {
    type: "form",
    api: {
        url: "/wms/warehouseAreaGroup/createOrUpdate"
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
            name: "warehouseAreaGroupCode",
            type: "input-text",
            required: true
        },
        {
            label: "${'table.warehouseAreaName' | t}",
            name: "warehouseAreaGroupName",
            type: "input-text",
            required: true
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
        name: "warehouseAreaGroupCode",
        label: "${'table.warehouseAreaEncoding' | t}",
        searchable: true
    },
    {
        name: "warehouseAreaGroupName",
        label: "${'table.warehouseAreaName' | t}"
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

const searchIdentity = "WWarehouseAreaGroup"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'warehouseAreaManagement.title' | t}",
    toolbar: [],
    initApi: "post:/mdm/config/dictionary/getAll",
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
                                closeOnEsc: true,
                                closeOnOutside: true,
                                title: "${'button.modify' | t}",
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

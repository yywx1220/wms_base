import schema2component from "@/utils/schema2component"
import { create_update_columns } from "@/utils/commonContants"
import { api_plugin_add } from "@/pages/plugin/constants/api_constant"

const fromBody = [
    {
        type: "hidden",
        name: "id"
    },
    {
        type: "hidden",
        name: "version"
    },
    {
        type: "input-file",
        name: "jarFile",
        label: "plugin jar file",
        accept: ".jar",
        asBlob: true,
        drag: true,
        required: true
    }
]

const form = {
    type: "form",
    api: api_plugin_add,
    body: fromBody
}

const add = {
    type: "button",
    actionType: "drawer",
    icon: "fa fa-plus",
    label: "${'button.uploadThePlugin' | t}",
    target: "PluginTable",
    drawer: {
        closeOnEsc: true,
        size: "lg",
        title: "${'button.uploadThePlugin' | t}",
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
        name: "code",
        label: "${'pluginSystem.pluginManagement.table.pluginCoding' | t}",
        searchable: true
    },
    {
        name: "name",
        label: "${'pluginSystem.pluginManagement.table.pluginName' | t}",
        searchable: true
    },
    {
        name: "developer",
        label: "${'pluginSystem.pluginManagement.table.developers' | t}",
        searchable: true
    },
    {
        name: "pluginVersion",
        label: "${'pluginSystem.pluginManagement.table.pluginVersion' | t}",
        searchable: true
    },
    // {
    //     name: "所属系统",
    //     label: "applySystem",
    // },
    // {
    //     name: "所属模块",
    //     label: "applyModule",
    // },
    ...create_update_columns
]

const schema = {
    type: "page",
    title: "${'pluginSystem.pluginManagement.title' | t}",
    toolbar: [],
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "PluginTable",
            api: {
                method: "GET",
                url: "/plugin/pluginManage/listAll"
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
                    buttons: [],
                    toggled: true
                }
            ]
        }
    ]
}

export default schema2component(schema)

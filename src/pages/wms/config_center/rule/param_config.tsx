import schema2component from "@/utils/schema2component"
import {
    api_param_config_add,
    api_param_config_get,
    api_param_config_update
} from "@/pages/wms/config_center/constants/api_constant"
import { create_update_columns, enable_options } from "@/utils/commonContants"

const form = [
    {
        type: "hidden",
        name: "id"
    },
    {
        type: "hidden",
        name: "version"
    },
    {
        label: "table.parameterEncoding",
        type: "input-text",
        name: "code"
    },
    {
        label: "table.parameterName",
        type: "input-text",
        name: "name"
    },
    {
        label: "table.parameterObject",
        type: "select",
        name: "configApplyObject",
        source: "${ConfigApplyObject}"
    },
    {
        label: "table.businessModules",
        type: "select",
        name: "configApplyModule",
        source: "${ConfigApplyModule}"
    },
    {
        label: "table.parameterType",
        type: "select",
        name: "configType",
        source: "${ConfigType}"
    },
    {
        label: "table.status",
        type: "switch",
        name: "enable",
        options: enable_options
    },
    {
        label: "table.defaultValue",
        type: "input-text",
        name: "defaultValue"
    },
    {
        label: "table.description",
        type: "input-text",
        name: "description"
    },
    {
        label: "table.remark",
        type: "input-text",
        name: "remark"
    }
]

const add = {
    type: "button",
    actionType: "dialog",
    icon: "fa fa-plus",
    label: "button.add",
    dialog: {
        name: "addDialog",
        title: "button.add",
        closeOnEsc: true,
        size: "lg",
        body: {
            type: "form",
            api: api_param_config_add,
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
        name: "version",
        label: "Version",
        hidden: true
    },
    {
        name: "code",
        label: "table.parameterEncoding",
        searchable: true
    },
    {
        name: "name",
        label: "table.parameterName",
        searchable: true
    },
    {
        name: "configApplyObject",
        label: "table.parameterObject",
        type: "mapping",
        source: "${ConfigApplyObject}",
        searchable: {
            type: "select",
            source: "${ConfigApplyObject}"
        }
    },
    {
        name: "configApplyModule",
        label: "table.businessModules",
        type: "mapping",
        source: "${ConfigApplyModule}",
        searchable: {
            type: "select",
            source: "${ConfigApplyModule}"
        }
    },
    {
        name: "configType",
        label: "table.parameterType",
        type: "mapping",
        source: "${ConfigType}",
        searchable: {
            type: "select",
            source: "${ConfigType}"
        }
    },
    {
        name: "enable",
        label: "table.status",
        type: "mapping",
        map: enable_options
    },
    ...create_update_columns
]

const searchIdentity = "MParameterConfig"
const showColumns = columns

const schema = {
    type: "page",
    title: "parameterManagement.title",
    initApi: "post:/mdm/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "paramConfigTable",
            api: {
                method: "POST",
                url: "/search/search?page=${page}&perPage=${perPage}&createTime-op=bt",
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
                    label: "table.operation",
                    width: 100,
                    buttons: [
                        {
                            label: "button.modify",
                            type: "button",
                            actionType: "dialog",
                            dialog: {
                                title: "button.modify",
                                closeOnEsc: true,
                                closeOnOutside: true,
                                size: "lg",
                                body: {
                                    type: "form",
                                    initApi: api_param_config_get,
                                    api: api_param_config_update,
                                    controls: form
                                }
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

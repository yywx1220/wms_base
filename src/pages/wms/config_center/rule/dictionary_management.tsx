import schema2component from "@/utils/schema2component"
import {
    create_update_columns,
    true_false_options
} from "@/utils/commonContants"
import {
    api_dictionary_add,
    api_dictionary_get,
    api_dictionary_update
} from "@/pages/wms/config_center/constants/api_constant"

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
        label: "${'table.enumerationEncoding' | t}",
        type: "input-text",
        name: "code",
        required: true
    },
    {
        label: "${'table.enumerationName' | t}",
        type: "input-text",
        name: "name",
        required: true
    },
    {
        type: "switch",
        name: "editable",
        label: "${'table.allowEditing' | t}"
    },
    {
        label: "${'table.description' | t}",
        type: "input-text",
        name: "description"
    },
    {
        type: "input-table",
        name: "dictionaryItems",
        addable: true,
        editable: true,
        columns: [
            {
                name: "value",
                label: "${'table.encode' | t}",
                type: "input-text"
            },
            {
                name: "zh_CN",
                label: "${'table.zh_CN' | t}",
                type: "input-text"
            },
            {
                name: "en_US",
                label: "${'table.en_US' | t}",
                type: "input-text"
            },
            {
                name: "order",
                label: "${'table.displayOrder' | t}",
                type: "input-number"
            },
            {
                name: "defaultItem",
                label: "${'table.whetherDefaultValue' | t}",
                type: "select",
                options: true_false_options
            },
            {
                name: "description",
                label: "${'table.description' | t}",
                type: "input-text"
            }
        ]
    }
]

const add = {
    type: "button",
    actionType: "dialog",
    icon: "fa fa-plus",
    label: "${'button.add' | t}",
    dialog: {
        title: "${'button.add' | t}",
        size: "lg",
        closeOnEsc: true,
        body: {
            type: "form",
            api: api_dictionary_add,
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
        label: "${'table.enumerationEncoding' | t}",
        searchable: true
    },
    {
        name: "name",
        label: "${'table.enumerationName' | t}",
        searchable: true
    },
    {
        name: "editable",
        label: "${'table.whetherDefaultValue' | t}",
        type: "mapping",
        map: true_false_options
    },
    {
        name: "description",
        label: "${'table.description' | t}"
    },
    ...create_update_columns
]

const searchIdentity = "MDictionary"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'dictionaryManagement.title' | t}",
    toolbar: [],
    initApi: "/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "dictionaryTable",
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
                    label: "${'table.operation' | t}",
                    width: 100,
                    buttons: [
                        {
                            label: "${'button.modify' | t}",
                            type: "button",
                            actionType: "dialog",
                            dialog: {
                                title: "${'button.modify' | t}",
                                size: "lg",
                                closeOnEsc: true,
                                closeOnOutside: true,
                                body: {
                                    type: "form",
                                    initApi: api_dictionary_get,
                                    api: api_dictionary_update,
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

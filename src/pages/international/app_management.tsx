import schema2component from "@/utils/schema2component"
import {
    api_app_add,
    api_app_delete,
    api_app_update
} from "@/pages/international/constants/api_constant"
import { create_update_columns } from "@/utils/commonContants"
import { Translation } from "react-i18next"
import React from "react"

const form = [
    {
        type: "hidden",
        name: "id"
    },
    {
        type: "input-text",
        name: "appCode",
        label: "${'internationalPlatform.applicationManagement.table.applyCoding' | t}"
    },
    {
        type: "input-text",
        name: "appName",
        label: "${'internationalPlatform.applicationManagement.form.applicationDescription' | t}"
    },
    {
        type: "switch",
        name: "status",
        label: "${'table.status' | t}",
        value: 1,
        trueValue: 1,
        falseValue: 0
    },
    {
        type: "combo",
        name: "languageItemMappings",
        multiple: true,
        value: "${languageItemMappings|toJson}",
        placeholder: (
            // "${'internationalPlatform.applicationManagement.form.addLanguageItems' | t}",
            <Translation>
                {(t) =>
                    t(
                        "internationalPlatform.applicationManagement.form.addLanguageItems"
                    )
                }
            </Translation>
        ),
        items: [
            {
                name: "language",
                label: "${'internationalPlatform.applicationManagement.form.languageItems' | t}",
                type: "input-text"
            },
            {
                name: "description",
                label: "${'internationalPlatform.applicationManagement.form.languageDescription' | t}",
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
    target: "AppTable",
    dialog: {
        size: "lg",
        title: "${'button.add' | t}",
        closeOnEsc: true,
        body: {
            type: "form",
            api: api_app_add,
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
        name: "appCode",
        label: "${'internationalPlatform.applicationManagement.table.applyCoding' | t}",
        searchable: true
    },
    {
        name: "appName",
        label: "${'internationalPlatform.applicationManagement.table.appName' | t}",
        searchable: true
    },
    {
        name: "status",
        label: "${'table.status' | t}",
        type: "mapping",
        source: "${EnableStatus}",
        searchable: {
            type: "select",
            source: "${EnableStatus}"
        }
    },
    {
        name: "languageItemMappings",
        label: "${'internationalPlatform.applicationManagement.table.applyLanguageMappings' | t}",
        hidden: true
    },
    ...create_update_columns
]

const searchIdentity = "IInternationalApp"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'internationalPlatform.applicationManagement.title' | t}",
    toolbar: [],
    initApi: "/mdm/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "AppTable",
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
            headerToolbar: [
                "reload",
                add,
                {
                    type: "export-excel",
                    label: "${'button.export' | t}",
                    method: "POST",
                    api: {
                        method: "POST",
                        url: "/search/search?page=${1}&perPage=${100000}&createTime-op=bt",
                        dataType: "application/json"
                    },
                    filename: "app",
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
                    type: "operation",
                    label: "${'table.operation' | t}",
                    width: 130,
                    buttons: [
                        {
                            label: "${'button.modify' | t}",
                            type: "button",
                            actionType: "dialog",
                            dialog: {
                                size: "lg",
                                title: "${'button.modify' | t}",
                                closeOnEsc: true,
                                closeOnOutside: true,
                                body: {
                                    type: "form",
                                    api: api_app_update,
                                    body: form
                                }
                            }
                        },
                        {
                            label: "${'button.delete' | t}",
                            type: "button",
                            actionType: "ajax",
                            level: "danger",
                            confirmText: "${'toast.sureDelete' | t}",
                            confirmTitle: "${'button.delete' | t}",
                            api: api_app_delete,
                            reload: "AppTable"
                        }
                    ],
                    toggled: true
                }
            ]
        }
    ]
}

export default schema2component(schema)

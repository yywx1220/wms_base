import schema2component from "@/utils/schema2component"
import {
    api_entry_add,
    api_entry_delete,
    api_entry_get,
    api_entry_update
} from "@/pages/international/constants/api_constant"
import {
    international_app_code,
    international_app_language_item_mapping
} from "@/pages/international/constants/select_search_api_contant"
import { create_update_columns } from "@/utils/commonContants"
import { Translation } from "react-i18next"
import React from "react"

const form = [
    {
        type: "hidden",
        name: "id"
    },
    {
        type: "select",
        name: "appCode",
        label: "${'internationalPlatform.applicationManagement.table.applyCoding' | t}",
        source: international_app_code
    },
    {
        type: "input-text",
        name: "entryKey",
        label: "${'internationalPlatform.entryManagement.table.entryEncoding' | t}"
    },
    {
        type: "input-text",
        name: "description",
        label: "${'internationalPlatform.entryManagement.table.entryDescription' | t}"
    },
    {
        type: "service",
        initFetchSchemaOn: "data.appCode",
        schemaApi: international_app_language_item_mapping
    }
]

const languageValueMappingsRequestAdapter = `
                                    const languages = api.data.languages;
                                    const languageValueMappings = Object.entries(api.data).reduce((acc, [key, value]) => {
                                        if (languages.includes(key)) {
                                            acc.push({ language: key, entryValue: value });
                                        }
                                        return acc;
                                    }, []);
                                    return {
                                       ...api,
                                       data: {
                                           ...api.data,     
                                           languageValueMappings: languageValueMappings
                                       }
                                    }`

const add = {
    type: "button",
    actionType: "dialog",
    icon: "fa fa-plus",
    label: "${'button.add' | t}",
    target: "EntryTable",
    dialog: {
        size: "lg",
        title: "${'button.add' | t}",
        closeOnEsc: true,
        body: {
            type: "form",
            body: form,
            api: {
                url: api_entry_add,
                requestAdaptor: languageValueMappingsRequestAdapter
            }
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
        label: "${'internationalPlatform.applicationManagement.table.appName' | t}",
        type: "mapping",
        source: international_app_code,
        searchable: {
            type: "select",
            source: international_app_code
        }
    },
    {
        name: "entryKey",
        label: "${'internationalPlatform.entryManagement.table.entryEncoding' | t}",
        searchable: true
    },
    {
        name: "languageValueMappings",
        label: "${'internationalPlatform.entryManagement.table.itemValueMapping' | t}",
        hidden: true
    },
    {
        name: "description",
        label: "${'internationalPlatform.entryManagement.table.entryDescription' | t}",
        popOver: {
            trigger: "hover",
            showIcon: false,
            body: "${description}"
        }
    },
    ...create_update_columns
]

const searchIdentity = "IInternationalEntry"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'internationalPlatform.entryManagement.title' | t}",
    toolbar: [],
    initApi: "/mdm/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "EntryTable",
            api: {
                method: "POST",
                url: "/search/search?page=${page}&perPage=${perPage}",
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
                    label: "${'button.import' | t}",
                    type: "button",
                    actionType: "dialog",
                    dialog: {
                        title: "${'modal.importEntryWizard' | t}",
                        size: "md",
                        closeOnEsc: true,
                        closeOnOutside: true,
                        actions: [],
                        body: {
                            type: "wizard",
                            steps: [
                                {
                                    title: (
                                        <Translation>
                                            {(t) =>
                                                t("modal.downloadTheTemplate")
                                            }
                                        </Translation>
                                    ),
                                    body: [
                                        {
                                            type: "flex",
                                            justify: "center",
                                            items: [
                                                {
                                                    label: "${'modal.clickToDownloadTheTemplate' | t}",
                                                    type: "action",
                                                    size: "lg",
                                                    actionType: "download",
                                                    // api: "get:/mdm/common-import/downloadTemplate?symbol=INTERNATIONAL_ENTRY",
                                                    api: {
                                                        method: "GET",
                                                        url: "/mdm/common-import/downloadTemplate?symbol=INTERNATIONAL_ENTRY",
                                                        requestAdaptor:
                                                            function (api: {
                                                                data: any
                                                            }) {
                                                                return {
                                                                    ...api,
                                                                    data: {
                                                                        ...api.data // 获取暴露的 api 中的 data 变量
                                                                    },
                                                                    responseType:
                                                                        "blob"
                                                                }
                                                            }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    title: (
                                        <Translation>
                                            {(t) => t("modal.startTheImport")}
                                        </Translation>
                                    ),
                                    body: {
                                        type: "input-file",
                                        name: "file",
                                        accept: "*",
                                        receiver: {
                                            url: "/mdm/common-import/import?symbol=INTERNATIONAL_ENTRY",
                                            reload: "EntryTable"
                                        },
                                        drag: true
                                    },
                                    actions: [
                                        {
                                            type: "action",
                                            actionType: "close",
                                            level: "primary",
                                            label: "完成"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    type: "export-excel",
                    label: "${'button.export' | t}",
                    api: {
                        method: "POST",
                        url: "/search/search?page=${1}&perPage=${100000}",
                        dataType: "application/json"
                    },
                    filename: "entries",
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
                                    initApi: {
                                        url: api_entry_get,
                                        adaptor: `const mapping = payload.data.languageValueMappings.reduce((acc, obj) => {
                                                      acc[obj.language] = obj.entryValue;
                                                      return acc;
                                                    }, {});
                                                    return {
                                                        ...payload.data,
                                                        ...mapping
                                                    }`
                                    },
                                    api: {
                                        url: api_entry_update,
                                        requestAdaptor:
                                            languageValueMappingsRequestAdapter
                                    },
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
                            api: api_entry_delete,
                            reload: "EntryTable"
                        }
                    ],
                    toggled: true
                }
            ]
        }
    ]
}

export default schema2component(schema)

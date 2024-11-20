import schema2component from "@/utils/schema2component"
import { create_update_columns } from "@/utils/commonContants"

const form = [
    {
        type: "hidden",
        name: "id"
    },
    {
        type: "input-text",
        name: "apiCode",
        label: "${'interfacePlatform.interfaceManagement.table.interfaceCode' | t}",
        readOnly: true
    },
    {
        type: "input-text",
        name: "costTime",
        label: "${'interfacePlatform.interfaceLogs.table.duration' | t}(ms)",
        readOnly: true
    },
    {
        type: "input-text",
        name: "retryCount",
        label: "${'interfacePlatform.interfaceLogs.table.numberOfRetries' | t}",
        readOnly: true
    },
    {
        type: "input-text",
        name: "status",
        label: "${'table.status' | t}",
        readOnly: true
    },
    {
        type: "textarea",
        name: "requestData",
        label: "${'interfacePlatform.interfaceLogs.from.requestPackets' | t}",
        maxRows: 10,
        readOnly: true
    },
    {
        type: "textarea",
        name: "responseData",
        label: "${'interfacePlatform.interfaceLogs.from.responsePackets' | t}",
        maxRows: 10,
        readOnly: true
    }
]

const columns = [
    {
        name: "id",
        label: "ID",
        hidden: true
    },
    {
        name: "apiCode",
        label: "${'interfacePlatform.interfaceManagement.table.interfaceCode' | t}",
        searchable: true
    },
    {
        name: "costTime",
        label: "${'interfacePlatform.interfaceLogs.table.duration' | t}(ms)"
    },
    {
        name: "retryCount",
        label: "${'interfacePlatform.interfaceLogs.table.numberOfRetries' | t}"
    },
    {
        name: "status",
        label: "${'table.status' | t}",
        searchable: {
            type: "select",
            source: "${ApiLogStatus}"
        }
    },
    ...create_update_columns
]

const searchIdentity = "AApiLog"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'interfacePlatform.interfaceLogs.title' | t}",
    toolbar: [],
    initApi: "/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "ApiLogTable",
            api: {
                method: "POST",
                url: "/search/search?page=${page}&perPage=${perPage}&createTime-op=bt",
                dataType: "application/json"
            },
            defaultParams: {
                searchIdentity: searchIdentity,
                showColumns: showColumns,
                searchObject: {
                    orderBy: "create_time desc"
                }
            },
            autoFillHeight: true,
            autoGenerateFilter: {
                columnsNum: 3,
                showBtnToolbar: true
            },
            headerToolbar: ["reload"],
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: [
                ...columns,
                {
                    type: "operation",
                    label: "${'table.operation' | t}",
                    width: 230,
                    buttons: [
                        {
                            label: "${'button.detail' | t}",
                            type: "button",
                            level: "link",
                            actionType: "dialog",
                            dialog: {
                                title: "${'button.detail' | t}",
                                size: "lg",
                                closeOnEsc: true,
                                closeOnOutside: true,
                                body: {
                                    type: "form",
                                    initApi: "/wms/api-log-management/${id}",
                                    body: form
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

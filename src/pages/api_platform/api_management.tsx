import schema2component from "@/utils/schema2component"
import {
    api_api_add,
    api_api_config_get,
    api_api_config_update,
    api_api_delete,
    api_api_update
} from "@/pages/api_platform/constants/api_constant"
import {
    create_update_columns,
    true_false_options
} from "@/utils/commonContants"

const baseform = [
    {
        type: "hidden",
        name: "id"
    },
    {
        label: "${'interfacePlatform.interfaceManagement.table.interfaceCode' | t}",
        type: "input-text",
        name: "code",
        required: true
    },
    {
        label: "${'interfacePlatform.interfaceManagement.table.interfaceName' | t}",
        type: "input-text",
        name: "name",
        required: true
    },
    {
        label: "${'interfacePlatform.interfaceManagement.table.interfaceType' | t}",
        type: "select",
        name: "apiType",
        source: "${ApiType}",
        required: true
    },
    {
        label: "${'interfacePlatform.interfaceManagement.table.interfaceAddress' | t}",
        type: "input-text",
        name: "url",
        validations: "isUrl"
    },
    {
        label: "${'interfacePlatform.interfaceManagement.table.interfaceRequestMethod' | t}",
        type: "select",
        name: "method",
        source: "${HttpMethod}"
    },
    {
        label: "${'interfacePlatform.interfaceManagement.table.interfaceRequestEncoding' | t}",
        type: "input-text",
        name: "encoding"
    },
    {
        label: "${'interfacePlatform.interfaceManagement.table.API_request_header' | t}",
        type: "input-kv",
        name: "headers",
        value: "${DECODEJSON(headersStr)}"
    },
    {
        label: "${'interfacePlatform.interfaceManagement.table.interfaceRequestFormat' | t}",
        type: "select",
        name: "format",
        source: "${MediaType}",
        required: true
    },
    {
        label: "${'interfacePlatform.interfaceManagement.table.isCertificationRequired' | t}",
        type: "switch",
        name: "auth",
        required: true,
        value: false
    },
    {
        label: "${'interfacePlatform.interfaceManagement.table.authenticationServiceAddress' | t}",
        type: "input-text",
        name: "authUrl",
        visibleOn: "${auth}"
    },
    {
        label: "${'interfacePlatform.interfaceManagement.table.typeOfCertification' | t}",
        type: "input-text",
        name: "grantType",
        visibleOn: "${auth}"
    },
    {
        label: "${'interfacePlatform.interfaceManagement.table.authenticationServiceUsername' | t}",
        type: "input-text",
        name: "username",
        visibleOn: "${auth}"
    },
    {
        label: "${'interfacePlatform.interfaceManagement.table.authenticationServicePassword' | t}",
        type: "input-text",
        name: "password",
        visibleOn: "${auth}"
    },
    {
        label: "${'interfacePlatform.interfaceManagement.table.keysID' | t}",
        type: "input-text",
        name: "secretId",
        visibleOn: "${auth}"
    },
    {
        label: "${'interfacePlatform.interfaceManagement.table.keys' | t}",
        type: "input-text",
        name: "secretKey",
        visibleOn: "${auth}"
    },
    {
        label: "${'interfacePlatform.interfaceManagement.table.tokenName' | t}",
        description: "认证服务器响应的 token 的名称",
        type: "input-text",
        name: "tokenName",
        visibleOn: "${auth}"
    },
    {
        label: "${'table.whetherEnabled' | t}",
        type: "switch",
        name: "enabled",
        value: true
    },
    {
        label: "${'table.syncCallback' | t}",
        type: "switch",
        name: "syncCallback",
        value: false
    },
    {
        label: "${'interfacePlatform.interfaceManagement.form.interfaceDescription' | t}",
        type: "textarea",
        name: "description"
    }
]

const configForm = [
    {
        label: "${'interfacePlatform.interfaceManagement.table.interfaceCode' | t}",
        type: "input-text",
        name: "code",
        readOnly: true
    },
    {
        label: "${'interfacePlatform.interfaceManagement.form.converseScriptType' | t}",
        type: "select",
        name: "paramConverterType",
        source: "${ConverterType}",
        required: true
    },
    {
        label: "${'interfacePlatform.interfaceManagement.form.requestTransformationScript' | t}",
        type: "textarea",
        name: "jsParamConverter",
        description:
            "如果接口的请求是单条数据时，会执行一次脚本，如果是多条数据，则会为每条数据执行一次脚本，本次执行脚本时，可以使用 <strong>this</strong> 或 <strong>obj</strong> 获取当前操作的数据进行转换",
        visibleOn: "${paramConverterType == 'JS'}"
    },
    {
        label: "${'interfacePlatform.interfaceManagement.form.requestTransformationScript' | t}",
        type: "textarea",
        name: "templateParamConverter",
        visibleOn: "${paramConverterType == 'TEMPLATE'}"
    },
    {
        label: "${'interfacePlatform.interfaceManagement.form.responseTransformationScriptType' | t}",
        type: "select",
        name: "responseConverterType",
        source: "${ConverterType}",
        required: true
    },
    {
        label: "${'interfacePlatform.interfaceManagement.form.responseTransformationScripts' | t}",
        type: "textarea",
        name: "jsResponseConverter",
        visibleOn: "${responseConverterType == 'JS'}"
    },
    {
        label: "${'interfacePlatform.interfaceManagement.form.responseTransformationScripts' | t}",
        type: "textarea",
        name: "templateResponseConverter",
        visibleOn: "${responseConverterType == 'TEMPLATE'}"
    }
]

const add = {
    type: "button",
    actionType: "drawer",
    icon: "fa fa-plus",
    label: "${'button.add' | t}",
    target: "ApiTable",
    drawer: {
        size: "lg",
        title: "${'button.add' | t}",
        closeOnEsc: true,
        body: {
            type: "form",
            api: api_api_add,
            body: baseform
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
        name: "code",
        label: "${'interfacePlatform.interfaceManagement.table.interfaceCode' | t}",
        searchable: true
    },
    {
        name: "name",
        label: "${'interfacePlatform.interfaceManagement.table.interfaceName' | t}",
        searchable: true
    },
    {
        name: "apiType",
        label: "${'interfacePlatform.interfaceManagement.table.interfaceType' | t}",
        type: "mapping",
        source: "${ApiType}",
        searchable: {
            type: "select",
            source: "${ApiType}"
        }
    },
    {
        name: "method",
        label: "${'interfacePlatform.interfaceManagement.table.interfaceRequestMethod' | t}",
        type: "mapping",
        source: "${HttpMethod}",
        searchable: {
            type: "select",
            source: "${HttpMethod}"
        }
    },
    {
        name: "format",
        label: "${'interfacePlatform.interfaceManagement.table.interfaceRequestFormat' | t}",
        type: "mapping",
        source: "${MediaType}",
        searchable: {
            type: "select",
            source: "${MediaType}"
        }
    },
    {
        name: "encoding",
        label: "${'interfacePlatform.interfaceManagement.table.interfaceRequestEncoding' | t}",
        searchable: true
    },
    {
        name: "headersStr",
        dbField: "headers",
        label: "${'interfacePlatform.interfaceManagement.table.API_request_header' | t}",
        hidden: true
    },
    {
        name: "auth",
        label: "${'interfacePlatform.interfaceManagement.table.isCertificationRequired' | t}",
        type: "mapping",
        map: true_false_options
    },
    {
        name: "enabled",
        label: "${'table.whetherEnabled' | t}",
        type: "mapping",
        map: true_false_options
    },
    {
        name: "syncCallback",
        label: "${'table.syncCallback' | t}",
        type: "mapping",
        map: true_false_options
    },
    {
        name: "url",
        label: "请求url",
        hidden: true
    },
    {
        name: "authUrl",
        label: "${'interfacePlatform.interfaceManagement.table.authenticationServiceAddress' | t}",
        hidden: true
    },
    {
        name: "grantType",
        label: "${'interfacePlatform.interfaceManagement.table.typeOfCertification' | t}",
        hidden: true
    },
    {
        name: "username",
        label: "${'interfacePlatform.interfaceManagement.table.authenticationServiceUsername' | t}",
        hidden: true
    },
    {
        name: "password",
        label: "${'interfacePlatform.interfaceManagement.table.authenticationServicePassword' | t}",
        hidden: true
    },
    {
        name: "secretId",
        label: "${'interfacePlatform.interfaceManagement.table.keysID' | t}",
        hidden: true
    },
    {
        name: "secretKey",
        label: "${'interfacePlatform.interfaceManagement.table.keys' | t}",
        hidden: true
    },
    {
        name: "description",
        label: "${'interfacePlatform.interfaceManagement.form.interfaceDescription' | t}",
        hidden: true
    },
    ...create_update_columns
]

const searchIdentity = "AApi"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'interfacePlatform.interfaceManagement.title' | t}",
    toolbar: [],
    initApi: "/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "ApiTable",
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
                    columns: [
                        "code",
                        "name",
                        "apiType",
                        "method",
                        "format",
                        "encoding",
                        "auth",
                        "enabled"
                    ],
                    filename: "api",
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
                    width: 230,
                    buttons: [
                        {
                            label: "${'button.modify' | t}",
                            type: "button",
                            actionType: "drawer",
                            drawer: {
                                title: "${'button.modify' | t}",
                                closeOnEsc: true,
                                closeOnOutside: true,
                                body: {
                                    type: "form",
                                    api: api_api_update,
                                    body: baseform
                                }
                            }
                        },
                        {
                            label: "${'interfacePlatform.interfaceManagement.button.parameterConversionConfiguration' | t}",
                            type: "button",
                            actionType: "dialog",
                            dialog: {
                                title: "${'interfacePlatform.interfaceManagement.dialog.modifyParameterConversionConfiguration' | t}",
                                closeOnEsc: true,
                                closeOnOutside: true,
                                size: "xl",
                                body: {
                                    type: "form",
                                    initApi: api_api_config_get,
                                    api: api_api_config_update,
                                    body: configForm
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
                            api: api_api_delete,
                            reload: "ApiTable"
                        }
                    ],
                    toggled: true
                }
            ]
        }
    ]
}

export default schema2component(schema)

import schema2component from "@/utils/schema2component"
import {create_update_columns, enable_options, true_false_options} from "@/utils/commonContants"
import {owner_code} from "@/pages/wms/constants/select_search_api_contant"
import {
    api_batch_attribute_add,
    api_batch_attribute_get,
    api_batch_attribute_update
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
        label: "${'table.ruleEncoding' | t}",
        type: "input-text",
        name: "code",
        required: true
    },
    {
        label: "${'table.ruleName' | t}",
        type: "input-text",
        name: "name",
        required: true
    },
    {
        type: "select",
        name: "ownerCode",
        label: "${'table.productOwner' | t}",
        source: owner_code
    },
    {
        label: "${'table.SKUCategories' | t}",
        type: "select",
        name: "skuFirstCategory",
        source: "${SkuFirstCategory}"
    },
    {
        name: "enable",
        type: "switch",
        label: "${'table.whetherEnabled' | t}"
    },
    {
        type: "input-table",
        name: "batchAttributeFieldConfigs",
        addable: true,
        editable: true,
        removable: true,
        showFooterAddBtn: false,
        value: [
            {
                fieldCode: "inboundDate",
                fieldName: "入库日期"
            },
            {
                fieldCode: "productDate",
                fieldName: "生产日期"
            },
            {
                fieldCode: "expiredDate",
                fieldName: "到期日期"
            }
        ],
        columns: [
            {
                name: "fieldCode",
                label: "${'table.batchAttributeCode' | t}",
                type: "input-text",
                required: true
            },
            {
                name: "fieldName",
                label: "${'table.batchAttributes' | t}",
                type: "input-text"
            },
            {
                name: "required",
                label: "${'table.required' | t}",
                type: "select",
                options: true_false_options
            },
            {
                name: "keyAttribute",
                label: "${'table.keyAttributes' | t}",
                type: "select",
                options: true_false_options
            },
            {
                name: "exactMatch",
                label: "${'table.preciseMatch' | t}",
                type: "select",
                options: true_false_options
            },
            {
                name: "enable",
                label: "${'table.enable' | t}",
                type: "select",
                options: enable_options
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
            api: api_batch_attribute_add,
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
        label: "${'table.ruleEncoding' | t}",
        searchable: true
    },
    {
        name: "name",
        label: "${'table.ruleName' | t}",
        searchable: true
    },
    {
        name: "ownerCode",
        label: "${'table.productOwner' | t}",
        type: "mapping",
        source: owner_code,
        searchable: {
            type: "select",
            source: owner_code
        }
    },
    {
        name: "skuFirstCategory",
        label: "${'table.SKUCategories' | t}",
        type: "mapping",
        source: "${SkuFirstCategory}",
        searchable: {
            type: "select",
            source: "${SkuFirstCategory}"
        }
    },
    {
        name: "enable",
        label: "${'table.enable' | t}",
        type: "mapping",
        source: "${EnableStatus}",
    },
    ...create_update_columns
]

const searchIdentity = "MBatchAttributeConfig"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'batchManagement.title' | t}",
    toolbar: [],
    initApi: "post:/mdm/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "batchAttributeTable",
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
                                    initApi: {
                                        url: api_batch_attribute_get,
                                        method: "get"
                                    },
                                    api: api_batch_attribute_update,
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

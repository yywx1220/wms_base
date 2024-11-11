import schema2component from "@/utils/schema2component"
import { owner_code_barcode_analysis } from "@/pages/wms/constants/select_search_api_contant"
import {
    api_barcode_parse_rule_add,
    api_barcode_parse_rule_get,
    api_barcode_parse_rule_update
} from "@/pages/wms/config_center/constants/api_constant"
import {
    create_update_columns,
    true_false_options
} from "@/utils/commonContants"

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
        label: "${'table.productOwner' | t}",
        type: "select",
        name: "ownerCode",
        source: owner_code_barcode_analysis
    },
    {
        label: "${'table.buriedPoint' | t}",
        type: "select",
        name: "executeTime",
        source: "${ExecuteTime}",
        required: true
    },
    {
        label: "${'table.businessModules' | t}",
        type: "select",
        name: "businessFlow",
        source: "${BusinessFlow}",
        required: true
    },
    {
        label: "${'table.brand' | t}",
        type: "select",
        name: "brand"
    },
    {
        label: "${'table.stitchingPosition' | t}",
        type: "select",
        name: "unionLocation",
        source: "${UnionLocation}"
    },
    {
        type: "input-text",
        name: "unionStr",
        placeholder: "${'table.stitchingContent' | t}"
    },
    {
        label: "${'table.resolutionRules' | t}",
        type: "textarea",
        name: "regularExpression",
        required: true
    },
    {
        name: "resultFields",
        label: "${'table.resolveObjects' | t}",
        type: "input-array",
        required: true,
        items: {
            type: "select",
            clearable: false,
            source: "${ParserObject}"
        }
    },
    {
        name: "enable",
        type: "switch",
        label: "${'table.whetherEnabled' | t}",
        onText: "启用",
        offText: "禁用",
        "en-US": {
            onText: "Enable",
            offText: "Disabled"
        }
        // offText: <Translation>{(t) => t("table.disabled")}</Translation>
    }
]

const add = {
    type: "button",
    actionType: "dialog",
    icon: "fa fa-plus",
    label: "${'button.add' | t}",
    dialog: {
        name: "addDialog",
        title: "${'button.add' | t}",
        closeOnEsc: true,
        size: "lg",
        body: {
            type: "form",
            api: api_barcode_parse_rule_add,
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
        source: owner_code_barcode_analysis,
        searchable: {
            type: "select",
            source: owner_code_barcode_analysis
        }
    },
    {
        name: "executeTime",
        label: "${'table.buriedPoint' | t}",
        type: "mapping",
        source: "${ExecuteTime}",
        searchable: {
            type: "select",
            source: "${ExecuteTime}"
        }
    },
    {
        name: "enable",
        label: "${'table.whetherEnabled' | t}",
        type: "mapping",
        map: true_false_options
    },
    ...create_update_columns
]

const searchIdentity = "MBarcodeParseRule"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'barcodeParsingManagement.title' | t}",
    toolbar: [],
    initApi: "post:/mdm/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "barcodeParseRule",
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
                                closeOnEsc: true,
                                closeOnOutside: true,
                                size: "lg",
                                body: {
                                    type: "form",
                                    initApi: api_barcode_parse_rule_get,
                                    api: api_barcode_parse_rule_update,
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

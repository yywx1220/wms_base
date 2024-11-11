import schema2component from "@/utils/schema2component"
import { owner_code } from "@/pages/wms/constants/select_search_api_contant"
import {
    volume,
    weight
} from "@/pages/wms/config_center/constants/form_constants"
import {
    api_sku_add,
    api_sku_get,
    api_sku_update
} from "@/pages/wms/config_center/constants/api_constant"
import { create_update_columns, enable_options } from "@/utils/commonContants"

let warehouseCode = localStorage.getItem("warehouseCode")

const form = [
    {
        type: "tabs",
        tabs: [
            {
                title: "${'form.tab.basicInformation' | t}",
                controls: [
                    {
                        type: "input-text",
                        name: "id",
                        label: "${'table.productId' | t}",
                        hidden: true
                    },
                    {
                        type: "input-text",
                        name: "skuCode",
                        label: "${'skuArea.skuCode' | t}",
                        required: true,
                        disabledOn: "this.id != null"
                    },
                    {
                        type: "input-text",
                        name: "skuName",
                        label: "${'skuArea.productName' | t}",
                        required: true
                    },
                    {
                        type: "input-text",
                        name: "style",
                        label: "${'table.style' | t}"
                    },
                    {
                        type: "input-text",
                        name: "color",
                        label: "${'table.color' | t}"
                    },
                    {
                        type: "input-text",
                        name: "size",
                        label: "${'table.size' | t}"
                    },
                    {
                        type: "input-text",
                        name: "brand",
                        label: "${'table.brand' | t}"
                    },
                    {
                        type: "select",
                        name: "ownerCode",
                        label: "${'table.productOwner' | t}",
                        source: owner_code,
                        required: true,
                        disabledOn: "this.id != null"
                    },
                    {
                        label: "${'table.warehouseCode' | t}",
                        name: "warehouseCode",
                        type: "hidden",
                        value: warehouseCode
                    },
                    // {
                    //     "type": "switch",
                    //     "name": "suit",
                    //     "label": "是否套装"
                    // },

                    // 体积信息
                    {
                        label: "${'table.volume' | t}",
                        type: "input-number",
                        name: "volumeDTO.volume",
                        description: "mm³"
                    },
                    {
                        label: "${'table.length' | t}",
                        type: "input-number",
                        name: "volumeDTO.length",
                        description: "mm"
                    },
                    {
                        label: "${'table.width' | t}",
                        type: "input-number",
                        name: "volumeDTO.width",
                        description: "mm"
                    },
                    {
                        label: "${'table.height' | t}",
                        type: "input-number",
                        name: "volumeDTO.height",
                        description: "mm"
                    },

                    // 重量信息
                    {
                        label: "${'table.grossWeight' | t}",
                        type: "input-number",
                        name: "weight.grossWeight",
                        description: "${'table.milligram' | t}(mg)"
                    },
                    {
                        label: "${'table.netWeight' | t}",
                        type: "input-number",
                        name: "weight.netWeight",
                        description: "${'table.milligram' | t}(mg)"
                    },

                    // 图片属性
                    {
                        type: "input-text",
                        name: "skuAttribute.imageUrl",
                        label: "${'table.pictureAddress' | t}"
                    },
                    {
                        type: "input-text",
                        name: "skuAttribute.unit",
                        label: "${'table.unit' | t}"
                    },
                    {
                        type: "select",
                        name: "skuAttribute.skuFirstCategory",
                        label: "${'table.levelOneClassification' | t}",
                        source: "${SkuFirstCategory}"
                    },
                    {
                        type: "select",
                        name: "skuAttribute.skuSecondCategory",
                        label: "${'table.levelTwoClassification' | t}",
                        source: "${SkuSecondCategory}"
                    },
                    {
                        type: "select",
                        name: "skuAttribute.skuThirdCategory",
                        label: "${'table.levelThreeClassification' | t}",
                        source: "${SkuThirdCategory}"
                    },
                    {
                        type: "select",
                        name: "skuAttribute.skuAttributeCategory",
                        label: "${'table.SKUAttributeCategories' | t}",
                        source: "${SkuAttributeCategory}"
                    },
                    {
                        type: "select",
                        name: "skuAttribute.skuAttributeSubCategory",
                        label: "${'table.SKUAttributeSubcategory' | t}",
                        source: "${SkuAttributeSubCategory}"
                    }
                ]
            },
            {
                title: "${'form.tab.configurationInformation' | t}",
                controls: [
                    // 商品配置信息
                    {
                        type: "switch",
                        name: "skuConfig.enableSn",
                        label: "${'table.uniqueCodeManagement' | t}",
                        options: enable_options
                    },
                    {
                        type: "switch",
                        name: "skuConfig.enableEffective",
                        label: "${'table.expirationDateManagement' | t}",
                        options: enable_options
                    },
                    {
                        type: "input-text",
                        name: "skuConfig.shelfLife",
                        label: "${'table.shelfLife' | t}",
                        description: "${'table.days' | t}"
                    },
                    {
                        type: "input-text",
                        name: "skuConfig.effectiveDays",
                        label: "${'table.expirationDate' | t}",
                        description: "${'table.days' | t}"
                    },
                    {
                        type: "select",
                        name: "skuConfig.barcodeRuleCode",
                        label: "${'table.barcodeParsingRules' | t}"
                    },
                    {
                        type: "select",
                        name: "skuConfig.heat",
                        source: "${SkuHeat}",
                        label: "${'table.SKUHeat' | t}"
                    },
                    {
                        type: "input-number",
                        name: "skuConfig.maxCount",
                        label: "${'table.inventoryLimit' | t}"
                    },
                    {
                        type: "input-number",
                        name: "skuConfig.minCount",
                        label: "${'table.inventoryMinimum' | t}"
                    },
                    {
                        type: "switch",
                        name: "skuConfig.calculateHeat",
                        label: "${'table.calculateTheHeat' | t}"
                    },
                    {
                        type: "switch",
                        name: "skuConfig.noBarcode",
                        label: "${'table.WhetherUncodedSKU' | t}",
                        options: enable_options
                    },

                    // 商品条码信息
                    {
                        name: "skuBarcode.barcodes",
                        label: "${'skuArea.barcode' | t}",
                        mode: "horizontal",
                        type: "input-array",
                        inline: true,
                        removable: true,
                        items: {
                            type: "input-text",
                            clearable: false
                        }
                    }
                ]
            }
        ]
    }
]

const add = {
    type: "button",
    actionType: "drawer",
    icon: "fa fa-plus",
    label: "${'button.add' | t}",
    target: "role",
    drawer: {
        title: "${'button.add' | t}",
        closeOnEsc: true,
        body: {
            type: "form",
            api: api_sku_add,
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
        name: "skuCode",
        label: "${'skuArea.skuCode' | t}",
        searchable: true
    },
    {
        name: "skuName",
        label: "${'skuArea.productName' | t}",
        searchable: true
    },
    {
        name: "style",
        label: "${'table.style' | t}"
    },
    {
        name: "color",
        label: "${'table.color' | t}"
    },
    {
        name: "size",
        label: "${'table.size' | t}"
    },
    {
        name: "brand",
        label: "${'table.brand' | t}"
    },
    {
        name: "skuFirstCategory",
        label: "${'table.levelOneClassification' | t}",
        type: "mapping",
        source: "${SkuFirstCategory}"
    },
    {
        name: "skuSecondCategory",
        label: "${'table.levelTwoClassification' | t}",
        type: "mapping",
        source: "${SkuSecondCategory}"
    },
    {
        name: "skuThirdCategory",
        label: "${'table.levelThreeClassification' | t}",
        type: "mapping",
        source: "${SkuThirdCategory}"
    },
    {
        name: "skuAttributeCategory",
        label: "${'table.first-level_attributes' | t}",
        type: "mapping",
        source: "${SkuAttributeCategory}"
    },
    {
        name: "skuAttributeSubCategory",
        label: "${'table.second-level_attributes' | t}",
        type: "mapping",
        source: "${SkuAttributeSubCategory}"
    },
    ...create_update_columns
]

const searchIdentity = "MSkuMainData"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'SKUManagement.title' | t}",
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
                                title: "${'button.modify' | t}",
                                closeOnEsc: true,
                                closeOnOutside: true,
                                body: {
                                    type: "form",
                                    initApi: api_sku_get,
                                    api: api_sku_update,
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

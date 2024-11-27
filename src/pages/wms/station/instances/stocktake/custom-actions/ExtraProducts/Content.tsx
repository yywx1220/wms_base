import schema2component from "@/utils/schema2component"
import { CustomActionType } from "@/pages/wms/station/instances/stocktake/customActionType"
import { debounce } from "lodash"
import { DEBOUNCE_TIME } from "@/pages/wms/station/constant"
import {
    owner_code,
    owner_code_by_sku_code
} from "@/pages/wms/constants/select_search_api_contant"
import { create_update_columns } from "@/utils/commonContants"
import { toast } from "amis"
import { Translation } from "react-i18next"
import React from "react"

let warehouseCode = localStorage.getItem("warehouseCode")

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
        label: "table.ruleEncoding",
        searchable: true
    },
    {
        name: "name",
        label: "table.ruleName",
        searchable: true
    },
    {
        name: "ownerCode",
        label: "table.productOwner",
        type: "mapping",
        source: owner_code
    },
    {
        name: "skuFirstCategory",
        label: "table.SKUCategories",
        type: "mapping",
        source: "${SkuFirstCategory}"
    },
    {
        name: "batchAttributeFieldConfigs",
        label: "批次属性"
        // dbField: "json_array(batch_attribute_field_configs)"
        // type: "mapping",
        // source: "${SkuFirstCategory}",
    },
    ...create_update_columns
]

const schema = {
    type: "page",
    title: <Translation>{(t) => t("button.extraProducts")}</Translation>,
    data: {
        containerCode:
            "${ls: sseInfo | pick:workLocationArea | pick:workLocationViews | first | pick:workLocationSlots | first | pick:arrivedContainer | pick:containerCode }",
        containerSlotCode:
            "${ls: sseInfo | pick:workLocationArea | pick:workLocationViews | first | pick:workLocationSlots | first | pick:arrivedContainer | pick:activeSlotCodes | first }"
    },
    body: {
        type: "form",
        id: "extra_form",
        // resetAfterSubmit: true,
        wrapWithPanel: false,
        mode: "horizontal",
        preventEnterSubmit: true,
        // debug: true,
        body: [
            {
                type: "group",
                body: [
                    {
                        type: "select",
                        name: "ownerCode",
                        id: "ownerCode",
                        required: true,
                        label: "table.productOwner",
                        source: owner_code,
                        onEvent: {
                            change: {
                                actions: [
                                    {
                                        actionType: "reload",
                                        componentId: "service_form",
                                        data: {
                                            ownerCode: "${event.data.value}"
                                        }
                                    },
                                    {
                                        actionType: "clear",
                                        componentId: "barcode"
                                    }
                                ]
                            }
                        }
                    },
                    {
                        type: "input-text",
                        name: "barcode",
                        label: "skuArea.barcode",
                        id: "barcode",
                        source: [],
                        clearable: true,
                        required: true,
                        disabledOn: "${!ownerCode}",
                        onEvent: {
                            enter: {
                                actions: [
                                    {
                                        actionType: "ajax",
                                        api: {
                                            url: "/wms/barcodeParseRule/parseSku",
                                            method: "post",
                                            data: {
                                                barcode: "${event.data.value}",
                                                ownerCode: "${ownerCode}",
                                                businessFlow: "STOCKTAKE",
                                                executeTime: "SCAN_SKU"
                                            },
                                            responseData: {
                                                skuCode: "${skuCode}",
                                                skuId: "${id}"
                                            }
                                        }
                                    },
                                    {
                                        actionType: "setValue",
                                        componentId: "extra_form",
                                        args: {
                                            value: {
                                                skuId: "${event.data.responseResult.responseStatus === 0 ? event.data.responseResult.skuId : ''}",
                                                skuCode:
                                                    "${event.data.responseResult.responseStatus === 0 ? event.data.responseResult.skuCode : ''}"
                                            }
                                        }
                                        // expression:
                                        //     "${event.data.responseResult.responseStatus === 0}"
                                    },
                                    {
                                        actionType: "reload",
                                        componentId: "crud2_table",
                                        data: {
                                            skuCode: "${skuCode}"
                                        }
                                        // expression:
                                        //     "${event.data.responseResult.responseStatus === 0}"
                                    }
                                ]
                            },
                            clear: {
                                actions: [
                                    {
                                        actionType: "setValue",
                                        componentId: "extra_form",
                                        args: {
                                            value: {
                                                skuId: "",
                                                skuCode: "",
                                                skuBatchAttributeId: "",
                                                skuAttributes: ""
                                            }
                                        }
                                    },
                                    {
                                        actionType: "reload",
                                        componentId: "crud2_table",
                                        data: {
                                            skuCode: ""
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    {
                        type: "input-number",
                        name: "stocktakeQty",
                        label: "table.quantity",
                        displayMode: "enhance",
                        min: 1,
                        max: 10000,
                        required: true
                    }
                ]
            },
            {
                type: "group",
                body: [
                    {
                        type: "input-text",
                        name: "containerCode",
                        label: "table.containerNumber",
                        disabled: true,
                        columnRatio: 4
                    },
                    {
                        type: "select",
                        name: "containerSlotCode",
                        label: "table.containerSlotCode",
                        disabled: true,
                        columnRatio: 4
                    }
                ]
            },
            {
                type: "tabs",
                tabsMode: "radio",
                name: "tabName",
                tabs: [
                    {
                        title: "form.inverntory.originalBatch",
                        value: "ORIGINAL",
                        body: {
                            type: "crud2",
                            id: "crud2_table",
                            placeholder: "table.noData",
                            required: true,
                            rowSelection: {
                                type: "radio",
                                keyField: "id",
                                rowClick: true
                            },
                            api: container_code_table,
                            onEvent: {
                                selectedChange: {
                                    actions: [
                                        {
                                            actionType: "setValue",
                                            componentId: "extra_form",
                                            args: {
                                                value: {
                                                    skuBatchAttributeId:
                                                        "${selectedItems | pick:id | first}",
                                                    skuAttributes:
                                                        "${selectedItems | pick:skuAttributes | first}"
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                ],
                onEvent: {
                    change: {
                        actions: [
                            {
                                actionType: "setValue",
                                componentId: "extra_form",
                                args: {
                                    value: {
                                        skuBatchAttributeId: "",
                                        skuAttributes: ""
                                    }
                                }
                            },
                            {
                                actionType: "reload",
                                componentId: "crud2_table",
                                expression: "${tabName === 1 && skuCode}"
                            }
                        ]
                    }
                }
            },
            {
                type: "submit",
                label: "button.submit",
                level: "primary",
                size: "lg",
                className: "fixed bottom-8 right-12",
                onClick: async (_e: any, props: any) => {
                    const { scope, onCustomActionDispatch } = props
                    if (
                        !(
                            scope.skuId &&
                            scope.ownerCode &&
                            scope.stocktakeQty &&
                            scope.skuAttributes
                        )
                    ) {
                        if (
                            scope.tabName === "ORIGINAL" &&
                            !scope.skuAttributes
                        ) {
                            toast["error"]("please select a batch!")
                        }
                        return
                    }

                    const params = {
                        ...scope,
                        containerFace: scope.containerSlotCode?.slice(0, 1)
                    }
                    const { code } = await onCustomActionDispatch({
                        eventCode: CustomActionType.STOCKTAKE_SURPLUS_SKU,
                        data: params
                    })

                    if (code !== "-1") {
                        props.setModalVisible(false)
                    }
                }
            }
        ]
    }
}

export default schema2component(schema)

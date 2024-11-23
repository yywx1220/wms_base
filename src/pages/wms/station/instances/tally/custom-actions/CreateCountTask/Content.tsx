import schema2component from "@/utils/schema2component"

import { Translation } from "react-i18next"
import { api_stocktake_order_add } from "@/pages/wms/data_center/constants/api_constant"
import React from "react"
import { toast } from "amis"
import {
    owner_code,
    stock_id_table,
    warehouse_area_id,
    warehouse_logic_id
} from "@/pages/wms/constants/select_search_api_contant"
import { CustomActionType } from "@/pages/wms/station/instances/stocktake/customActionType"

let warehouseCode = localStorage.getItem("warehouseCode")

let barCodeCondition = {
    "barCode-op": "il",
    barCode: "${barCode}"
}
let areaConditions =
    "&warehouseAreaCode-op=eq&warehouseAreaId=${warehouseAreaId}" +
    "&warehouseLogicCode-op=eq&warehouseLogicCode=${warehouseLogicCode}" +
    "&ownerCode-op=eq&ownerCode=${ownerCode}"

const schema = {
    type: "page",
    title: "modal.receiveInventoryList",
    initApi: "post:/mdm/config/dictionary/getAll",
    body: {
        type: "wizard",
        actionFinishLabel: "modal.generateInventoryOrder",
        // api: api_stocktake_order_add,
        preventEnterSubmit: true,
        reload: "stocktakeOrderTable",
        id: "wizardComponent",
        steps: [
            {
                // title: "modal.selectInventoryArea",
                title: (
                    <Translation>
                        {(t) => t("modal.selectInventoryArea")}
                    </Translation>
                ),
                body: [
                    {
                        type: "hidden",
                        name: "id"
                    },
                    {
                        type: "hidden",
                        name: "stocktakeCreateMethod",
                        value: "MANUAL"
                    },
                    {
                        type: "select",
                        name: "warehouseAreaId",
                        label: "workLocationArea.warehouseArea",
                        selectFirst: true,
                        source: {
                            ...warehouse_area_id,
                            url:
                                warehouse_area_id.url +
                                "&warehouseAreaWorkType=ROBOT"
                        },
                        required: true,
                        className: "warehouseArea"
                    },
                    {
                        type: "select",
                        name: "warehouseLogicId",
                        // "initFetchOn": "data.warehouseAreaCode",
                        label: "table.logicArea",
                        clearable: true,
                        source: warehouse_logic_id,
                        className: "warehouseLogic"
                    },
                    {
                        type: "select",
                        name: "ownerCode",
                        label: "table.productOwner",
                        clearable: true,
                        source: owner_code,
                        className: "ownerCode"
                    }
                ],
                actions: [
                    {
                        label: "Next",
                        type: "button",
                        actionType: "next",
                        level: "primary",
                        className: "nextButton"
                    }
                ]
            },
            {
                title: (
                    <Translation>
                        {(t) => t("modal.selectCountingRules")}
                    </Translation>
                ),

                body: [
                    {
                        type: "button-group-select",
                        name: "stocktakeType",
                        label: "table.countType",
                        selectFirst: true,
                        source: "${StocktakeType}",
                        required: true,
                        className: "stocktakeType"
                    },
                    {
                        type: "button-group-select",
                        name: "stocktakeMethod",
                        selectFirst: true,
                        label: "table.countMethod",
                        source: "${StocktakeMethod}",
                        required: true,
                        className: "stocktakeMethod"
                    }
                    // {
                    //     "type": "button-group-select",
                    //     "name": "businessType",
                    //     "label": "动碰类型",
                    //     "source": "${ActiveBusinessType}"
                    // },
                    // {
                    //     "type": "input-date-range",
                    //     "valueFormat": "x",
                    //     "name": "activeDateRange",
                    //     "label": "动碰时间"
                    // },
                    // 暂时隐藏盘点0库存、盘点空格口
                    // {
                    //     type: "switch",
                    //     name: "isStocktakeZeroStockSku",
                    //     label: "modal.inventory0ItemsInStock"
                    // },
                    // {
                    //     type: "switch",
                    //     name: "isStocktakeEmptySlot",
                    //     label: "modal.spaceCouting"
                    // }
                ],
                actions: [
                    {
                        label: "Prev",
                        type: "button",
                        actionType: "prev"
                    },
                    {
                        label: "Next",
                        type: "button",
                        actionType: "next",
                        level: "primary",
                        className: "nextButton"
                    }
                ]
            },
            {
                title: (
                    <Translation>
                        {(t) => t("modal.selectCountingTarget")}
                    </Translation>
                ),
                wrapperComponent: "div",
                body: {
                    type: "tabs",
                    name: "stocktakeUnitType",
                    tabsMode: "strong",
                    tabs: [
                        // {
                        //     title: "modal.countByShelf",
                        //     value: "SHELF",
                        //     tab: {
                        //         type: "transfer",
                        //         name: "shelfCodes",
                        //         joinValues: false,
                        //         extractValue: true,
                        //         selectMode: "table",
                        //         // "required": true,
                        //         source: {
                        //             ...shelf_code_table,
                        //             url: shelf_code_table.url + areaConditions
                        //         },
                        //         pagination: {
                        //             enable: true,
                        //             layout: ["pager", "perpage", "total"]
                        //         },
                        //         columns: [
                        //             {
                        //                 name: "label",
                        //                 label: (
                        //                     <Translation>
                        //                         {(t) => t("table.shelfCoding")}
                        //                     </Translation>
                        //                 )
                        //             },
                        //             {
                        //                 name: "locationCode",
                        //                 label: (
                        //                     <Translation>
                        //                         {(t) => t("table.locationCode")}
                        //                     </Translation>
                        //                 )
                        //             }
                        //         ]
                        //     }
                        // },
                        {
                            title: (
                                <Translation>
                                    {(t) => t("modal.countByProduct")}
                                </Translation>
                            ),
                            value: "STOCK",
                            body: {
                                type: "form",
                                wrapWithPanel: false,
                                id: "stepForm",
                                body: [
                                    {
                                        name: "barCode",
                                        id: "barCode",
                                        type: "input-text",
                                        multiple: true,
                                        placeholder:
                                            "skuArea.scanBarcode",
                                        trimContents: true,
                                        clearable: true,
                                        className:
                                            "w-4/5	inline-block mr-3 align-top	",
                                        source: [],
                                        onEvent: {
                                            enter: {
                                                actions: [
                                                    {
                                                        componentId:
                                                            "service-reload",
                                                        actionType: "reload",
                                                        data: {
                                                            barCode:
                                                                "${event.data.value}"
                                                        }
                                                    }
                                                ]
                                            },
                                            clear: {
                                                actions: [
                                                    {
                                                        componentId:
                                                            "service-reload",
                                                        actionType: "reload",
                                                        data: {
                                                            barCode:
                                                                "${event.data.value}"
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        type: "input-file",
                                        name: "file",
                                        id: "import_file",
                                        accept: ".xls,.xlsx,.csv",
                                        receiver: {
                                            url: "/mdm/common-import/parse"
                                        },
                                        className:
                                            "inline-block w-1/6 align-top",
                                        btnLabel:
                                            "button.import Excel",
                                        onEvent: {
                                            success: {
                                                actions: [
                                                    {
                                                        actionType: "reload",
                                                        componentId:
                                                            "service-reload",
                                                        data: {
                                                            barCode:
                                                                "${event.data.result.list | pick:barcode | join}"
                                                        }
                                                    }
                                                ]
                                            },
                                            remove: {
                                                actions: [
                                                    {
                                                        actionType: "reload",
                                                        componentId:
                                                            "service-reload",
                                                        data: {
                                                            barCode: ""
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        type: "service",
                                        id: "service-reload",
                                        name: "service-reload",
                                        // body: "当前时间：${options}",
                                        api: {
                                            ...stock_id_table,
                                            url:
                                                stock_id_table.url +
                                                areaConditions,
                                            data: {
                                                ...stock_id_table.data,
                                                ...barCodeCondition
                                            },
                                            responseData: {
                                                options: "${items}"
                                            }
                                        },
                                        body: {
                                            type: "transfer",
                                            name: "stockIds",
                                            joinValues: false,
                                            extractValue: true,
                                            selectMode: "table",
                                            affixHeader: true,
                                            resultListModeFollowSelect: true,
                                            id: "transferTable",
                                            virtualThreshold: 10,
                                            // searchable: true,
                                            // searchPlaceholder: "请扫描商品条码",
                                            "en-US": {
                                                searchPlaceholder:
                                                    "Please scan the product bar code"
                                            },
                                            source: "${options}",
                                            // source: "${transferOptions}",
                                            pagination: {
                                                enable: false,
                                                layout: [
                                                    "pager",
                                                    "perpage",
                                                    "total"
                                                ]
                                            },
                                            columns: [
                                                {
                                                    name: "barCodeList",
                                                    label: (
                                                        <Translation>
                                                            {(t) =>
                                                                t(
                                                                    "skuArea.barcode"
                                                                )
                                                            }
                                                        </Translation>
                                                    )
                                                },
                                                // {
                                                //     name: "skuName",
                                                //     label: (
                                                //         <Translation>
                                                //             {(t) =>
                                                //                 t("skuArea.productName")
                                                //             }
                                                //         </Translation>
                                                //     ),
                                                // },
                                                {
                                                    name: "totalQty",
                                                    label: (
                                                        <Translation>
                                                            {(t) =>
                                                                t(
                                                                    "table.inventoryQuantity"
                                                                )
                                                            }
                                                        </Translation>
                                                    )
                                                },
                                                {
                                                    name: "ownerCode",
                                                    label: (
                                                        <Translation>
                                                            {(t) =>
                                                                t(
                                                                    "table.productOwner"
                                                                )
                                                            }
                                                        </Translation>
                                                    )
                                                },
                                                {
                                                    name: "containerCode",
                                                    label: (
                                                        <Translation>
                                                            {(t) =>
                                                                t(
                                                                    "table.containerCode"
                                                                )
                                                            }
                                                        </Translation>
                                                    )
                                                },
                                                {
                                                    name: "containerFace",
                                                    label: (
                                                        <Translation>
                                                            {(t) =>
                                                                t(
                                                                    "workLocationArea.face"
                                                                )
                                                            }
                                                        </Translation>
                                                    )
                                                },
                                                {
                                                    name: "containerSlotCode",
                                                    label: (
                                                        <Translation>
                                                            {(t) =>
                                                                t(
                                                                    "table.containerSlotCode"
                                                                )
                                                            }
                                                        </Translation>
                                                    )
                                                }
                                            ],
                                            onEvent: {
                                                change: {
                                                    actions: [
                                                        {
                                                            componentId:
                                                                "wizardComponent",
                                                            actionType:
                                                                "setValue",
                                                            args: {
                                                                value: {
                                                                    stockIds:
                                                                        "${event.data.value}"
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                },
                actions: [
                    {
                        label: "Prev",
                        type: "button",
                        onEvent: {
                            click: {
                                actions: [
                                    {
                                        actionType: "clear",
                                        componentId: "stepForm"
                                    },
                                    {
                                        actionType: "prev",
                                        componentId: "wizardComponent"
                                    }
                                ]
                            }
                        }
                    },
                    {
                        label: "modal.generateInventoryOrder",
                        type: "submit",
                        level: "primary",
                        actionType: "submit",
                        className: "generateInventoryOrder",
                        onClick: async (_e: any, props: any) => {
                            console.log("props", props)
                            if (
                                !props.scope.stockIds ||
                                props.scope.stockIds.length === 0
                            ) {
                                toast["error"](
                                    "Please select the products you want to count",
                                    "消息"
                                )
                                return
                                // return false
                            }
                            const params = { ...props.scope, warehouseCode }
                            delete params.options
                            delete params.file
                            // return true
                            const { code } = await props.onCustomActionDispatch(
                                {
                                    eventCode:
                                        CustomActionType.STOCKTAKE_CREATE_ORDER,
                                    data: params
                                }
                            )
                            if (code !== "-1") {
                                props.setModalVisible(false)
                            }
                        }
                    }
                ]
            }
        ]
    }
}

export default schema2component(schema)

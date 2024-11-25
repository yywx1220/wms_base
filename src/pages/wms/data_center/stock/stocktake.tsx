import schema2component from "@/utils/schema2component"
import {
    owner_code,
    stock_id_table,
    warehouse_area_id,
    warehouse_logic_id
} from "@/pages/wms/constants/select_search_api_contant"
import {api_stocktake_order_add} from "@/pages/wms/data_center/constants/api_constant"
import {create_update_columns, yes_no_options} from "@/utils/commonContants"
import React from "react"
import {Translation} from "react-i18next"
import {toast} from "amis"

let warehouseCode = localStorage.getItem("warehouseCode")

let areaConditions =
    "&warehouseAreaId-eq=${warehouseAreaId}" +
    "&warehouseLogicCode-eq=${warehouseLogicCode}" +
    "&ownerCode-eq=${ownerCode}"

let barCodeCondition = {
    "barCode-il": "${barCode | split}"
}

const ShelfCountColumns = [
    {
        name: "label",
        label: <Translation>{(t) => t("table.shelfCoding")}</Translation>
    },
    {
        name: "locationCode",
        label: <Translation>{(t) => t("table.locationCode")}</Translation>
    }
]

const SKUCountColumns = [
    {
        name: "barCodeList",
        label: <Translation>{(t) => t("skuArea.barcode")}</Translation>
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
        label: <Translation>{(t) => t("table.inventoryQuantity")}</Translation>
    },
    {
        name: "ownerCode",
        label: <Translation>{(t) => t("table.productOwner")}</Translation>
    },
    {
        name: "containerCode",
        label: <Translation>{(t) => t("table.containerCode")}</Translation>
    },
    {
        name: "containerFace",
        label: <Translation>{(t) => t("workLocationArea.face")}</Translation>
    },
    {
        name: "containerSlotCode",
        label: <Translation>{(t) => t("table.containerSlotCode")}</Translation>
    }
]

const dialog = {
    type: "wizard",
    actionFinishLabel: "modal.generateInventoryOrder",
    api: api_stocktake_order_add,
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
                },
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
                {
                    type: "switch",
                    name: "includeZeroStock",
                    label: "modal.inventory0ItemsInStock"
                },
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
                    //     hiddenOn: "${stocktakeType === 'DISCREPANCY_REVIEW'}",
                    //     disabledOn: "${stockIds.length > 0}",
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
                    //         columns: ShelfCountColumns
                    //     }
                    // },
                    {
                        title: (
                            <Translation>
                                {(t) => t("modal.countByProduct")}
                            </Translation>
                        ),
                        value: "STOCK",
                        hiddenOn: "${stocktakeType === 'DISCREPANCY_REVIEW'}",
                        body: {
                            type: "form",
                            wrapWithPanel: false,
                            id: "step2Form",
                            body: [
                                {
                                    name: "barCode",
                                    id: "barCode",
                                    type: "input-text",
                                    multiple: true,
                                    placeholder: "skuArea.scanBarcode",
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
                                                        "skuCount-service-reload",
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
                                                        "skuCount-service-reload",
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
                                    className: "inline-block w-1/6 align-top",
                                    btnLabel: "button.import Excel",
                                    onEvent: {
                                        success: {
                                            actions: [
                                                {
                                                    actionType: "reload",
                                                    componentId:
                                                        "skuCount-service-reload",
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
                                    id: "skuCount-service-reload",
                                    name: "skuCount-service-reload",
                                    // body: "当前时间：${options}",
                                    api: {
                                        ...stock_id_table,
                                        url:
                                            stock_id_table.url + areaConditions,
                                        data: {
                                            ...stock_id_table.data,
                                            ...barCodeCondition,
                                            "includeZeroStock": "${includeZeroStock}",
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
                                        columns: SKUCountColumns,
                                        onEvent: {
                                            change: {
                                                actions: [
                                                    {
                                                        componentId:
                                                            "wizardComponent",
                                                        actionType: "setValue",
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
                    onClick: (_e: any, props: any) => {
                        if (
                            !props.scope.stockIds ||
                            props.scope.stockIds.length === 0
                        ) {
                            toast["error"](
                                "Please select the products you want to count",
                                "消息"
                            )
                            return false
                        }
                        return true
                    }
                }
            ]
        }
    ]
}

const add = {
    type: "button",
    actionType: "dialog",
    icon: "fa fa-plus",
    label: "button.add",
    dialog: {
        title: "button.add",
        actions: [],
        closeOnEsc: true,
        size: "xl",
        body: dialog
    },
    className: "inventoryCountAddButton"
}

const columns = [
    {
        name: "id",
        label: "ID",
        hidden: true
    },
    {
        name: "warehouseCode",
        label: "table.warehouse",
        hidden: true
    },
    {
        name: "orderNo",
        label: "table.countOrderNumber",
        searchable: true
    },
    {
        name: "stocktakeType",
        label: "table.orderType",
        type: "mapping",
        source: "${StocktakeType}",
        searchable: {
            type: "select",
            source: "${StocktakeType}"
        }
    },
    {
        name: "stocktakeCreateMethod",
        label: "table.howItWasCreated",
        type: "mapping",
        source: "${StocktakeCreateMethod}",
        searchable: {
            type: "select",
            source: "${StocktakeCreateMethod}"
        }
    },
    {
        name: "stocktakeUnitType",
        label: "table.creationType",
        type: "mapping",
        source: "${StocktakeUnitType}",
        searchable: {
            type: "select",
            source: "${StocktakeUnitType}"
        }
    },
    {
        name: "stocktakeOrderStatus",
        label: "table.status",
        type: "mapping",
        source: "${StocktakeOrderStatus}",
        searchable: {
            type: "select",
            source: "${StocktakeOrderStatus}"
        },
        classNameExpr:
            "${ stocktakeOrderStatus === 'STARTED' ? 'startStatus' : '' }"
    },
    {
        name: "warehouseAreaId",
        label: "table.warehouseAreaBelongs",
        type: "mapping",
        source: warehouse_area_id,
        searchable: {
            type: "select",
            source: warehouse_area_id
        }
    },
    {
        name: "warehouseLogicId",
        label: "table.logicalAreaName",
        type: "mapping",
        source: warehouse_logic_id,
        searchable: {
            type: "select",
            source: warehouse_logic_id
        }
    },
    {
        name: "suspend",
        label: "table.pendingOrderID",
        type: "mapping",
        map: yes_no_options,
        searchable: {
            type: "select",
            options: yes_no_options
        }
    },
    {
        name: "abnormal",
        label: "table.exceptionIdentification",
        type: "mapping",
        map: yes_no_options,
        searchable: {
            type: "select",
            options: yes_no_options
        }
    },
    ...create_update_columns
]

const detailColumns_STOCK = [
    {
        name: "stocktakeOrderId",
        label: "盘点单ID",
        hidden: true
    },
    {
        name: "unitId",
        label: "盘点单位ID",
        hidden: true
    },
    {
        name: "barCodeList",
        label: "skuArea.barcode"
    },
    {
        name: "skuName",
        label: "skuArea.productName"
    },
    {
        name: "ownerCode",
        label: "table.productOwner"
    },
    {
        name: "containerCode",
        label: "table.containerCode"
    },
    {
        name: "containerFace",
        label: "workLocationArea.face"
    },
    {
        name: "containerSlotCode",
        label: "table.containerSlotCode"
    }
]

const detailColumns_SHELF = [
    {
        name: "stocktakeOrderId",
        label: "盘点单ID",
        hidden: true
    },
    {
        name: "containerCode",
        label: "table.containerCode"
    },
    {
        name: "containerFace",
        label: "workLocationArea.face"
    },
    {
        name: "containerSlotCode",
        label: "table.containerSlotCode"
    }
]

const recordColumns = [
    {
        name: "id",
        label: "盘点记录ID",
        hidden: true
    },
    {
        name: "stocktakeOrderId",
        label: "盘点单ID",
        hidden: true
    },
    {
        name: "barCodeList",
        label: "skuArea.barcode"
    },
    {
        name: "skuName",
        label: "skuArea.productName"
    },
    {
        name: "warehouseCode",
        label: "table.warehouse"
    },
    // {
    //     name: "ownerCode",
    //     label: "货主"
    // },
    {
        name: "containerCode",
        label: "table.containerCode"
    },
    {
        name: "containerFace",
        label: "workLocationArea.face"
    },
    {
        name: "containerSlotCode",
        label: "table.containerSlotCode"
    },
    {
        name: "qtyOriginal",
        label: "table.inventoryQuantity"
    },
    {
        name: "qtyStocktake",
        label: "table.countQty"
    },
    {
        name: "stocktakeRecordStatus",
        label: "table.status",
        type: "mapping",
        source: "${StocktakeRecordStatus}"
    }
]

const detailDialog_STOCK = {
    title: "inventoryCounting.detail.modal.title",
    actions: [],
    closeOnEsc: true,
    closeOnOutside: true,
    size: "xl",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "stocktakeOrderDetailTableForSKU",
            api: {
                method: "POST",
                url: "/search/searchV2?page=${page}&perPage=${perPage}&stocktakeOrderId-eq=${id}",
                dataType: "application/json"
            },
            defaultParams: {
                searchIdentity: "findStocktakeOrderDetailByOrderId-STOCK",
            },
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: detailColumns_STOCK
        }
    ]
}

const DetailDialog_SHELF = {
    title: "inventoryCounting.detail.modal.title",
    actions: [],
    closeOnEsc: true,
    closeOnOutside: true,
    size: "xl",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "stocktakeOrderDetailTableForSHELF",
            api: {
                method: "POST",
                url: "/search/searchV2?page=${page}&perPage=${perPage}&stocktakeOrderId-eq=${id}",
                dataType: "application/json"
            },
            defaultParams: {
                searchIdentity: "findStocktakeOrderDetailByOrderId-SHELF",
            },
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: detailColumns_SHELF
        }
    ]
}

const recordDialog = {
    title: "button.inventoryRecord",
    actions: [],
    closeOnEsc: true,
    closeOnOutside: true,
    size: "xl",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "stocktakeRecordTable",
            api: {
                method: "POST",
                url: "/search/searchV2?page=${page}&perPage=${perPage}&stocktakeOrderId-eq=${id}",
                dataType: "application/json"
            },
            defaultParams: {
                searchIdentity: "findStocktakeRecordByOrderId",
            },
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: recordColumns
        }
    ]
}

const schema = {
    type: "page",
    title: "wms.menu.inventoryCheck",
    toolbar: [],
    initApi: "post:/mdm/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "stocktakeOrderTable",

            api: {
                method: "POST",
                url:
                    "/search/searchV2?page=${page}&perPage=${perPage}&warehouseCode-eq=" +
                    warehouseCode,
                dataType: "application/json",
                data: {
                    searchIdentity: "searchStocktakeOrder",
                    "orderNo-ct": "${orderNo}",
                    "stocktakeType-eq": "${stocktakeType}",
                    "stocktakeCreateMethod-eq": "${stocktakeCreateMethod}",
                    "stocktakeUnitType-eq": "${stocktakeUnitType}",
                    "stocktakeOrderStatus-eq": "${stocktakeOrderStatus}",
                    "warehouseAreaId-eq": "${warehouseAreaId}",
                    "warehouseLogicId-eq": "${warehouseLogicId}",
                    "suspend-eq": "${suspend}",
                    "abnormal-eq": "${abnormal}",
                    "createTime-bt": "${createTime}",
                },
            },
            autoFillHeight: true,
            autoGenerateFilter: {
                columnsNum: 3,
                showBtnToolbar: true
            },
            headerToolbar: ["reload", add],
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: [
                ...columns,
                {
                    type: "operation",
                    label: "table.operation",
                    // width: 130,
                    buttons: [
                        {
                            label: "button.detail",
                            type: "button",
                            actionType: "dialog",
                            dialog: detailDialog_STOCK,
                            visibleOn: "${stocktakeUnitType === 'STOCK'}"
                        },
                        {
                            label: "button.detail",
                            type: "button",
                            actionType: "dialog",
                            dialog: DetailDialog_SHELF,
                            visibleOn: "${stocktakeUnitType === 'SHELF'}"
                        },
                        {
                            label: "button.inventoryRecord",
                            type: "button",
                            actionType: "dialog",
                            dialog: recordDialog
                        }
                    ]
                }
            ]
        }
    ]
}

export default schema2component(schema)

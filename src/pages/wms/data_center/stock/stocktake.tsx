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
        label: "table.shelfCoding"
    },
    {
        name: "locationCode",
        label: "table.locationCode"
    }
]

const SKUCountColumns = [
    {
        name: "barCodeList",
        label: "skuArea.barcode"
    },
    {
        name: "totalQty",
        label: "table.inventoryQuantity"
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

const dialog = {
    type: "wizard",
    actionFinishLabel: "modal.generateInventoryOrder",
    api: api_stocktake_order_add,
    preventEnterSubmit: true,
    reload: "stocktakeOrderTable",
    id: "wizardComponent",
    steps: [
        {
            title: "modal.selectInventoryArea",
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
            title: "modal.selectCountingRules",
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
                {
                    type: "switch",
                    name: "includeZeroStock",
                    label: "modal.inventory0ItemsInStock"
                },
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
            title: "modal.selectCountingTarget",
            wrapperComponent: "div",
            body: {
                type: "tabs",
                name: "stocktakeUnitType",
                tabsMode: "strong",
                tabs: [{
                        title: "modal.countByProduct",
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
                                        "en-US": {
                                            searchPlaceholder:
                                                "Please scan the product bar code"
                                        },
                                        source: "${options}",
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

const detailColumns = [
    {
        name: "stocktakeOrderId",
        label: "盘点单ID",
        hidden: true
    },
    {
        name: "stocktakeUnitType",
        label: "table.stocktakeUnitType"
    },
    {
        name: "unitCode",
        label: "table.unitCode"
    },
    {
        name: "unitId",
        label: "table.unitId"
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

const searchIdentity = "WStocktakeOrder"
const searchDetailIdentity = "WStocktakeOrderDetail"

const detailDialog = {
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
                url: "/search/search?page=${page}&perPage=${perPage}&stocktakeOrderId-eq=${id}",
                dataType: "application/json"
            },
            defaultParams: {
                searchIdentity: searchDetailIdentity,
            },
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: detailColumns
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
                url: "/search/search?page=${page}&perPage=${perPage}&stocktakeOrderId-eq=${id}",
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
                    "/search/search?page=${page}&perPage=${perPage}&warehouseCode-eq=" +
                    warehouseCode,
                dataType: "application/json",
                data: {
                    searchIdentity: searchIdentity,
                    showColumns: columns
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
                            dialog: detailDialog
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

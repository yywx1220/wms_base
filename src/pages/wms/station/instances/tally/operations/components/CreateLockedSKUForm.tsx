import schema2component from "@/utils/schema2component"
import { Translation } from "react-i18next"
import React from "react"
import {
    stock_abnormal_table,
    warehouse_area_id
} from "@/pages/wms/constants/select_search_api_contant"
import { toast } from "amis"
import { CustomActionType } from "@/pages/wms/station/instances/stocktake/customActionType"

let areaConditions =
    "&warehouseAreaCode-op=eq&warehouseAreaId=${warehouseAreaId}" +
    "&warehouseLogicCode-op=eq&warehouseLogicCode=${warehouseLogicCode}" +
    "&ownerCode-op=eq&ownerCode=${ownerCode}"

let barCodeCondition = {
    "barCodeList-op": "il",
    barCodeList: "${barCode}"
}
let warehouseCode = localStorage.getItem("warehouseCode")

const schema = {
    type: "page",
    body: {
        type: "form",
        title: (
            <Translation>
                {(t) => t("form.inverntory.createByLockingSku")}
            </Translation>
        ),
        mode: "horizontal",
        labelWidth: 0,
        id: "stepForm",
        initApi: "/config/dictionary/getAll",
        body: [
            {
                type: "service",
                id: "service-reload",
                name: "service-reload",
                api: {
                    ...stock_abnormal_table,
                    url: stock_abnormal_table.url,
                    data: {
                        ...stock_abnormal_table.data
                        // ...barCodeCondition
                    },
                    responseData: {
                        options: "${items}"
                    }
                },
                body: {
                    type: "transfer",
                    name: "stockAbnormalRecordIds",
                    joinValues: false,
                    extractValue: true,
                    selectMode: "table",
                    affixHeader: true,
                    resultListModeFollowSelect: true,
                    id: "transferTable",
                    virtualThreshold: 10,
                    "en-US": {
                        searchPlaceholder: "Please scan the product bar code"
                    },
                    source: "${options}",
                    pagination: {
                        enable: false,
                        layout: ["pager", "perpage", "total"]
                    },
                    columns: [
                        {
                            name: "barCodeList",
                            label: (
                                <Translation>
                                    {(t) => t("skuArea.barcode")}
                                </Translation>
                            )
                        },
                        {
                            name: "totalQty",
                            label: (
                                <Translation>
                                    {(t) => t("table.inventoryQuantity")}
                                </Translation>
                            )
                        },
                        {
                            name: "qtyAbnormal",
                            label: (
                                <Translation>
                                    {(t) => t("table.profit")}
                                </Translation>
                            )
                        },
                        {
                            name: "stockAbnormalReason",
                            label: (
                                <Translation>
                                    {(t) => t("table.differenceReason")}
                                </Translation>
                            ),
                            type: "mapping",
                            source: "${StockAbnormalReason}"
                        },
                        {
                            name: "ownerCode",
                            label: (
                                <Translation>
                                    {(t) => t("table.productOwner")}
                                </Translation>
                            )
                        },
                        {
                            name: "containerCode",
                            label: (
                                <Translation>
                                    {(t) => t("table.containerCode")}
                                </Translation>
                            )
                        },
                        {
                            name: "containerFace",
                            label: (
                                <Translation>
                                    {(t) => t("workLocationArea.face")}
                                </Translation>
                            )
                        },
                        {
                            name: "containerSlotCode",
                            label: (
                                <Translation>
                                    {(t) => t("table.containerSlotCode")}
                                </Translation>
                            )
                        },
                        {
                            name: "reasonDesc",
                            label: (
                                <Translation>
                                    {(t) => t("table.causeDescription")}
                                </Translation>
                            )
                        }
                    ]
                }
            }
        ],
        actions: [
            {
                label: "${'button.submit' | t}",
                type: "button",
                actionType: "submit",
                level: "primary",
                onClick: (_e: any, props: any) => {
                    const { scope, warehouseAreaId, onCustomActionDispatch } =
                        props
                    if (
                        !scope.stockAbnormalRecordIds ||
                        scope.stockAbnormalRecordIds.length === 0
                    ) {
                        toast["error"](
                            "Please select the products you want to count",
                            "消息"
                        )
                        _e.preventDefault()
                        return
                    }
                    const params = {
                        stockAbnormalRecordIds: scope.stockAbnormalRecordIds,
                        warehouseCode,
                        warehouseAreaId,
                        stocktakeType: "DISCREPANCY_REVIEW",
                        stocktakeMethod: "INFORMED",
                        stocktakeUnitType: "STOCK",
                        stocktakeCreateMethod: "MANUAL"
                    }
                    onCustomActionDispatch({
                        eventCode: CustomActionType.STOCKTAKE_CREATE_ORDER,
                        data: params
                    })
                }
            }
        ],
        onEvent: {
            submitSucc: {
                actions: [
                    {
                        actionType: "setValue",
                        componentId: "transferTable",
                        args: {
                            value: ""
                        }
                    },
                    {
                        actionType: "reload",
                        componentId: "service-reload",
                        data: {
                            barCode: ""
                        }
                    }
                ]
            }
        }
    }
}

export default schema2component(schema)

import schema2component from "@/utils/schema2component"
import { Translation } from "react-i18next"
import React from "react"
import {
    stock_id_table,
    warehouse_area_id
} from "@/pages/wms/constants/select_search_api_contant"
import { toast } from "amis"
import { CustomActionType } from "@/pages/wms/station/instances/stocktake/customActionType"

let barCodeCondition = {
    "barCode-il": "${barCode | split}"
}
let warehouseCode = localStorage.getItem("warehouseCode")

const schema = {
    type: "page",
    body: {
        type: "form",
        title: (
            <Translation>{(t) => t("form.inverntory.createBySku")}</Translation>
        ),
        mode: "horizontal",
        labelWidth: 0,
        id: "stepForm",
        body: [
            {
                name: "barCode",
                id: "barCode",
                type: "input-text",
                label: false,
                multiple: true,
                placeholder: "${'skuArea.scanBarcode' | t}",
                trimContents: true,
                clearable: true,
                className: "w-3/4 inline-block mr-3 align-top pl-4",
                source: [],
                onEvent: {
                    enter: {
                        actions: [
                            {
                                componentId: "service-reload",
                                actionType: "reload",
                                data: {
                                    barCode: "${event.data.value}"
                                }
                            }
                        ]
                    },
                    clear: {
                        actions: [
                            {
                                componentId: "service-reload",
                                actionType: "reload",
                                data: {
                                    barCode: "${event.data.value}"
                                }
                            }
                        ]
                    }
                }
            },
            {
                type: "input-file",
                name: "file",
                mode: "inline",
                id: "import_file",
                accept: ".xls,.xlsx,.csv",
                receiver: {
                    url: "/mdm/common-import/parse"
                },
                className: "inline-block  align-top",
                btnLabel: "${'button.import' | t} Excel",
                onEvent: {
                    success: {
                        actions: [
                            {
                                actionType: "reload",
                                componentId: "service-reload",
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
                                componentId: "service-reload",
                                data: {
                                    barCode: ""
                                }
                            }
                        ]
                    }
                }
            },
            {
                label: "${'modal.downloadTheTemplate' | t}",
                type: "action",
                actionType: "download",
                className: "inline-block align-top",
                api: {
                    method: "GET",
                    url: "/mdm/common-import/downloadTemplate?symbol=INVENTORY_COUNT_BARCODE_LIST",
                    requestAdaptor: function (api: { data: any }) {
                        return {
                            ...api,
                            data: {
                                ...api.data // 获取暴露的 api 中的 data 变量
                            },
                            responseType: "blob"
                        }
                    }
                }
            },
            {
                type: "service",
                id: "service-reload",
                name: "service-reload",
                api: {
                    ...stock_id_table,
                    url:
                        stock_id_table.url +
                        "&warehouseAreaId-eq=${ls:warehouseAreaId}",
                    data: {
                        ...stock_id_table.data,
                        ...barCodeCondition
                    },
                    responseData: {
                        stockIdsOptions: "${items}"
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
                        searchPlaceholder: "Please scan the product bar code"
                    },
                    source: "${stockIdsOptions}",
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
                                    {(t) => t("table.inventoryQuantity")}
                                </Translation>
                            )
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
                    if (!scope.stockIds || scope.stockIds.length === 0) {
                        toast["error"](
                            "Please select the products you want to count",
                            "消息"
                        )
                        _e.preventDefault()
                        return
                    }
                    const params = {
                        stockIds: scope.stockIds,
                        warehouseCode,
                        stocktakeType: "ORDINARY",
                        stocktakeMethod: "INFORMED",
                        warehouseAreaId,
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

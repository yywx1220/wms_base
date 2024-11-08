import schema2component from "@/utils/schema2component"
import { Translation } from "react-i18next"
import React from "react"
import {
    shelf_code_table,
    warehouse_area_id
} from "@/pages/wms/constants/select_search_api_contant"
import { toast } from "amis"
import { CustomActionType } from "@/pages/wms/station/instances/stocktake/customActionType"

let shelfCondition = {
    "containerCode-il": "${containerCodes | split}"
}
let warehouseCode = localStorage.getItem("warehouseCode")

const schema = {
    type: "page",
    body: {
        type: "form",
        title: (
            <Translation>
                {(t) => t("form.inverntory.createByShelf")}
            </Translation>
        ),
        mode: "horizontal",
        labelWidth: 0,
        id: "stepForm",
        body: [
            {
                name: "containerCodes",
                id: "containerCode",
                type: "input-text",
                multiple: true,
                mode: "horizontal",
                placeholder: "${'form.inverntory.scanShelfCode' | t}",
                trimContents: true,
                clearable: true,
                className: "w-4/5 inline-block mr-3 align-top pl-4",
                source: [],
                onEvent: {
                    enter: {
                        actions: [
                            {
                                componentId: "service-reload",
                                actionType: "reload",
                                data: {
                                    containerCodes: "${event.data.value}"
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
                                    containerCodes: "${event.data.value}"
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
                api: {
                    ...shelf_code_table,
                    url:
                        shelf_code_table.url +
                        "&warehouseAreaId-eq=${ls:warehouseAreaId}",
                    data: {
                        ...shelf_code_table.data,
                        ...shelfCondition
                    },
                    responseData: {
                        options: "${items}"
                    }
                },
                body: {
                    type: "transfer",
                    name: "shelfCodes",
                    joinValues: false,
                    extractValue: true,
                    selectMode: "table",
                    affixHeader: true,
                    resultListModeFollowSelect: true,
                    id: "transferTable",
                    virtualThreshold: 10,
                    "en-US": {
                        searchPlaceholder: "Please scan the container code"
                    },
                    source: "${options}",
                    pagination: {
                        enable: false,
                        layout: ["pager", "perpage", "total"]
                    },
                    columns: [
                        {
                            name: "containerCode",
                            label: (
                                <Translation>
                                    {(t) => t("table.shelfCoding")}
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
                            name: "containerSlotNum",
                            label: (
                                <Translation>
                                    {(t) => t("table.containerSlotNum")}
                                </Translation>
                            )
                        },
                        {
                            name: "locationCode",
                            label: (
                                <Translation>
                                    {(t) => t("table.locationCode")}
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
                    if (!scope.shelfCodes || scope.shelfCodes.length === 0) {
                        toast["error"](
                            "Please select the shelfs you want to count",
                            "消息"
                        )
                        _e.preventDefault()
                        return
                    }
                    const params = {
                        shelfCodes: scope.shelfCodes,
                        warehouseCode,
                        warehouseAreaId,
                        stocktakeType: "ORDINARY",
                        stocktakeMethod: "INFORMED",
                        stocktakeUnitType: "SHELF",
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

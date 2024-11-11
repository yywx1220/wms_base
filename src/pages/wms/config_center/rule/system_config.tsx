import schema2component from "@/utils/schema2component"
import {api_system_config_get, api_system_config_save_or_update} from "@/pages/wms/config_center/constants/api_constant"

const schema = {
    type: "page",
    // title: "${'systemConfigManagement.title' | t}",
    initApi: "post:/mdm/config/dictionary/getAll",
    body: [
        {
            type: "form",
            title: "${'systemConfigManagement.title' | t}",
            initApi: api_system_config_get,
            api: api_system_config_save_or_update,
            body: [
                {
                    type: "tabs",
                    tabs: [
                        {
                            title: "${'form.tab.emsConfiguration' | t}",
                            name: "emsConfig",
                            body: [
                                {
                                    type: "switch",
                                    label: "是否批量创建容器任务",
                                    name: "emsConfig.allowBatchCreateContainerTasks",
                                    description: "----"
                                }
                            ]
                        },
                        {
                            title: "${'form.tab.inboundConfiguration' | t}",
                            name: "inboundConfig",

                        },
                        {
                            title: "${'form.tab.outboundConfiguration' | t}",
                            name: "outboundConfig",
                            body: [
                                {
                                    type: "group",
                                    body: [
                                        {
                                            type: "input-number",
                                            label: "${'form.config.pickingOrderFetchSizeWhenEveryTimeDispatching' | t}",
                                            name: "outboundConfig.pickingOrderFetchSizeWhenEveryTimeDispatching",
                                            description: "${'form.config.pickingOrderFetchSizeWhenEveryTimeDispatching.description' | t}"
                                        },
                                        {
                                            type: "input-number",
                                            label: "${'form.config.undoOperationTaskFetchSizeWhenEveryTimeDispatching' | t}",
                                            name: "outboundConfig.undoOperationTaskFetchSizeWhenEveryTimeDispatching",
                                            description: "${'form.config.undoOperationTaskFetchSizeWhenEveryTimeDispatching.description' | t}"
                                        }
                                    ]
                                },
                                {
                                    type: "group",
                                    body: [
                                        {
                                            type: "input-number",
                                            label: "${'form.config.operationTaskFetchSizeWhenContainerArrived' | t}",
                                            name: "outboundConfig.operationTaskFetchSizeWhenContainerArrived",
                                            description: "${'form.config.operationTaskFetchSizeWhenContainerArrived.description' | t}"
                                        },
                                        {
                                            type: "switch",
                                            label: "${'form.config.checkArrivedContainerForDispatchedOrder' | t}",
                                            name: "outboundConfig.checkArrivedContainerForDispatchedOrder",
                                            description: "${'form.config.checkArrivedContainerForDispatchedOrder.description' | t}"
                                        },
                                        {
                                            type: "select",
                                            label: "${'form.config.excludeCustomerOrderTypes' | t}",
                                            multiple: true,
                                            joinValues: false,
                                            extractValue: true,
                                            name: "outboundConfig.excludeCustomerOrderTypes",
                                            source: "${CustomerOrderType}"
                                        }
                                    ]
                                },
                                {
                                    type: "group",
                                    body: [
                                        {
                                            type: "switch",
                                            label: "${'form.config.autoUnlockTransferContainer' | t}",
                                            name: "outboundConfig.autoUnlockTransferContainer"
                                        },
                                        {
                                            type: "input-number",
                                            label: "${'form.config.autoUnlockTransferContainerTimeInMillis' | t}",
                                            name: "outboundConfig.autoUnlockTransferContainerTimeInMillis"
                                        },
                                        {
                                            type: "input-number",
                                            label: "${'form.config.autoUnlockTransferContainerSizeEveryTime' | t}",
                                            name: "outboundConfig.autoUnlockTransferContainerSizeEveryTime"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: "${'form.tab.outboundAlgoConfiguration' | t}",
                            name: "outboundAlgoConfig",
                            body: [
                                {
                                    type: "group",
                                    body: [
                                        {
                                            type: "input-number",
                                            label: "${'modal.cutoffTime' | t}",
                                            name: "outboundAlgoConfig.cutoffTime",
                                            description: "${'modal.cutoffTime.description' | t}"
                                        },
                                        {
                                            type: "select",
                                            label: "${'modal.algoMode' | t}",
                                            name: "outboundAlgoConfig.mode"
                                        }
                                    ]
                                },
                                {
                                    type: "group",
                                    body: [
                                        {
                                            type: "input-number",
                                            label: "${'modal.shareRackPoolMaxStationDistance' | t}",
                                            name: "outboundAlgoConfig.shareRackPoolMaxStationDistance",
                                            precision: 2
                                        },
                                        {
                                            type: "input-number",
                                            label: "${'modal.maxHitNum' | t}",
                                            name: "outboundAlgoConfig.maxHitNum"
                                        },
                                        {
                                            type: "select",
                                            label: "${'modal.orderDispatchStrategy' | t}",
                                            source: "${OrderDispatchStrategy}",
                                            name: "outboundAlgoConfig.orderDispatchStrategy"
                                        }
                                    ]
                                },
                                {
                                    type: "group",
                                    body: [
                                        {
                                            type: "input-number",
                                            label: "${'modal.orderDispatchBalanceOffset' | t}",
                                            name: "outboundAlgoConfig.orderDispatchBalanceOffset",
                                            description: "${'modal.orderDispatchBalanceOffset.description' | t}",
                                        },
                                        {
                                            type: "input-text",
                                            label: "${'modal.firstHitRackSide' | t}",
                                            source: "${FirstHitRackSide}",
                                            name: "outboundAlgoConfig.firstHitRackSide"
                                        },
                                        {
                                            type: "select",
                                            label: "${'modal.algoName' | t}",
                                            source: "${OrderDispatchHitAlgoName}",
                                            name: "outboundAlgoConfig.algoName"
                                        }
                                    ]
                                },
                                {
                                    type: "group",
                                    body: [
                                        {
                                            type: "input-number",
                                            label: "${'modal.maxOnTheWayRackNum' | t}",
                                            name: "outboundAlgoConfig.maxOnTheWayRackNum",
                                            description: "${'modal.maxOnTheWayRackNum.description' | t}",
                                        },
                                        {
                                            type: "select",
                                            label: "${'modal.taskBalanceDimension' | t}",
                                            source: "${TaskBalanceDimension}",
                                            name: "outboundAlgoConfig.taskBalanceDimension"
                                        },
                                        {
                                            type: "select",
                                            label: "${'modal.warehouseLogicTypePriority' | t}",
                                            description: "${'modal.warehouseLogicTypePriority.description' | t}",
                                            source: "${WarehouseLogicType}",
                                            multiple: true,
                                            joinValues: false,
                                            extractValue: true,
                                            name: "outboundAlgoConfig.warehouseLogicTypePriority"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

export default schema2component(schema)

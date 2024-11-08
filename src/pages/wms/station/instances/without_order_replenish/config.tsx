import React from "react"
import { Translation } from "react-i18next"

import defaultPage from "@/pages/wms/station/instances/replenish/operations/defaultPage"
import type { WorkStationConfig } from "@/pages/wms/station/instances/types"
import { DebugType } from "@/pages/wms/station/instances/types"
import { TabActionType } from "@/pages/wms/station/tab-actions/constant"
import CallBin from "@/pages/wms/station/instances/replenish/custom-actions/CallBin"
import Tips from "@/pages/wms/station/instances/replenish/operations/tips"

import InstanceLayout from "@/pages/wms/station/instances/replenish/layout"
import mockData from "./mock-events"
import PickingHandler from "@/pages/wms/station/instances/replenish/operations/pickingHandler"
import RobotHandler from "@/pages/wms/station/instances/replenish/operations/RobotHandler"
import { StationOperationType } from "@/pages/wms/station/instances/replenish/type"

export const OPERATION_MAP = {
    [StationOperationType.robotArea]: RobotHandler,
    [StationOperationType.selectDetailArea]: PickingHandler,
    [StationOperationType.defaultArea]: defaultPage,
    [StationOperationType.tips]: Tips
}

/**
 * 工作站物理设备类型
 */
export const CurrentModeType: any = {
    SELECT_CONTAINER_PUT_AWAY: (
        <Translation>{(t) => t("replenish.title")}</Translation>
    ),
    RECOMMEND: "推荐容器上架",
    NONE: ""
}
/**
 * 工作站物理设备类型
 */

const config: WorkStationConfig<string> = {
    type: "without_order_replenish",
    title: <Translation>{(t) => t("noOrdersReplenish.title")}</Translation>,
    stepsDescribe: [
        {
            type: "collectingDoc",
            name: "领单据"
        },
        {
            type: "callBin",
            name: "呼叫容器"
        },
        {
            type: "infoInput",
            name: "信息录入"
        }
    ],
    actions: [CallBin, TabActionType.EXIT],
    operationMap: OPERATION_MAP,
    layout: InstanceLayout,
    debugType: DebugType.STATIC,
    mockData
}

export default config

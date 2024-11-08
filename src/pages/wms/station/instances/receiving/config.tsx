import React from "react"
import { Translation } from "react-i18next"

import defaultPage from "@/pages/wms/station/instances/replenish/operations/defaultPage"
import type { WorkStationConfig } from "@/pages/wms/station/instances/types"
import { DebugType } from "@/pages/wms/station/instances/types"
import { TabActionType } from "@/pages/wms/station/tab-actions/constant"
import CollectingDoc from "@/pages/wms/station/instances/replenish/custom-actions/CollectingDoc"
import Tips from "@/pages/wms/station/instances/replenish/operations/tips"
// import IntlMessages from "@/util/IntlMessages"
// import Abnormal from "./custom-actions/Abnormal"
import CallBin from "@/pages/wms/station/instances/replenish/custom-actions/CallBin"
import WholeBoxConfig from "./custom-actions/WholeBox"
import unBoxConfig from "./custom-actions/Unboxing"
// import TaskDetail from "./custom-actions/TaskDetail"
import Abnormal from "./custom-actions/Abnormal"
import InstanceLayout from "./layout"
import mockData from "./mock-events"
import PickingHandler from "./operations/pickingHandler"
import RobotHandler from "./operations/RobotHandler"
import OrderHandler from "./operations/orderHandler"

import { StationOperationType } from "@/pages/wms/station/instances/replenish/type"

export const OPERATION_MAP = {
    [StationOperationType.robotArea]: RobotHandler,
    [StationOperationType.selectDetailArea]: PickingHandler,
    [StationOperationType.orderArea]: OrderHandler,
    [StationOperationType.tips]: Tips
}

/**
 * 工作站物理设备类型
 */
export const CurrentModeType: any = {
    SELECT_CONTAINER_PUT_AWAY: (
        <Translation>{(t) => t("replenish.title")}</Translation>
    ),
    RECOMMEND: "收货",
    NONE: ""
}
/**
 * 工作站物理设备类型
 */

const config: WorkStationConfig<string> = {
    type: "receiving",
    title: "收货",
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
    actions: [],
    operationMap: OPERATION_MAP,
    layout: InstanceLayout,
    debugType: DebugType.STATIC,
    mockData
}

export default config

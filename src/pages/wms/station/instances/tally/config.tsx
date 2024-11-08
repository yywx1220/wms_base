import type { WorkStationConfig } from "@/pages/wms/station/instances/types"
import { DebugType } from "@/pages/wms/station/instances/types"
import { TabActionType } from "@/pages/wms/station/tab-actions/constant"
import { Translation } from "react-i18next"
import React from "react"
// import AdditionalProduct from "./custom-actions/AdditionalProduct"
// import PendingScanSnCode from "./custom-actions/PendingScanSnCode"
import RecieveTask from "./custom-actions/RecieveTask"
import CreateCountTask from "./custom-actions/CreateCountTask"
import InstanceLayout from "./layout"
import mockData from "./mock-events"
import TakeTasks from "@/pages/wms/station/instances/tally/operations/TakeTasks"
// import DefaultArea from "./operations/DefaultArea"
// import SelectBatchTip from "./operations/SelectBatchTip"
// import SelectEmptyTip from "./operations/SelectEmptyTip"
import ShelfHandler from "./operations/ShelfHandler"
import TallyInfoHandler from "./operations/TallyInfo"
import { StationOperationType } from "./type"

export const OPERATION_MAP = {
    // [StationOperationType.conveyorArea]: ConveyorHandler,
    // [StationOperationType.robotArea]: RobotHandler,
    [StationOperationType.shelfArea]: ShelfHandler,
    [StationOperationType.stocktakeArea]: TallyInfoHandler,
    // [StationOperationType.selectBatchTipArea]: SelectBatchTip,  // 选择SKU的批次属性
    // [StationOperationType.selectEmptyTipArea]: SelectEmptyTip, // 空箱处理
    [StationOperationType.defaultArea]: TakeTasks
}

const config: WorkStationConfig<string> = {
    type: "tally",
    title: <Translation>{(t) => t("library.title")}</Translation>,
    stepsDescribe: [],
    actions: [
        // RecieveTask,
        // CreateCountTask,
        // TaskDetail,
        // PendingScanSnCode,
        // AdditionalProduct,
        TabActionType.EXIT
    ],
    operationMap: OPERATION_MAP,
    layout: InstanceLayout,
    debugType: DebugType.STATIC,
    mockData
}

export default config

import type {WorkStationConfig} from "@/pages/wms/station/instances/types"
import {DebugType} from "@/pages/wms/station/instances/types"
import {TabActionType} from "@/pages/wms/station/tab-actions/constant"
import {Translation} from "react-i18next"
import React from "react"
// import AdditionalProduct from "./custom-actions/AdditionalProduct"
// import PendingScanSnCode from "./custom-actions/PendingScanSnCode"
import RecieveTask from "./custom-actions/RecieveTask"
import CreateCountTask from "./custom-actions/CreateCountTask"
import ExtraProducts from "./custom-actions/ExtraProducts"
import InstanceLayout from "./layout"
import mockData from "./mock-events"
//todo 这里是不是不应该依赖replenish的文件
import DefaultArea from "@/pages/wms/station/instances/replenish/operations/defaultPage"
// import DefaultArea from "./operations/DefaultArea"
// import SelectBatchTip from "./operations/SelectBatchTip"
// import SelectEmptyTip from "./operations/SelectEmptyTip"
import ShelfHandler from "./operations/ShelfHandler"
import StocktakeHandler from "./operations/StocktakeHandler"
import OrderHandler from "./operations/OrderHandler"
import CreateOrder from "./operations/CreateOrder"
import {StationOperationType} from "./type"

export const OPERATION_MAP = {
    // [StationOperationType.conveyorArea]: ConveyorHandler,
    // [StationOperationType.robotArea]: RobotHandler,
    [StationOperationType.orderArea]: OrderHandler,
    [StationOperationType.shelfArea]: ShelfHandler,
    [StationOperationType.stocktakeArea]: StocktakeHandler,
    // [StationOperationType.selectBatchTipArea]: SelectBatchTip,  // 选择SKU的批次属性
    // [StationOperationType.selectEmptyTipArea]: SelectEmptyTip, // 空箱处理
    [StationOperationType.defaultArea]: DefaultArea,
    createOrder: CreateOrder
}

const config: WorkStationConfig<string> = {
    type: "stocktake",
    title: <Translation>{(t) => t("inventory.title")}</Translation>,
    stepsDescribe: [],
    actions: [
        RecieveTask,
        CreateCountTask,
        ExtraProducts,
        // TaskDetail,
        // PendingScanSnCode,
        // AdditionalProduct,
        TabActionType.EXIT
    ],
    operationMap: OPERATION_MAP,
    layout: InstanceLayout,
    debugType: DebugType.NONE,
    mockData
}

export default config

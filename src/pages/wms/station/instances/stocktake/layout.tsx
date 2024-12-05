import { Col, Row } from "antd"
import classNames from "classnames/bind"
import React, { useEffect } from "react"

import type {
    WorkStationEvent,
    WorkStationInfo
} from "@/pages/wms/station/event-loop/types"
import type { OperationProps } from "@/pages/wms/station/instances/types"

import ComponentWrapper from "../../component-wrapper"
import { OPERATION_MAP } from "./config"
import style from "./index.module.scss"
// import { valueFilter as defaultAreaFilter } from "./operations/DefaultArea"
// import { valueFilter as selectBatchTipFilter } from "./operations/SelectBatchTip"
// import { valueFilter as selectEmptyTipFilter } from "./operations/SelectEmptyTip"
import { valueFilter as shelfFilter } from "./operations/ShelfHandler"
import { valueFilter as stocktakeFilter } from "./operations/StocktakeHandler"
import { valueFilter as createFilter } from "./operations/CreateOrder"
import { StationOperationType, StationPhysicalType } from "./type"
import {
    valueFilter as defaultFilter,
    taskStatusText
} from "@/pages/wms/station/instances/replenish/operations/defaultPage"

interface StocktakeLayoutProps extends OperationProps<any, any> {
    workStationEvent: WorkStationEvent<any>
    workStationInfo: WorkStationInfo
}

const filterMap = {
    shelfArea: shelfFilter
}

const containerAreaMap: Record<string, string> = {
    // [StationPhysicalType.CONVEYOR]: "conveyorArea",
    // [StationPhysicalType.ROBOT]: "robotArea",
    [StationPhysicalType.SHELF]: "shelfArea"
}

const cx = classNames.bind(style)

const Layout = (props: StocktakeLayoutProps) => {
    const { workStationEvent } = props
    const stationStatus = workStationEvent?.stationProcessingStatus

    useEffect(() => {
        if (workStationEvent?.warehouseAreaId) {
            console.log("warehouseAreaId", workStationEvent?.warehouseAreaId)
            localStorage.setItem(
                "warehouseAreaId",
                workStationEvent.warehouseAreaId
            )
        }
    }, [])

    return (
        <Row className="h-full" gutter={24}>
            {stationStatus &&
            Object.keys(taskStatusText).includes(stationStatus) ? (
                <Col className="flex-1 rounded-lg">
                    <ComponentWrapper
                        type={StationOperationType.defaultArea}
                        Component={
                            OPERATION_MAP[StationOperationType.defaultArea]
                        }
                        valueFilter={defaultFilter}
                    />
                </Col>
            ) : (
                <>
                    <Col className="rounded-lg h-full" span={8}>
                        <ComponentWrapper
                            type={StationOperationType.orderArea}
                            Component={
                                OPERATION_MAP[StationOperationType.orderArea]
                            }
                            valueFilter={shelfFilter}
                        />
                    </Col>
                    <Col className="rounded-lg h-full" span={8}>
                        <ComponentWrapper
                            type={StationOperationType.stocktakeArea}
                            Component={
                                OPERATION_MAP[
                                    StationOperationType.stocktakeArea
                                ]
                            }
                            valueFilter={stocktakeFilter}
                        />
                    </Col>
                    <Col className="rounded-lg h-full" span={8}>
                        <ComponentWrapper
                            type={StationOperationType.shelfArea}
                            Component={
                                OPERATION_MAP[StationOperationType.shelfArea]
                            }
                            valueFilter={shelfFilter}
                        />
                    </Col>
                </>
            )}
        </Row>
    )
}

export default Layout

/**
 * 当前工作站实例的布局
 */
import { Col, Row } from "antd"
import classNames from "classnames/bind"
import React from "react"

import type {
    WorkStationEvent,
    WorkStationInfo
} from "@/pages/wms/station/event-loop/types"

import type { OperationProps } from "@/pages/wms/station/instances/types"

import ComponentWrapper from "../../component-wrapper"
import { OPERATION_MAP } from "./config"
import style from "./index.module.scss"
import {
    valueFilter as defaultFilter,
    taskStatusText
} from "@/pages/wms/station/instances/replenish/operations/defaultPage"
import { valueFilter as pickFilter } from "./operations/pickingHandler"
import { valueFilter as robotFilter } from "@/pages/wms/station/instances/replenish/operations/RobotHandler"
import { valueFilter as scanInfoFilter } from "@/pages/wms/station/instances/replenish/operations/tips"
import { StationOperationType } from "@/pages/wms/station/instances/replenish/type"

interface ReplenishLayoutProps extends OperationProps<any, any> {
    workStationEvent: WorkStationEvent<any>
    workStationInfo: WorkStationInfo
}
const filterMap = {
    robotArea: robotFilter
}

const cx = classNames.bind(style)

const Layout = (props: ReplenishLayoutProps) => {
    const { workStationEvent } = props

    const stationStatus = workStationEvent?.stationProcessingStatus

    return (
        <>
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
                        <Col className="rounded-lg h-full" span={12}>
                            <ComponentWrapper
                                type={StationOperationType.robotArea}
                                Component={
                                    OPERATION_MAP[
                                        StationOperationType.robotArea
                                    ]
                                }
                                valueFilter={filterMap.robotArea}
                            />
                        </Col>
                        <Col className="rounded-lg h-full" span={12}>
                            <ComponentWrapper
                                type={StationOperationType.selectDetailArea}
                                Component={
                                    OPERATION_MAP[
                                        StationOperationType.selectDetailArea
                                    ]
                                }
                                valueFilter={pickFilter}
                            />
                        </Col>
                    </>
                )}
            </Row>
            <ComponentWrapper
                type={StationOperationType.tips}
                Component={OPERATION_MAP[StationOperationType.tips]}
                valueFilter={scanInfoFilter}
                withWrapper={false}
            />
        </>
    )
}

export default Layout

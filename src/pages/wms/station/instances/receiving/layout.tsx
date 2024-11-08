/**
 * 当前工作站实例的布局
 */
import { Col, Row, Input, Button } from "antd"
import classNames from "classnames/bind"
import React, { useState } from "react"
import request from "@/utils/requestInterceptor"

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
} from "./operations/defaultPage"
import { valueFilter as pickFilter } from "./operations/pickingHandler"
import { valueFilter as robotFilter } from "./operations/RobotHandler"
import { valueFilter as scanInfoFilter } from "./operations/tips"
import { StationOperationType } from "./type"
import PickingHandler from "./operations/pickingHandler"
import RobotHandler from "./operations/RobotHandler"
import OrderHandler from "./operations/orderHandler"

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

    const [orderNo, setOrderNo] = useState("")

    const [orderInfo, setOrderInfo] = useState()

    const onScanSubmit = () => {
        // console.log("orderNo",orderNo)
        request({
            method: "post",
            url: `/inbound/plan/query/${orderNo}/${workStationEvent.warehouseCode}`
        }).then((res: any) => {
            console.log("res", res)
            setOrderInfo(res.data)
        })
    }

    return (
        <>
            {orderInfo ? (
                <Row className="h-full" gutter={24}>
                    <Col span={24} className="mb-2">
                        {/* <ComponentWrapper
                            type={StationOperationType.orderArea}
                            Component={
                                OPERATION_MAP[StationOperationType.orderArea]
                            }
                            valueFilter={defaultFilter}
                        /> */}
                        <OrderHandler value={orderInfo} />
                    </Col>
                    <Col span={12}>
                        {/* <ComponentWrapper
                            type={StationOperationType.selectDetailArea}
                            Component={
                                OPERATION_MAP[
                                    StationOperationType.selectDetailArea
                                ]
                            }
                            valueFilter={defaultFilter}
                        /> */}
                        <PickingHandler value={orderInfo} />
                    </Col>
                    <Col span={12}>
                        {/* <ComponentWrapper
                            type={StationOperationType.robotArea}
                            Component={
                                OPERATION_MAP[StationOperationType.robotArea]
                            }
                            valueFilter={defaultFilter}
                        /> */}
                        <RobotHandler value={orderInfo} />
                    </Col>
                </Row>
            ) : (
                <div className="w-full h-full d-flex flex-col justify-center items-center">
                    <div className="w-1/3">
                        <div className="text-xl">请扫描LPN号</div>
                        <Input
                            size="large"
                            className="my-4 w-full"
                            value={orderNo}
                            onChange={(e) => setOrderNo(e.target.value)}
                            // style={{ width: "100%" }}
                        />
                        <Button type="primary" block onClick={onScanSubmit}>
                            确定
                        </Button>
                    </div>
                </div>
            )}

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

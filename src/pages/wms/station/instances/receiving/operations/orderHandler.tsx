import React from "react"
import type { WorkStationEvent } from "@/pages/wms/station/event-loop/types"
import type { OperationProps } from "@/pages/wms/station/instances/types"
import { Row, Col } from "antd"

interface ReceiveOrderProps {}

interface OrderHandlerProps {}

export const valueFilter = (
    data: WorkStationEvent<ReceiveOrderProps> | undefined
): OperationProps<OrderHandlerProps, any>["value"] | Record<string, any> => {
    if (!data) return {}
    return {
        orderArea: data.orderArea,
        operationType: data.operationType
    }
}

const OrderAreaData = [
    {
        label: "客户单号/LPN号",
        value: "customerOrderNo"
    },
    {
        label: "入库类型",
        value: "inboundType"
    },
    {
        label: "品项总数/已收/待收",
        value: ["total", "receivedQty", "toBeReceivedQty"]
    },
    {
        label: "入库总数/已收/待收",
        value: ["total", "receivedQty", "toBeReceivedQty"]
    }
]

const OrderHandler = (props: any) => {
    const { value, onCustomActionDispatch } = props

    return (
        <Row gutter={16}>
            <Col className="gutter-row" span={6}>
                <div className="flex-1 bg-gray-100 py-2 pl-3">
                    <span>客户单号/LPN号</span>
                    <span></span>
                </div>
            </Col>
            <Col className="gutter-row" span={6}>
                <div className="flex-1 bg-gray-100 py-2 pl-3">
                    <span>入库类型</span>
                    <span></span>
                </div>
            </Col>
            <Col className="gutter-row" span={6}>
                <div className="flex-1 bg-gray-100 py-2 pl-3">
                    <span>品项总数/已收/待收</span>
                    <span></span>
                </div>
            </Col>
            <Col className="gutter-row" span={6}>
                <div className="flex-1 bg-gray-100 py-2 pl-3">
                    <span>入库总数/已收/待收</span>
                    <span></span>
                </div>
            </Col>
        </Row>
    )
}

export default OrderHandler

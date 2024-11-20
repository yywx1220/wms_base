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
    const { customerOrderNo, storageType, skuKindNum, totalQty } = value
    return (
        <Row gutter={16}>
            <Col className="gutter-row" span={6}>
                <div className="flex-1 bg-gray-100 py-2 pl-3">
                    <div>客户单号/LPN号</div>
                    <div>{customerOrderNo}</div>
                </div>
            </Col>
            <Col className="gutter-row" span={6}>
                <div className="flex-1 bg-gray-100 py-2 pl-3">
                    <div>入库类型</div>
                    <div>{storageType}</div>
                </div>
            </Col>
            <Col className="gutter-row" span={6}>
                <div className="flex-1 bg-gray-100 py-2 pl-3">
                    <div>品项总数/已收/待收</div>
                    <div>{skuKindNum}</div>
                </div>
            </Col>
            <Col className="gutter-row" span={6}>
                <div className="flex-1 bg-gray-100 py-2 pl-3">
                    <div>入库总数/已收/待收</div>
                    <div>{totalQty}</div>
                </div>
            </Col>
        </Row>
    )
}

export default OrderHandler

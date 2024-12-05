import { Typography } from "antd"
import React from "react"
import { WorkStationEvent } from "@/pages/wms/station/event-loop/types"
import type { OperationProps } from "@/pages/wms/station/instances/types"

import Operation from "./components/Operation"

const { Title } = Typography

/**
 * @Description: 对event中的数据进行filter处理
 * @param data
 */
export const valueFilter = (data?: WorkStationEvent<any>) => {
    if (!data) return {}
    return {
        orderInfo: data.skuArea?.pickingViews?.[0]
    }
}

const OrderHandler = (props: OperationProps<any, unknown>) => {
    const { value } = props
    const { orderInfo } = value

    return (
        <>
            <Title level={3} className="pb-12">
                Order
            </Title>
            <div className="text-xl d-flex flex-col justify-center items-center">
                <div>
                    <span>盘点单号：</span>
                    <span>123456789</span>
                </div>
                <div>
                    <span>盘点方式：</span>
                    <span>明盘</span>
                </div>
                <div>
                    <span>盘点类型：</span>
                    <span>普通盘点</span>
                </div>
            </div>
        </>
    )
}

export default OrderHandler

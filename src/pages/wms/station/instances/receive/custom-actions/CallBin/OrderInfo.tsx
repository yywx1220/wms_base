import { Descriptions } from "antd"
import React from "react"
import type { OrderInfoProps } from "./Content"

const OrderInfo = (props: OrderInfoProps) => {
    const { ownerCode = [], orderTotal, lpn = [], skuTotal } = props
    return (
        <div className="mb-4 w-2/5 descriptions-call">
            <Descriptions
                // title="Responsive Descriptions"
                bordered
                size="small"
                column={{ sm: 1 }}
                labelStyle={{
                    textAlign: "right",
                    width: 180,
                    fontSize: 18
                }}
                contentStyle={{
                    backgroundColor: "#ffff00",
                    fontSize: 18
                }}
                style={{ border: "1px solid #000" }}
            >
                <Descriptions.Item label="For">
                    {ownerCode.join(",")}
                </Descriptions.Item>
                <Descriptions.Item label="Number of PO">
                    {orderTotal}
                </Descriptions.Item>
                <Descriptions.Item label="PO#" className="PO_number">
                    {lpn.join(",")}
                </Descriptions.Item>
                <Descriptions.Item label="Total SKU" className="totalSKU">
                    {skuTotal}
                </Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default OrderInfo

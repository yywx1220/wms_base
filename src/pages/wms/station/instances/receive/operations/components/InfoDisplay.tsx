import type { AmountDisplayRule } from "@/pages/wms/station/widgets/common/Count"
// import WithCalculator from "@/pages/wms/station/widgets/common/Count/WithCalculator"
import { Col, Row, Select } from "antd"
import type { CSSProperties, ReactNode } from "react"
import { memo } from "react"
import React from "react"
interface infoListProps {
    isAmountDisplayRule?: any
    title: string | ReactNode
    value: string | number
    span?: number
    key: string
    render?: any
}

interface InfoDisplayProps {
    gutter?: any
    style?: CSSProperties | undefined
    className?: string | undefined
    showBackground?: boolean
    infoList: infoListProps[]
    amountDisplayRule?: AmountDisplayRule
}

// const AmountText = WithCalculator((props) => {
//     const { calculateCount, value } = props
//     return <span>{calculateCount || value}</span>
// })
const InfoDisplay = (props: InfoDisplayProps) => {
    const {
        gutter = 16,
        infoList = [],
        showBackground,
        style,
        className
    } = props
    return (
        <Row
            gutter={gutter}
            style={{
                background: showBackground ? "#fafafa" : "#fff",
                padding: showBackground ? "10px" : "",
                ...style
            }}
            // justify="space-between"
            className={className}
        >
            {infoList.map((item) => {
                const { title, value, span, key, render } = item
                return (
                    <Col key={key} span={span}>
                        <div
                            className="py-3.5 px-6 rounded-md"
                            style={{
                                background: "#F8F8F8"
                            }}
                        >
                            <header
                                className="text-sm"
                                style={{ color: "#696B7D" }}
                            >
                                {title}
                            </header>
                            <div style={{ color: "#292B3E", fontSize: 24 }}>
                                {render ? (
                                    render()
                                ) : (
                                    <span className="text-ellipsis">
                                        {value ?? "-"}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Col>
                )
            })}
        </Row>
    )
}

export default memo(InfoDisplay)

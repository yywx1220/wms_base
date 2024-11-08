import React from "react"

import type { OperationProps } from "@/pages/wms/station/instances/types"
import { WorkStationEvent } from "@/pages/wms/station/event-loop/types"
import PickingWholeBox from "./components/PickingWholeBox"
import PickingSKU from "./components/PickingSKU"
import { Row, Col, Input, Divider } from "antd"
import SkuInfo from "@/pages/wms/station/widgets/common/SkuInfo"

export interface SKUHandlerConfirmProps {
    operationId: string
}

/**
 * @Description: 对event中的数据进行filter处理
 * @param data
 */
export const valueFilter = (data: WorkStationEvent<any>) => {
    if (!data) return {}
    return {
        operationType: data.operationType,
        orderArea: data.orderArea,
        skuArea: data.skuArea,
        workLocationArea: data.workLocationArea,
        warehouseCode: data.warehouseCode,
        scanedCode: data.scanCode,
        processingType: data.processingType,
        callContainerCount: data.callContainerCount,
        processingInboundOrderDetailId: data.processingInboundOrderDetailId
    }
}

const PickAreaHandler = (props: any) => {
    const { value = {} } = props
    return (
        <>
            <div className="d-flex items-center">
                <div className="white-space-nowrap">请扫描商品条码:</div>
                <Input bordered={false} />
            </div>
            <Divider style={{ margin: "12px 0" }} />
            <div className="bg-gray-100 py-4 pl-6 d-flex">
                <div>
                    <div>收货数</div>
                    <div>/到货数</div>
                </div>
                <div className="border-solid border-gray-200 border-l border-r mx-4"></div>
                <div className="text-2xl">800/21000</div>
            </div>
            <div className="bg-gray-100 mt-4 p-3">
                <div>商品详情</div>
                <SkuInfo
                    // {...scannedSkuInfo}
                    imgWidth={160}
                    detailHeight={130}
                />
            </div>
        </>
    )
}

export default PickAreaHandler

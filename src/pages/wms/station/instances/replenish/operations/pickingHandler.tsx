import React from "react"

import type { OperationProps } from "@/pages/wms/station/instances/types"
import { WorkStationEvent } from "@/pages/wms/station/event-loop/types"
import PickingWholeBox from "./components/PickingWholeBox"
import PickingSKU from "./components/PickingSKU"

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

const PickAreaHandler = (props: OperationProps<any, any>) => {
    const { value = {} } = props

    const { processingType } = value

    return processingType === "WHOLE_BOX" ? (
        <PickingWholeBox {...props} />
    ) : (
        <PickingSKU {...props} />
    )
}

export default PickAreaHandler

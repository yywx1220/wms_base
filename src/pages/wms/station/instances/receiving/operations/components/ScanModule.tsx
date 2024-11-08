import React, { useState, useRef, useEffect } from "react"

import Scan from "@/pages/wms/station/widgets/common/Scan"
import { CustomActionType } from "@/pages/wms/station/instances/replenish/customActionType"

const ScanModule = ({
    scanedCode,
    selectMode,
    onCustomActionDispatch
}: any) => {
    const refScan = useRef<any>(null)
    const [inputValue, setInputValue] = useState(scanedCode || "")

    useEffect(() => {
        if (!scanedCode) {
            inputValue && setInputValue("")
            refScan?.current?.focus()
        } else {
            setInputValue(scanedCode)
        }
    }, [scanedCode])

    useEffect(() => {
        if (refScan.current?.input?.value) return
        refScan.current?.focus()
    }, [refScan.current])

    const onScanInputChange = async (value: any) => {
        // 清空输入框时调用清空已扫SKU接口
        if (scanedCode && !value) {
            await onCustomActionDispatch({
                eventCode: CustomActionType.SCAN_BARCODE_RESET,
                data: scanedCode
            })
        }
    }

    const onPressEnter = async (val: string) => {
        const eventCode = selectMode
            ? CustomActionType.INBOUND_SCAN_BARCODE
            : CustomActionType.PUT_AWAY_WITHOUT_ORDER_SCAN_BARCODE

        const { code } = await onCustomActionDispatch({
            eventCode,
            data: val
        })
        return code
    }

    return (
        <Scan
            ref={refScan}
            inputValue={inputValue}
            onChange={onScanInputChange}
            onPressEnter={onPressEnter}
        />
    )
}

export default ScanModule

import { Input } from "antd"
import type { InputRef } from "antd"
import React, { useEffect, useImperativeHandle, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import request from "@/utils/requestInterceptor"
// import { CustomActionType } from "@/pages/wms/station/instances/replenish/customActionType"
import { MessageType } from "@/pages/wms/station/widgets/message"
import { CustomActionType } from "@/pages/wms/station/instances/replenish/customActionType"
import OrderInfo from "./OrderInfo"
import SkuCard from "./SkuCard"
import {
    WorkStationEvent,
    OperationType
} from "@/pages/wms/station/event-loop/types"
import type { OperationProps } from "@/pages/wms/station/instances/types"

let warehouseCode = localStorage.getItem("warehouseCode")

const MAX_CARD_NUMBER = {
    SELECT_CONTAINER_PUT_AWAY: 5,
    WITHOUT_ORDER_PUT_AWAY: 15
}

interface CallBinContentProps extends OperationProps<any, any> {
    workStationEvent?: WorkStationEvent<any>
}

export interface OrderInfoProps {
    ownerCode?: string[]
    lpn?: string[]
    orderTotal?: number
    skuTotal?: number
}

interface SkuInfo {
    barcodes: string[]
    imageUrl: string
    inboundQty: number
    ownerCode: string
    skuCode: string
    skuId: string
    skuName: string
    details: Detail[]
    selectedRowKeys: React.Key[]
    slotSpecCode?: string
}

interface Detail {
    containerCode: string
    containerFace: string
    containerSlotCode: string
    slotSpecCode: string
    stockId: string
    totalTask: string
    stockQty: number
    lockedQty: number
}

interface Option {
    label: string
    value: string
}

const Content = (props: CallBinContentProps) => {
    const { t } = useTranslation()
    const { refs, onCustomActionDispatch, message, workStationEvent } = props

    const withoutOrderSkuInfos =
        workStationEvent?.skuArea?.withoutOrderSkuInfos || []
    const selectMode =
        workStationEvent?.operationType ===
        OperationType.SELECT_CONTAINER_PUT_AWAY

    const [allCardList, setAllCardList] = useState<SkuInfo[]>([])
    const [showCardList, setShowCardList] = useState<SkuInfo[]>([])
    const [specSlotOptions, setSpecSlotOptions] = useState<Option[]>([])
    const [scanCode, setScanCode] = useState<string | string[]>()
    const [orderInfo, setOrderInfo] = useState<OrderInfoProps>({})
    const inputRef = useRef<InputRef>(null)

    useImperativeHandle(refs, () => ({
        onSave
    }))

    useEffect(() => {
        if (selectMode) {
            getInitCardData()
        }
        getStockTakeOptions()
        inputRef.current?.focus()
    }, [])

    useEffect(() => {
        if (withoutOrderSkuInfos.length === 0) return
        const skuIds = withoutOrderSkuInfos.map(
            (item: { skuId: string }) => item.skuId
        )
        getInitCardData(skuIds)
    }, [withoutOrderSkuInfos.length])

    const getStockTakeOptions = async () => {
        const res: any = await request({
            method: "get",
            url: `post:/mdm/config/dictionary/getAll`
        })
        setSpecSlotOptions(res?.data?.CallContainerSlotSpecCode || [])
    }

    const getInitCardData = async (skuIds?: string[]) => {
        const res: any = await request({
            method: "post",
            url: "/station/inbound/callContainer",
            data: { warehouseCode, skuIds }
        })
        if (res.data.code === "0") {
            setOrderInfo(res.data.data?.orderInfo || {})
            const dataList = res.data.data?.skuInfo || []
            if (
                dataList.length >
                MAX_CARD_NUMBER[
                    workStationEvent?.operationType as keyof typeof OperationType
                ]
            ) {
                setAllCardList(dataList)
                return
            }
            updateCardList(dataList)
        }
    }

    const updateCardList = (dataList: SkuInfo[]) => {
        const cardSkuIds = showCardList.map((item) => item.skuId)
        const newData = dataList.filter(
            (item: any) => !cardSkuIds.includes(item.skuId)
        )
        const newCardData = addCardData(newData)
        const newCardList = [...showCardList, ...newCardData]
        setShowCardList(newCardList)
    }

    const addCardData = (newData: SkuInfo[]) => {
        const mapSelectedData = newData.map((item: SkuInfo) => {
            const selectedRowKeys = item.details.map(
                (detail: Detail) => detail.stockId
            )
            return { ...item, selectedRowKeys }
        })
        return mapSelectedData
    }

    const onselectionchange = (
        selectedRowKeys: React.Key[],
        selectedRows: any,
        skuId: string
    ) => {
        const newCardList = showCardList.map((item) => {
            return item.skuId === skuId ? { ...item, selectedRowKeys } : item
        })
        setShowCardList(newCardList)
    }

    const onSlotSpecCodeChange = (value: string, skuId: string) => {
        const newCardList = showCardList.map((item) => {
            return item.skuId === skuId
                ? { ...item, slotSpecCode: value }
                : item
        })
        setShowCardList(newCardList)
    }

    const getContainerAndFaces = () => {
        const filterContainerCardList = showCardList
            .filter((item) => item.selectedRowKeys.length > 0)
            .map((i) => {
                const selectDetails = i.details
                    .filter((detail: Detail) =>
                        i.selectedRowKeys.includes(detail.stockId)
                    )
                    .map((selectItem: Detail) => ({
                        containerCode: selectItem.containerCode,
                        containerFace: [selectItem.containerFace]
                    }))
                return selectDetails
            })
            .reduce((pre, cur) => pre.concat(cur), [])

        const containerAndFaces = filterContainerCardList.reduce(
            (pre: any, cur: any) => {
                const existContainer = pre.find(
                    (item: any) => item?.containerCode === cur?.containerCode
                )
                if (existContainer) {
                    return pre.map((item: any) =>
                        item.containerCode === existContainer.containerCode
                            ? {
                                  ...item,
                                  containerFace: Array.from(
                                      new Set(
                                          item.containerFace.concat(
                                              cur.containerFace
                                          )
                                      )
                                  )
                              }
                            : item
                    )
                }
                return [...pre, cur]
            },
            []
        )

        return containerAndFaces
    }

    const onSave = async () => {
        const newSlotSpecCode = showCardList.reduce((pre, cur) => {
            return cur.slotSpecCode ? [...pre, cur.slotSpecCode] : pre
        }, [])

        const params = {
            warehouseCode,
            containerAndFaces: getContainerAndFaces(),
            slotSpecCode: newSlotSpecCode,
            skuIds: showCardList.map((item) => item.skuId)
        }

        const { code } = await onCustomActionDispatch({
            eventCode: CustomActionType.CALL_CONTAINER,
            data: params
        })
        return code !== "-1"
    }

    const onScanBarcode = async (e: any) => {
        const barCode = e.target.value.trim()
        setScanCode("")
        selectMode
            ? selectContainerInboundScan(barCode)
            : wihoutOrderInboundScan(barCode)
    }

    const wihoutOrderInboundScan = async (barCode: string) => {
        await onCustomActionDispatch({
            eventCode: CustomActionType.INBOUND_WITHOUT_ORDER_SCAN_BARCODE,
            data: barCode
        })
    }

    const selectContainerInboundScan = (barCode: string) => {
        const filterAllBarCodeList = allCardList.filter((item) =>
            item.barcodes?.includes(barCode)
        )
        if (filterAllBarCodeList.length === 0) {
            message?.({
                type: MessageType.ERROR,
                content: t("toast.noInboundOrderWithBarCode")
            })
            return
        }
        const filterShowBarCodeList = showCardList.filter((item) =>
            item.barcodes?.includes(barCode)
        )
        if (filterAllBarCodeList.length === filterShowBarCodeList.length) {
            message?.({
                type: MessageType.ERROR,
                content: t("toast.repeatScan")
            })
            return
        }
        updateCardList(filterAllBarCodeList)
    }

    const style = (index: number) => ({
        width: "90%",
        backgroundColor: index % 2 === 0 ? "#c0e6f5" : "#fff",
        position: "relative",
        borderBottom: index === showCardList.length - 1 ? "1px solid #000" : 0,
        borderColor: "#000"
    })

    return (
        <>
            {selectMode ? <OrderInfo {...orderInfo} /> : null}

            <div className="d-flex gap-2 w-2/5">
                <span>{t("skuArea.scanBarcode")}</span>
                <Input
                    autoFocus
                    allowClear
                    ref={inputRef}
                    disabled={
                        showCardList.length >=
                        MAX_CARD_NUMBER[
                            workStationEvent?.operationType as keyof typeof OperationType
                        ]
                    }
                    value={scanCode}
                    onChange={(e) => setScanCode(e.target.value.trim())}
                    onPressEnter={onScanBarcode}
                    style={{ flex: 1, marginBottom: 10, marginLeft: 10 }}
                    data-testid="scanCode"
                />
            </div>
            {showCardList.map((card, index) => {
                return (
                    <SkuCard
                        style={style(index)}
                        card={card}
                        selectMode={selectMode}
                        specSlotOptions={specSlotOptions}
                        onselectionchange={onselectionchange}
                        onSlotSpecCodeChange={onSlotSpecCodeChange}
                    />
                )
            })}
        </>
    )
}

export default Content

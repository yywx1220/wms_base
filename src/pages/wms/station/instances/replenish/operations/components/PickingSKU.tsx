import { Divider, Row, Button, Select } from "antd"
import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import moment from "moment"

import Count from "@/pages/wms/station/widgets/common/Count"
import SkuInfo from "@/pages/wms/station/widgets/common/SkuInfo"
import { MessageType } from "@/pages/wms/station/widgets/message"
import InfoDisplay from "./InfoDisplay"
import { CustomActionType } from "@/pages/wms/station/instances/replenish/customActionType"
import { OrderList, OperationType } from "@/pages/wms/station/event-loop/types"
import ScanModule from "./ScanModule"
import RecommendTable from "./RecommendTable"

const returnDetail = (molecule: string, denominator: string) => {
    return `${Number.isFinite(molecule) ? molecule : "-"}/${
        Number.isFinite(denominator) ? denominator : "-"
    }`
}

const PickingSKU = (props: any) => {
    const { t } = useTranslation()
    const { value = {}, message, onCustomActionDispatch } = props

    const {
        orderArea,
        skuArea,
        workLocationArea,
        warehouseCode,
        scanedCode,
        callContainerCount,
        processingInboundOrderDetailId
    } = value

    const selectMode =
        value.operationType === OperationType.SELECT_CONTAINER_PUT_AWAY

    const orderInfo = orderArea?.find((item: any) => item.active)
    const pickingInfo = skuArea?.pickingViews?.[0]
    const { recommendSkuInfos = [] } = skuArea || {}
    const arrivedContainer =
        workLocationArea?.workLocationViews?.[0].workLocationSlots?.[0]
            .arrivedContainer

    const ref = useRef<any>(null)
    const refCount = useRef<any>(null)
    const [planReceiveQtyOne, setPlanReceiveQty] = useState<
        string | number | null
    >("")

    // 第一次渲染页面时光标定位到扫码输入框

    useEffect(() => {
        if (!scanedCode) {
            planReceiveQtyOne && setPlanReceiveQty("")
        } else {
            refCount?.current?.focus()
        }
    }, [scanedCode])

    useEffect(() => {
        // 判断一下是否触发了电子标签排灯引起的渲染
        if (!selectMode) return
        setPlanReceiveQty(
            pickingInfo?.operationTaskDTOS?.[0].toBeOperatedQty || ""
        )
    }, [
        pickingInfo?.skuMainDataDTO?.skuCode,
        pickingInfo?.operationTaskDTOS?.[0].toBeOperatedQty
    ])

    const orderOptions =
        orderArea?.length > 1 &&
        orderArea.map((item: OrderList) => ({
            value: item.customerOrderNo,
            label: item.customerOrderNo
        }))
    const orderList = [
        {
            // title: intl.formatMessage({
            //     id: "workstaion.replenish.text.customerOrderNoOrLpn"
            // }),
            title: t("table.customerOrderNo"),
            value: orderInfo?.customerOrderNo,
            key: "customerOrderNo",
            span: 13,
            render: () => {
                return orderArea?.length > 1 ? (
                    <Select
                        value={orderInfo?.customerOrderNo}
                        className="w-full order-input"
                        style={{
                            color: "#292B3E",
                            fontSize: 24
                        }}
                        bordered={false}
                        options={orderOptions || []}
                        onChange={handleOrderChange}
                    />
                ) : (
                    <span className="text-ellipsis">
                        {orderInfo?.customerOrderNo ?? "-"}
                    </span>
                )
            }
        },
        {
            // title: intl.formatMessage({ id: "basic.commodity.field.Item" }),
            title: t("orderArea.sku"),
            value: returnDetail(
                orderInfo?.receivedSkuTypes,
                orderInfo?.allSkuTypes
            ),
            span: 5,
            key: "receivedItemNum"
        },
        {
            // title: intl.formatMessage({ id: "basic.commodity.field.total" }),
            title: `${t("orderArea.receivedPiecesInPO")}`,
            value: returnDetail(orderInfo?.qtyReceived, orderInfo?.qtyNeed),
            span: 6,
            key: "receivedQty"
        }
    ]

    const handleOrderChange = async (value: string) => {
        await onCustomActionDispatch({
            eventCode: CustomActionType.SCAN_LPN_OR_CUSTOMER_ORDER_NO,
            data: {
                identifyNo: value, //识别码
                warehouseCode, //仓库代码
                skuCode: pickingInfo?.skuMainDataDTO?.skuCode
            }
        })
    }

    const onCountChange = (val: number) => {
        setPlanReceiveQty(val)
    }

    const onConfirmHanld = async () => {
        if (!Number(planReceiveQtyOne)) {
            message?.({
                type: MessageType.WARNING,
                content: t("toast.incorrectQty")
            })
            return
        }
        if (!arrivedContainer.activeSlotCodes) {
            message?.({
                type: MessageType.WARNING,
                content: t("toast.selectContainerSlot")
            })
            return
        }
        const res = selectMode ? onConfirmFn() : onWithoutOrderConfirm()
        if (await res) {
            setPlanReceiveQty(0)
            // setScanCode("")
        }
    }

    const onWithoutOrderConfirm = async () => {
        const data = {
            skuId: pickingInfo.skuMainDataDTO.id, //SKU ID
            skuCode: pickingInfo.skuMainDataDTO.skuCode, //SKU 代码
            skuName: pickingInfo.skuMainDataDTO.skuName, //SKU 名称
            warehouseCode: pickingInfo.skuMainDataDTO.warehouseCode, //仓库代码
            ownerCode: pickingInfo.skuMainDataDTO.ownerCode, //货主代码
            containerCode: arrivedContainer.containerCode, //容器代码
            containerFace: arrivedContainer.face, //容器面
            containerSlotCode: arrivedContainer.activeSlotCodes?.[0], //容器格口（储位编码）
            containerSpecCode: arrivedContainer.containerSpec.containerSpecCode, //容器规格代码
            lpnCode: arrivedContainer.containerCode, //LPN代码 如果没有则为空
            qtyPutAway: planReceiveQtyOne, //补货数量
            batchAttributes: {
                inboundDate: moment(new Date()).format("YYYYMMDD")
            }
        }
        const { code, msg } = await onCustomActionDispatch({
            eventCode: CustomActionType.PUT_AWAY_WITHOUT_ORDER_CONFIRM,
            data
        })
        return code !== "-1"
    }

    const onConfirmFn = async () => {
        const data = {
            inboundPlanOrderId: orderInfo?.orderId, //入库单ID
            skuCode: pickingInfo.skuMainDataDTO.skuCode, //SKU 代码
            skuName: pickingInfo.skuMainDataDTO.skuName, //SKU 名称
            ownerCode: pickingInfo.skuMainDataDTO.ownerCode, //货主
            warehouseCode: pickingInfo.skuMainDataDTO.warehouseCode, //仓库代码
            containerCode: arrivedContainer.containerCode, //容器代码
            containerSlotCode: arrivedContainer.activeSlotCodes?.[0], //容器槽位代码
            containerSpecCode: arrivedContainer.containerSpec.containerSpecCode, //容器规格代码
            containerFace: arrivedContainer.face, //容器朝向
            qtyPutAway: planReceiveQtyOne, //补货数量
            inboundOrderNo: orderInfo?.orderNo, //入库单号,WMS系统内部入库单号
            lpnCode: orderInfo?.lpnCode, //LPN代码 如果没有则为空
            batchAttributes: pickingInfo.skuBatchAttributeDTO?.skuAttributes,
            inboundPlanOrderDetailId: processingInboundOrderDetailId
        }
        const { code, msg } = await onCustomActionDispatch({
            eventCode: CustomActionType.PUT_AWAY_CONFIRM,
            data
        })
        return code !== "-1"
    }

    const requestFull = async () => {
        const eventCode = selectMode
            ? CustomActionType.PUT_AWAY_CONTAINER_LEAVE
            : CustomActionType.PUT_AWAY_WITHOUT_ORDER_CONTAINER_LEAVE
        await onCustomActionDispatch({
            eventCode,
            data: {
                warehouseCode, //仓库代码
                containerCode: arrivedContainer.containerCode, //容器编码
                containerFace: arrivedContainer.face
            }
        })
    }

    return (
        <div className="d-flex flex-col h-full relative">
            {selectMode ? (
                <>
                    <InfoDisplay infoList={orderList} gutter={16} />
                    <Divider style={{ margin: "16px 0" }} />
                </>
            ) : null}
            <ScanModule
                scanedCode={scanedCode}
                selectMode={selectMode}
                onCustomActionDispatch={onCustomActionDispatch}
            />
            <SkuInfo
                {...pickingInfo}
                imgWidth={120}
                detailHeight={120}
                orderId={orderArea?.orderId}
                refs={ref}
            />
            <div className="d-flex gap-4">
                {selectMode ? (
                    <div
                        className="w-full h-20 d-flex items-center pl-6"
                        style={{ background: "#F8F8F8", color: "#696B7D" }}
                    >
                        <div>
                            <div>{t("orderArea.received")}/</div>
                            <div>{t("orderArea.required")}</div>
                        </div>
                        <div
                            className="h-10 w-px mx-8"
                            style={{ background: "#DCDCDC" }}
                        ></div>
                        <span className="text-3xl" style={{ color: "#292B3E" }}>
                            {returnDetail(
                                pickingInfo?.operationTaskDTOS?.[0].operatedQty,
                                pickingInfo?.operationTaskDTOS?.[0].requiredQty
                            )}
                        </span>
                    </div>
                ) : null}

                <Row className="gap-2.5">
                    <Count
                        ref={refCount}
                        height={selectMode ? 80 : 100}
                        width="100%"
                        wantScant={false}
                        isWorkStationInput
                        disable={!scanedCode}
                        // handleStatusChange={handleActualPickNumStatus}
                        onChange={onCountChange}
                        max={
                            pickingInfo?.operationTaskDTOS?.[0]
                                .toBeOperatedQty || Infinity
                        }
                        value={planReceiveQtyOne}
                        precision={0}
                    />
                </Row>
            </div>
            <div
                className="d-flex justify-between text-lg pb-1 pt-3 font-medium"
                style={{ color: "#292B3E" }}
            >
                <span>{t("skuArea.recommendedLists")}</span>
                <span className="pr-2">
                    {t("skuArea.numberOfContainersCalled")}：
                    <span data-testid="callContainerCount">
                        {callContainerCount}
                    </span>
                </span>
            </div>
            <RecommendTable
                selectMode={selectMode}
                recommendSkuInfos={recommendSkuInfos}
                onCustomActionDispatch={onCustomActionDispatch}
            />

            <div className="d-flex justify-end mt-3 absolute -bottom-0	-right-0">
                <Button
                    size="large"
                    disabled={!arrivedContainer || scanedCode}
                    onClick={requestFull}
                    style={{
                        background:
                            arrivedContainer && !scanedCode
                                ? "#F8AA61"
                                : "#f5f5f5",
                        color:
                            arrivedContainer && !scanedCode
                                ? "#fff"
                                : "rgba(0,0,0,0.25)",
                        borderRadius: 5,
                        fontSize: 14,
                        minWidth: 90
                    }}
                    data-testid="containerLeave"
                >
                    {t("button.containerLeave")}
                </Button>
                <Button
                    size="large"
                    type="primary"
                    disabled={!scanedCode}
                    onClick={onConfirmHanld}
                    className="ml-6"
                    style={{ borderRadius: 5, fontSize: 14, width: 90 }}
                    data-testid="putawayConfirm"
                >
                    {t("button.confirm")}
                </Button>
            </div>
        </div>
    )
}

export default PickingSKU

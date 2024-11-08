import { Row, Button, Col, Input, Card } from "antd"

import classNames from "classnames/bind"
import React, { useEffect, useRef, useState } from "react"
import { ScanOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"

// import stationQtyCalculator from "@/config/JS/Project/project.station.calculator"
import type { OperationProps } from "@/pages/wms/station/instances/types"

import styles from "./styles/StocktakeHandler.module.scss"
import { CustomActionType } from "@/pages/wms/station/instances/stocktake/customActionType"
import {
    WorkStationEvent,
    pickingViewItem
} from "@/pages/wms/station/event-loop/types"
import DataDisplay from "@/pages/wms/station/widgets/common/DataDisplay"
import SKUDetail from "@/pages/wms/station/widgets/common/SKUDetail"
import LargeButton from "@/pages/wms/station/widgets/common/LargeButton"
import ProblemModal from "./components/ProblemModal"
import LastTaskCard from "./components/TaskCard"
import PromptCard from "./components/PromptCard"

const cx = classNames.bind(styles)

type StocktakeAreaProps = pickingViewItem & {
    scanCode: string | null
    stationProcessingStatus: string | null
    orderArea: OrderArea
    srcContainerCode: string
    srcContainerFace: string
    targetContainerCode: string
    targetContainerFace: string
    srcStockIds: string
    targetStockIds: string
}

interface OrderArea {
    qtyReceived: number
    qtyNeed: number
}

/**
 * @Description: 对event中的数据进行filter处理
 * @param data
 */
export const valueFilter = (data?: WorkStationEvent<any>) => {
    if (!data) return {}
    const srcContainer =
        data.workLocationArea?.workLocationViews?.[0].workLocationSlots?.find(
            (item) =>
                item?.arrivedContainer?.containerAttributes?.locationCode ===
                "src"
        )?.arrivedContainer
    const targetContainer =
        data.workLocationArea?.workLocationViews?.[0].workLocationSlots?.find(
            (item) =>
                item?.arrivedContainer?.containerAttributes?.locationCode ===
                "tar"
        )?.arrivedContainer
    return {
        ...data.skuArea?.pickingViews?.[0],
        scanCode: data.scanCode,
        stationProcessingStatus: data.stationProcessingStatus,
        orderArea: data.orderArea,
        srcContainerCode: srcContainer?.containerCode,
        srcContainerFace: srcContainer?.face,
        srcStockIds: srcContainer?.containerAttributes?.stockIds,
        targetContainerCode: targetContainer?.containerCode,
        targetContainerFace: targetContainer?.face,
        targetStockIds: targetContainer?.containerAttributes?.stockIds
    }
}

const TallyInfoHandler = (
    props: OperationProps<StocktakeAreaProps, unknown>
) => {
    const { t } = useTranslation()
    const { value, message, onCustomActionDispatch } = props

    const {
        operationTaskDTOS = [],
        skuMainDataDTO,
        scanCode,
        stationProcessingStatus,
        orderArea,
        srcContainerCode,
        srcContainerFace,
        targetContainerCode,
        targetContainerFace,
        srcStockIds,
        targetStockIds
    } = value || {}
    // const countRef = useRef<any>(null)
    const scanInputRef = useRef<any>(null)
    // const [currentStocktakeQty, setCurrentStocktakeQty] = useState<
    //     string | number | null
    // >(0)
    const [scanInputValue, setScanInputValue] = useState<string>("")
    const [isModalOpen, setIsModalOpen] = useState(false)

    // 第一次渲染页面时光标定位到扫码输入框
    useEffect(() => {
        if (scanInputRef.current?.input?.value) return
        scanInputRef.current?.focus()
    }, [scanInputRef.current])

    useEffect(() => {
        if (!scanCode) {
            scanInputValue && setScanInputValue("")
            scanInputRef?.current?.focus()
        } else {
            // countRef?.current?.focus()
            setScanInputValue(scanCode || "")
            // setCurrentStocktakeQty(operationTaskDTOS[0]?.requiredQty)
        }
    }, [scanCode])

    // useEffect(() => {
    //     // 切任务时，聚焦和清空数量
    //     if (!currentTaskDetailDTO) {
    //         setCurrentStocktakeQty(0)
    //         return
    //     }
    //     setCurrentStocktakeQty(currentTaskDetailDTO.qtyStocktake)

    //     if (
    //         (currentTaskDetailDTO.noBarcode || resolveVo?.code) &&
    //         !currentTaskDetailDTO.snCode &&
    //         stocktakeConfig.pickType === PickTypeEnum.ORDER_LINE
    //     ) {
    //         // 无码商品 非序列号 多行扫描成功时，聚焦数量输入框
    //         countRef.current?.focus()
    //     } else {
    //         // scanCode渲染后再选中内容
    //         setTimeout(() => {
    //             scanInputRef.current?.focus()
    //             scanInputRef.current?.select()
    //         }, 0)
    //     }
    // }, [currentTaskDetailDTO])

    const onScanEnter = async (value: string) => {
        if (!value) return
        const { code } = await onCustomActionDispatch({
            eventCode: CustomActionType.SCAN_BARCODE,
            data: value
        })
        if (code === "-1") {
            setScanInputValue("")
        }
    }

    // const onCountChange = (val: string | number | null) => {
    //     setCurrentStocktakeQty(val)
    // }

    const onScanInputChange = (e: any) => {
        setScanInputValue(e.target.value.trim())
    }

    const handleClickFlagProblem = () => {
        setIsModalOpen(true)
    }

    const handleFinishScan = async () => {
        // setScanCode(scanInputValue)
        const { code, msg } = await onCustomActionDispatch({
            eventCode: CustomActionType.SCAN_BARCODE,
            data: scanInputValue
        })
        if (code === "-1") {
            scanInputRef.current?.select()
        }
    }

    const onPressEnter = () => {}

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const handleFinishTally = async () => {
        // setScanCode("")
        const { code, msg } = await onCustomActionDispatch({
            eventCode: CustomActionType.RELOCATION_CONFIRM,
            data: {
                operationTaskId: operationTaskDTOS[0]?.id,
                qtyOperated: operationTaskDTOS[0]?.toBeOperatedQty,
                abnormal: false,
                remark: ""
            }
        })
    }

    const handleContainerLeave = async () => {
        const { code, msg } = await onCustomActionDispatch({
            eventCode: CustomActionType.RELOCATION_LEAVE,
            data: {
                containerGroups: [
                    {
                        containerCode: srcContainerCode,
                        containerFace: srcContainerFace
                    },
                    {
                        containerCode: targetContainerCode,
                        containerFace: targetContainerFace
                    }
                ]
            }
        })
    }

    return (
        <>
            <div className="d-flex flex-col h-full relative">
                <Row className="flex-1">
                    <DataDisplay
                        span={12}
                        title="Tasks"
                        value={`${orderArea?.[0].qtyReceived ?? 0} / ${
                            orderArea?.[0].qtyNeed ?? 0
                        }`}
                    />
                </Row>
                <Row
                    className="mt-3 p-3 flex-1"
                    justify="space-between"
                    style={{ backgroundColor: "#F8F8F8" }}
                >
                    {stationProcessingStatus === "CONTAINER_ARRIVED" ? (
                        scanCode ? (
                            <>
                                <Col span={10}>
                                    <LargeButton
                                        text="Flag Problem"
                                        backgroundColor="#ff0000"
                                        onClick={handleClickFlagProblem}
                                    />
                                </Col>
                                <Col span={10}>
                                    <LargeButton
                                        text="All Quantity Moved"
                                        backgroundColor="#47d359"
                                        onClick={handleFinishTally}
                                    />
                                </Col>
                            </>
                        ) : (
                            <Col span={24}>
                                <Input
                                    size="large"
                                    autoFocus
                                    prefix={
                                        <ScanOutlined
                                            style={{
                                                paddingRight: 5,
                                                fontSize: 24,
                                                color: "#696B7D"
                                            }}
                                        />
                                    }
                                    value={scanInputValue}
                                    onChange={onScanInputChange}
                                    onPressEnter={handleFinishScan}
                                    placeholder={t(
                                        "skuArea.scanOrEnterBarcode"
                                    )}
                                    // allowClear
                                    ref={scanInputRef}
                                    style={{
                                        height: 50,
                                        borderRadius: 5,
                                        // background: "#F4F4F5",
                                        borderColor: "#f4f4f5"
                                    }}
                                    data-testid="scanInboundSku"
                                />
                                <Button
                                    // size="small"
                                    type="primary"
                                    className={cx("operation-btn")}
                                    onClick={handleFinishScan}
                                    // disabled={!currentTaskDetailDTO}
                                    style={{
                                        borderRadius: 5,
                                        fontSize: 14,
                                        width: "100%",
                                        marginTop: 10
                                    }}
                                >
                                    {t("button.submit")}
                                </Button>
                            </Col>
                        )
                    ) : null}
                </Row>
                <Row
                    className="mt-3 p-3 flex-2"
                    style={{ backgroundColor: "#F8F8F8" }}
                >
                    <Col span={24}>
                        {stationProcessingStatus === "CONTAINER_ARRIVED" ? (
                            <SKUDetail
                                skuName={skuMainDataDTO?.skuName}
                                barcodes={skuMainDataDTO?.skuBarcode?.barcodes}
                                skuCode={skuMainDataDTO?.skuCode}
                                imageUrl={
                                    skuMainDataDTO?.skuAttribute?.imageUrl
                                }
                                toBeOperatedQty={
                                    operationTaskDTOS[0]?.toBeOperatedQty
                                }
                            />
                        ) : (
                            <PromptCard
                                stationProcessingStatus={
                                    stationProcessingStatus
                                }
                            />
                        )}
                    </Col>
                </Row>
                <Row
                    justify="space-between"
                    align="middle"
                    className="mt-3 p-3 flex-1"
                    style={{ backgroundColor: "#F8F8F8" }}
                >
                    <Col span={16}>
                        <LastTaskCard
                            lastTasks={orderArea?.[0]?.lastTasks}
                            onCustomActionDispatch={onCustomActionDispatch}
                        />
                    </Col>
                    <Col span={6} className="h-full">
                        <LargeButton
                            text="Container Leave"
                            backgroundColor="#ffc101"
                            onClick={handleContainerLeave}
                        />
                    </Col>
                </Row>
            </div>
            <ProblemModal
                isModalOpen={isModalOpen}
                handleCancel={handleCancel}
                onCustomActionDispatch={onCustomActionDispatch}
                operationTaskId={operationTaskDTOS[0]?.id}
                containerCode={operationTaskDTOS[0]?.targetContainerCode}
                containerFace={operationTaskDTOS[0]?.targetContainerFace}
                containerSlotCode={
                    operationTaskDTOS[0]?.targetContainerSlotCode
                }
                srcContainerId={operationTaskDTOS[0]?.sourceContainerId}
                targetContainerId={operationTaskDTOS[0]?.targetContainerId}
                srcStockIds={srcStockIds}
                targetStockIds={targetStockIds}
            />
        </>
    )
}

export default TallyInfoHandler

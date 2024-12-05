import { Divider, Modal, Row, Button, Col, Input } from "antd"
import classNames from "classnames/bind"
import React, { useEffect, useRef, useState } from "react"
import { ScanOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"

// import stationQtyCalculator from "@/config/JS/Project/project.station.calculator"
import type { OperationProps } from "@/pages/wms/station/instances/types"
import { MessageType } from "@/pages/wms/station/widgets/message"

import styles from "./styles/StocktakeHandler.module.scss"
import InfoDisplay from "@/pages/wms/station/instances/replenish/operations/components/InfoDisplay"
import SkuInfo from "@/pages/wms/station/widgets/common/SkuInfo"
import Count from "@/pages/wms/station/widgets/common/Count"
import { CustomActionType } from "@/pages/wms/station/instances/stocktake/customActionType"
import {
    WorkStationEvent,
    pickingViewItem
} from "@/pages/wms/station/event-loop/types"
import request from "@/utils/requestInterceptor"

const cx = classNames.bind(styles)

type StocktakeAreaProps = pickingViewItem & {
    scanCode: string | null
}

/**
 * @Description: 对event中的数据进行filter处理
 * @param data
 */
export const valueFilter = (data?: WorkStationEvent<any>) => {
    if (!data) return {}
    return { ...data.skuArea?.pickingViews?.[0], scanCode: data.scanCode }
}

const StocktakeAreaHandler = (
    props: OperationProps<StocktakeAreaProps, unknown>
) => {
    const { t } = useTranslation()
    const { value, message, onCustomActionDispatch } = props

    const {
        skuMainDataDTO,
        skuBatchAttributeDTO,
        operationTaskDTOS = [],
        scanCode
    } = value || {}
    const countRef = useRef<any>(null)
    const scanInputRef = useRef<any>(null)
    const [currentStocktakeQty, setCurrentStocktakeQty] = useState<
        string | number | null
    >(0)
    const [scanInputValue, setScanInputValue] = useState<string>(scanCode || "")
    const [stocktakeInfo, setStocktakeInfo] = useState<any>({})

    useEffect(() => {
        getStockTakeOptions()
    }, [operationTaskDTOS[0]?.extendInfo])

    const getStockTakeOptions = async () => {
        const res: any = await request({
            method: "post",
            url: `/mdm/config/dictionary/getAll`
        })

        const stocktakeMethod = res?.data?.StocktakeMethod.find((item: any) => {
            return (
                item.value === operationTaskDTOS[0]?.extendInfo?.stocktakeMethod
            )
        })?.label

        const stocktakeType = res?.data?.StocktakeType.find((item: any) => {
            return (
                item.value === operationTaskDTOS[0]?.extendInfo?.stocktakeType
            )
        })?.label
        setStocktakeInfo({
            stocktakeMethod,
            stocktakeType
        })
    }

    // 第一次渲染页面时光标定位到扫码输入框
    useEffect(() => {
        if (scanInputRef.current.input.value) return
        scanInputRef.current.focus()
    }, [scanInputRef.current])

    useEffect(() => {
        if (!scanCode) {
            scanInputValue && setScanInputValue("")
            scanInputRef?.current?.focus()
        } else {
            countRef?.current?.focus()
            setScanInputValue(scanCode || "")
            setCurrentStocktakeQty(operationTaskDTOS[0]?.requiredQty)
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

    const infoList = [
        {
            title: t("table.countOrderNumber"),
            value: operationTaskDTOS[0]?.extendInfo?.stocktakeOrderNo,
            key: "stocktakeOrderNo",
            span: 10
        },
        {
            title: t("table.countMethod"),
            value: stocktakeInfo.stocktakeMethod,
            span: 7,
            key: "stocktakeMethod"
        },
        {
            title: t("table.countType"),
            value: stocktakeInfo.stocktakeType,
            span: 7,
            key: "stocktakeType"
        }
    ]

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

    const onPressEnter = (e: any) => {
        onScanEnter(e.target.value.trim())
    }

    const onCountChange = (val: string | number | null) => {
        setCurrentStocktakeQty(val)
    }

    const onStocktakeConfirm = () => {
        if (!currentStocktakeQty && currentStocktakeQty !== 0) {
            message?.({
                type: MessageType.WARNING,
                content: t("toast.incorrectQty")
            })
            return
        }
        if (currentStocktakeQty !== operationTaskDTOS[0]?.requiredQty) {
            Modal.confirm({
                title: t("toast.inconsistentQuantity"),
                content: t("toast.inconsistentToastContent"),
                onOk: () => {
                    stockTakeSubmit()
                }
            })
            return
        }
        stockTakeSubmit()
        // 盘点数取当前输入框的值
    }

    const stockTakeSubmit = async () => {
        const { code, msg } = await onCustomActionDispatch({
            eventCode: CustomActionType.STOCKTAKE_SUBMIT,
            data: {
                detailId: operationTaskDTOS[0]?.detailId,
                stocktakeQty: currentStocktakeQty
            }
        })

        if (code !== "-1") {
            setCurrentStocktakeQty(0)
            setScanInputValue("")
            // getCurrentTip()
        }
    }

    const onScanInputChange = async (e: any) => {
        const value = e.target.value.trim()
        if (scanCode && !value) {
            await onCustomActionDispatch({
                eventCode: CustomActionType.SCAN_BARCODE_RESET,
                data: scanCode
            })
            return
        }
        setScanInputValue(value)
    }

    return (
        <div className="d-flex flex-col h-full relative">
            <InfoDisplay infoList={infoList} gutter={16} />
            <Divider style={{ margin: "30px 0 24px" }} />
            <Row className={cx("scan-sku")}>
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
                        onPressEnter={onPressEnter}
                        placeholder={t("skuArea.scanOrEnterBarcode")}
                        allowClear
                        ref={scanInputRef}
                        style={{
                            height: 50,
                            borderRadius: 5,
                            background: "#F4F4F5",
                            borderColor: "#f4f4f5"
                        }}
                        data-testid="scanInboundSku"
                    />
                </Col>
            </Row>
            <div>
                <SkuInfo
                    // skuMainDataDTO={skuMainDataDTO}
                    // skuBatchAttributeDTO={skuBatchAttributeDTO}
                    imgWidth={180}
                    detailHeight={180}
                    skuName={skuMainDataDTO?.skuName}
                    barCode={skuMainDataDTO?.skuBarcode?.barcodes[0]}
                    url={skuMainDataDTO?.skuAttribute?.imageUrl}
                    skuAttributes={skuBatchAttributeDTO?.skuAttributes}
                />
            </div>
            <Row className="pt-4 pb-3">
                <div
                    className="w-full h-20 d-flex items-center pl-6"
                    style={{ background: "#F8F8F8", color: "#696B7D" }}
                >
                    <div>
                        {/* <div>{t("orderArea.received")}/</div> */}
                        <div>
                            {t("skuArea.stockQuantity")}
                            {/* {t("orderArea.required")} */}
                        </div>
                    </div>
                    <div
                        className="h-10 w-px mx-8"
                        style={{ background: "#DCDCDC" }}
                    ></div>
                    <span className="text-3xl" style={{ color: "#292B3E" }}>
                        {operationTaskDTOS[0]?.requiredQty || "-"}
                    </span>
                </div>
            </Row>
            <Row className="gap-4 pb-3">
                <Count
                    ref={countRef}
                    height={100}
                    width="100%"
                    wantScant={false}
                    isWorkStationInput
                    disable={!scanCode}
                    // handleStatusChange={handleActualPickNumStatus}
                    onChange={onCountChange}
                    // max={operationTaskDTOS[0]?.requiredQty}
                    value={currentStocktakeQty}
                    precision={0}
                />
            </Row>
            <div className="d-flex justify-end mt-3 absolute -bottom-0	-right-0">
                <Button
                    size="large"
                    type="primary"
                    className={cx("operation-btn")}
                    onClick={onStocktakeConfirm}
                    disabled={!scanCode}
                    style={{ borderRadius: 5, fontSize: 14, width: 90 }}
                >
                    {t("button.confirm")}
                </Button>
            </div>
        </div>
    )
}

export default StocktakeAreaHandler

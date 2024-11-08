import { Col, Modal, Result, Row, Button, Pagination, Input } from "antd"
import type { PaginationProps } from "antd"
import classNames from "classnames/bind"
import { debounce } from "lodash"
import React, { useEffect, useRef, useState, useCallback } from "react"
import { ScanOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"

import PureScanInput from "@/pages/wms/station/widgets/common/ScanInput/PureScanInput"
import SkuInfo from "@/pages/wms/station/widgets/common/SkuInfo"
import { MessageType } from "@/pages/wms/station/widgets/message"
import SkuAutoComplete from "@/pages/wms/station/widgets/common/SkuAutoComplete"
import style from "../../index.module.scss"
import { CustomActionType } from "@/pages/wms/station/instances/replenish/customActionType"

const cx = classNames.bind(style)

const PickingWholeBox = (props: any) => {
    const { t } = useTranslation()
    const { value = {}, message, onCustomActionDispatch } = props

    const { orderArea, skuArea, workLocationArea, warehouseCode, scanedCode } =
        value
    const orderInfo = orderArea?.find((item: any) => item.active)
    const arrivedContainer =
        workLocationArea?.workLocationViews?.[0].workLocationSlots?.[0]
            .arrivedContainer
    const pickingViews = skuArea?.pickingViews || []
    const ref = useRef<any>(null)
    const refScan = useRef<any>(null)
    const [scanCode, setScanCode] = useState(scanedCode || "")
    const [current, setCurrent] = useState<number>(1)
    const pickingInfo = pickingViews?.find(
        (item: any, index: number) => current === index + 1
    )
    useEffect(() => {
        refScan.current.focus()
    }, [refScan.current])

    const onPressEnter = debounce(async (val, isMOVEIN = false) => {
        if (isMOVEIN === true) {
            return
        }
        const { code } = await onCustomActionDispatch({
            eventCode: CustomActionType.WHOLE_BOX_SCAN_LPN,
            data: {
                lpnCode: scanCode, //LPN代码
                warehouseCode //仓库代码
            }
        })
        if (code === "-1") {
            setScanCode("")
        }
    }, 100)

    const onConfirmHanld = async () => {
        if (!arrivedContainer.activeSlotCodes) {
            message?.({
                type: MessageType.WARNING,
                content: t("toast.selectContainerSlot")
            })
            return
        }
        onConfirmFn()
    }

    const onConfirmFn = async () => {
        const { code, msg } = await onCustomActionDispatch({
            eventCode: CustomActionType.WHOLE_BOX_RECEIVE_CONFIRM,
            data: {
                inboundPlanOrderId: orderInfo.orderId, //入库单ID
                containerCode: arrivedContainer.containerCode, //容器代码
                containerSlotCode: arrivedContainer.activeSlotCodes?.[0], //容器槽位代码
                containerSpecCode:
                    arrivedContainer.containerSpec.containerSpecCode, //容器规格代码
                face: arrivedContainer.face //容器朝向
            }
        })
        // message?.({
        //     type: errorCode ? MessageType.ERROR : MessageType.SUCCESS,
        //     content: msg
        // })
        if (code !== "-1") {
            setScanCode("")
            setCurrent(1)
        }
    }

    const onFull = async () => {
        Modal.confirm({
            title: "",
            icon: "",
            content: (
                <Result
                    status="warning"
                    // title="实际收货数量与应收货数量不一致，是否确认提交？提交后剩余未收货商品将重新推荐容器！"
                    title={t("modal.confirmContainerLeave")}
                />
            ),
            onOk: () => {
                requestFull()
            }
        })
    }

    const requestFull = async () => {
        await onCustomActionDispatch({
            eventCode: CustomActionType.PUT_AWAY_CONTAINER_LEAVE,
            data: {
                warehouseCode, //仓库代码
                containerCode: arrivedContainer.containerCode, //容器编码
                containerFace: arrivedContainer.face
            }
        })
    }

    const onChange: PaginationProps["onChange"] = (page) => {
        setCurrent(page)
    }

    return (
        <div>
            <Row className={cx("scan-sku")}>
                <Col span={24}>
                    {/* <SkuAutoComplete
                        value={scanCode}
                        onChange={setScanCode}
                        onSelect={onPressEnter}
                        ref={refScan}
                        autoFocus
                    >
                        <PureScanInput
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
                            value={scanCode}
                            onPressEnter={onPressEnter}
                            placeholder={t("orderArea.scanLpnNo")}
                            allowClear
                            ref={refScan}
                            style={{
                                height: 50,
                                borderRadius: 5,
                                background: "#F4F4F5",
                                borderColor: "#f4f4f5"
                            }}
                        />
                    </SkuAutoComplete> */}
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
                        value={scanCode}
                        onChange={(e) => setScanCode(e.target.value.trim())}
                        onPressEnter={onPressEnter}
                        placeholder={t("orderArea.scanLpnNo")}
                        allowClear
                        ref={refScan}
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
            <SkuInfo
                {...pickingInfo}
                imgWidth={160}
                detailHeight={160}
                orderId={orderArea?.orderId}
                refs={ref}
            />
            {pickingViews?.length ? (
                <Pagination
                    simple
                    current={current}
                    onChange={onChange}
                    pageSize={1}
                    total={pickingViews?.length || 0}
                    className="px-6"
                />
            ) : null}

            <div
                className="w-full h-20 d-flex items-center pl-11 mt-6"
                style={{ background: "#F8F8F8", color: "#696B7D" }}
            >
                <span>{t("orderArea.required")}</span>
                <div
                    className="h-10 w-px mx-8"
                    style={{ background: "#DCDCDC" }}
                ></div>
                <span className="text-3xl" style={{ color: "#292B3E" }}>
                    {pickingInfo?.operationTaskDTOS?.[0].requiredQty}
                </span>
            </div>
            <div className="pull-right mt-4">
                <Button
                    size="large"
                    disabled={!arrivedContainer || orderArea}
                    onClick={requestFull}
                    style={{
                        background:
                            arrivedContainer && !orderArea
                                ? "#F8AA61"
                                : "#f5f5f5",
                        color:
                            arrivedContainer && !orderArea
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
                    disabled={!orderArea}
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

export default PickingWholeBox

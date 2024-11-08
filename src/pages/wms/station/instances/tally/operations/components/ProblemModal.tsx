import React, { useRef, useState } from "react"
import type { ReactNode } from "react"

import { Modal, Button } from "antd"
import { ArrowLeftOutlined } from "@ant-design/icons"

import Count from "@/pages/wms/station/widgets/common/Count"
import { CustomActionType } from "@/pages/wms/station/instances/stocktake/customActionType"

const ModalConfig = [
    {
        key: "Accommodate",
        buttonText: "TO Location Cannot Accommodate Requested Quantity",
        promptText: (
            <span>
                How many units were you able to move to the&nbsp;
                <strong>TO</strong> location?
            </span>
        )
    },
    {
        key: "TOLocationIncorrect",
        buttonText: "TO Location Shows Incorrect Stock Quantity",
        promptText: (
            <span>
                What is the current stock quantity at the&nbsp;
                <strong>TO</strong> location?
            </span>
        )
    },
    {
        key: "FROMLocationIncorrect",
        buttonText: "FROM Location Lacks Sufficient Stock",
        promptText: (
            <span>
                What is the current stock quantity at the&nbsp;
                <strong>FROM</strong> location?
            </span>
        )
    }
]

const ProblemModal = ({
    operationTaskId,
    containerCode,
    containerFace,
    containerSlotCode,
    srcContainerId,
    targetContainerId,
    srcStockIds,
    targetStockIds,
    isModalOpen,
    handleCancel,
    onCustomActionDispatch
}: any) => {
    const countRef = useRef<any>(null)

    const [actualOperateQty, setActualOperateQty] = useState<
        string | number | null
    >()

    const [secondModalConfig, setSecondModalConfig] = useState<{
        key: string
        promptText: ReactNode | string
        isOpen: boolean
    }>({
        key: "",
        promptText: "",
        isOpen: false
    })

    const handleModleButtonClick = (key: string, promptText: ReactNode) => {
        setSecondModalConfig({ key, promptText, isOpen: true })
        countRef?.current?.focus()
    }

    const handleBack = () => {
        setActualOperateQty(null)
        setSecondModalConfig({ key: "", promptText: "", isOpen: false })
    }

    const onCountChange = (val: string | number | null) => {
        setActualOperateQty(val)
    }

    const handleOkSave = async () => {
        if (secondModalConfig.key === "Accommodate") {
            const { code, msg } = await onCustomActionDispatch({
                eventCode: CustomActionType.RELOCATION_CONFIRM,
                data: {
                    qtyOperated: actualOperateQty,
                    abnormal: false,
                    operationTaskId,
                    remark: ""
                }
            })
            if (code !== "-1") {
                handleBack()
                handleCancel()
            }
        } else if (secondModalConfig.key === "TOLocationIncorrect") {
            const { code, msg } = await onCustomActionDispatch({
                eventCode: CustomActionType.RELOCATION_ABNORMAL,
                data: {
                    qtyInput: actualOperateQty,
                    containerId: targetContainerId,
                    containerLocationType: "tar",
                    operationTaskId,
                    stockIdStr: targetStockIds,
                    reason: ""
                }
            })
            if (code !== "-1") {
                handleBack()
                handleCancel()
            }
        } else if (secondModalConfig.key === "FROMLocationIncorrect") {
            const { code, msg } = await onCustomActionDispatch({
                eventCode: CustomActionType.RELOCATION_ABNORMAL,
                data: {
                    qtyInput: actualOperateQty,
                    containerId: srcContainerId,
                    containerLocationType: "src",
                    operationTaskId,
                    stockIdStr: srcStockIds,
                    reason: ""
                }
            })
            if (code !== "-1") {
                handleBack()
                handleCancel()
            }
        }
    }
    return (
        <>
            <Modal
                title=""
                centered={true}
                open={isModalOpen}
                closable={false}
                footer={
                    <div className="d-flex justify-center">
                        <Button
                            size="large"
                            shape="round"
                            onClick={handleCancel}
                            style={{ backgroundColor: "red", color: "#fff" }}
                        >
                            Cancel
                        </Button>
                    </div>
                }
            >
                {ModalConfig.map((item) => (
                    <Button
                        size="large"
                        block
                        className="mt-4"
                        onClick={() =>
                            handleModleButtonClick(item.key, item.promptText)
                        }
                        style={{ backgroundColor: "#dae9f8" }}
                    >
                        {item.buttonText}
                    </Button>
                ))}
            </Modal>
            <Modal
                title=""
                centered={true}
                open={secondModalConfig.isOpen}
                closable={false}
                footer={
                    <div className="d-flex justify-center">
                        <Button
                            size="large"
                            shape="round"
                            onClick={handleOkSave}
                            style={{
                                backgroundColor: "#47d359",
                                color: "#fff"
                            }}
                        >
                            Submit
                        </Button>
                    </div>
                }
            >
                <Button
                    type="primary"
                    ghost
                    icon={<ArrowLeftOutlined />}
                    onClick={handleBack}
                >
                    Back
                </Button>
                <div className="text-center py-2 text-xl">
                    {secondModalConfig.promptText}
                </div>
                <Count
                    ref={countRef}
                    height={100}
                    width="100%"
                    wantScant={false}
                    isWorkStationInput
                    onChange={onCountChange}
                    value={actualOperateQty}
                    // value={currentStocktakeQty}
                    precision={0}
                    // backgroundColor="yellow"
                />
            </Modal>
        </>
    )
}

export default ProblemModal

import React, { useState, useMemo } from "react"
import { Modal, Button, Row, Col, Form, Divider } from "antd"
import { DoubleRightOutlined, DoubleLeftOutlined } from "@ant-design/icons"
import { CustomActionType } from "@/pages/wms/station/instances/tally/customActionType"

import CardContent from "./CardContent"

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14, offset: 2 }
}

const PageSize = 3

const LastTaskCard = (props: any) => {
    const { lastTasks = [], onCustomActionDispatch } = props
    const lastTask = lastTasks?.[0] || {}
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCard, setSelectCard] = useState<any>({
        ...lastTask,
        taskId: 1
    })
    const [page, setPage] = useState(1)

    const currentTaskList = useMemo(() => {
        if (!lastTasks) return []
        if (lastTasks?.length <= 3) {
            return lastTasks
        }
        return lastTasks?.slice((page - 1) * PageSize, page * PageSize)
    }, [page, lastTasks])

    const handleCardClick = () => {
        if (!lastTasks || lastTasks.length === 0) return
        setIsModalOpen(true)
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const handleTaskCardClick = (task: any, index: number) => {
        setSelectCard({ ...task, taskId: index })
    }

    const handleLeftIconClick = () => {
        if (page === 1) return
        setPage(page - 1)
    }

    const handleRightIconClick = () => {
        setPage(page + 1)
    }

    const handleReDoTask = async () => {
        const { code } = await onCustomActionDispatch({
            eventCode: CustomActionType.RE_DO,
            data: selectedCard
        })
        if (code !== "-1") {
            setIsModalOpen(false)
        }
    }

    return (
        <>
            <CardContent
                {...lastTask}
                title="LAST TASK"
                onClick={handleCardClick}
            />
            <Modal
                title=""
                centered={true}
                open={isModalOpen}
                closable={false}
                footer={
                    <div className="d-flex justify-between">
                        <Button
                            size="large"
                            // shape="round"
                            onClick={handleCancel}
                            style={{
                                backgroundColor: "red",
                                color: "#fff",
                                width: "40%"
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="large"
                            // shape="round"
                            onClick={handleReDoTask}
                            style={{
                                backgroundColor: "#47d359",
                                color: "#fff",
                                width: "40%"
                            }}
                        >
                            RE-DO THIS TASK
                        </Button>
                    </div>
                }
                width={1000}
            >
                <div className="d-flex items-center w-full">
                    {page > 1 ? (
                        <Button
                            shape="circle"
                            icon={<DoubleLeftOutlined />}
                            size="large"
                            className="mr-4"
                            onClick={handleLeftIconClick}
                        />
                    ) : null}
                    <Row gutter={24} className="w-full">
                        {currentTaskList.map((item: any, index: number) => {
                            return (
                                <Col span={8}>
                                    <div
                                        style={{
                                            border:
                                                selectedCard.barCode ===
                                                item.barCode
                                                    ? "2px solid #000"
                                                    : "none"
                                        }}
                                    >
                                        <CardContent
                                            {...item}
                                            title={`TASK ${
                                                index +
                                                1 +
                                                (page - 1) * PageSize
                                            }`}
                                            onClick={() =>
                                                handleTaskCardClick(
                                                    item,
                                                    index +
                                                        1 +
                                                        (page - 1) * PageSize
                                                )
                                            }
                                        />
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                    {lastTasks && page < Math.ceil(lastTasks.length / 3) ? (
                        <Button
                            shape="circle"
                            icon={<DoubleRightOutlined />}
                            size="large"
                            className="ml-4"
                            onClick={handleRightIconClick}
                        />
                    ) : null}
                </div>

                <div className="d-flex justify-center items-center">
                    <Form
                        name="validate_other"
                        labelAlign="right"
                        className="pt-4 w-4/5 tallyTask"
                        colon={false}
                        {...formItemLayout}
                    >
                        <Form.Item
                            label="TASK"
                            style={{ fontSize: 18, backgroundColor: "#d9d9d9" }}
                        >
                            <span>{selectedCard.taskId}</span>
                        </Form.Item>
                        <Form.Item
                            label="SKU"
                            style={{ fontSize: 18, backgroundColor: "#d9d9d9" }}
                        >
                            <span>
                                {
                                    selectedCard.skuMainDataDTO?.skuBarcode
                                        ?.barcodes
                                }
                            </span>
                        </Form.Item>
                        <Form.Item
                            label="NAME"
                            style={{ fontSize: 18, backgroundColor: "#d9d9d9" }}
                        >
                            <span className="text-ellipsis-line2">
                                {selectedCard.skuMainDataDTO?.skuName}
                            </span>
                        </Form.Item>
                        <Form.Item
                            label="PID"
                            style={{ fontSize: 18, backgroundColor: "#d9d9d9" }}
                        >
                            <span className="ant-form-text">
                                {selectedCard.operationTaskDTO?.skuId}
                            </span>
                        </Form.Item>
                        <Form.Item
                            label="FROM SHELF"
                            style={{ fontSize: 18, backgroundColor: "#d9d9d9" }}
                        >
                            <span className="ant-form-text">
                                {selectedCard.operationTaskDTO
                                    ?.sourceContainerCode +
                                    selectedCard.operationTaskDTO
                                        ?.sourceContainerFace}
                            </span>
                        </Form.Item>
                        <Form.Item
                            label="TO SHELF"
                            style={{ fontSize: 18, backgroundColor: "#d9d9d9" }}
                        >
                            <span className="ant-form-text">
                                {selectedCard.operationTaskDTO
                                    ?.targetContainerCode +
                                    selectedCard.operationTaskDTO
                                        ?.targetContainerFace}
                            </span>
                        </Form.Item>
                        <Form.Item
                            label="MOVED QTY"
                            style={{ fontSize: 18, backgroundColor: "#d9d9d9" }}
                        >
                            <span className="ant-form-text">
                                {selectedCard.operationTaskDTO?.operatedQty}
                            </span>
                        </Form.Item>
                        <Form.Item
                            label="USER"
                            style={{ fontSize: 18, backgroundColor: "#d9d9d9" }}
                        >
                            <span className="ant-form-text">
                                {selectedCard.operationTaskDTO?.updateUser}
                            </span>
                        </Form.Item>
                        <Form.Item
                            label="TIME"
                            style={{ fontSize: 18, backgroundColor: "#d9d9d9" }}
                        >
                            <span className="ant-form-text">7:15:15 PM</span>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default LastTaskCard

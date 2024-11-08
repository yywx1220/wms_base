import type { WorkStationEvent } from "@/pages/wms/station/event-loop/types"
import type { replenishProps } from "@/pages/wms/station/instances/replenish/type"
import type { OperationProps } from "@/pages/wms/station/instances/types"
import React, { useEffect, useState } from "react"
import { CustomActionType } from "@/pages/wms/station/instances/replenish/customActionType"
import { Row, Col, Input, Divider, Button, InputNumber } from "antd"
import { MinusOutlined, PlusOutlined } from "@ant-design/icons"
import request from "@/utils/requestInterceptor"
import { container_spec } from "@/pages/wms/constants/select_search_api_contant"

let warehouseCode = localStorage.getItem("warehouseCode")

export interface ContainerHandlerConfirmProps {
    operationType: string
    operationId: string
    operationConfirmInfo: OperationConfirmInfo
}
interface OperationConfirmInfo {
    subContainerCode?: string
    containerCode?: string
}
export interface RobotHandlerProps {
    robotArea: any
    operationType: string
}

export enum MachineType {
    TANK_FEEDING_ROBOT = "TANK_FEEDING_ROBOT", // ("料箱机器人")
    LITTLE_LATENT_ROBOT = "LITTLE_LATENT_ROBOT", // ("小潜伏机器人-搬料箱")
    LARGE_LATENT_ROBOT = "LARGE_LATENT_ROBOT" // ("大潜伏机器人-搬料架")
}

interface NumericInputProps {
    style: React.CSSProperties
    value: string
    onChange: (value: string) => void
}

/**
 * @Description: 对event中的数据进行filter处理
 * @param data
 */
export const valueFilter = (
    data: WorkStationEvent<replenishProps> | undefined
):
    | OperationProps<RobotHandlerProps, ContainerHandlerConfirmProps>["value"]
    | Record<string, any> => {
    if (!data) return {}
    return {
        robotArea: data.workLocationArea,
        // operationId: data.operationId,
        operationType: data.operationType
    }
}

const RobotHandler = (
    props: OperationProps<RobotHandlerProps, ContainerHandlerConfirmProps>
) => {
    const { value, onCustomActionDispatch } = props

    const { robotArea } = value || {}

    const arrivedContainer =
        robotArea?.workLocationViews?.[0].workLocationSlots?.[0]
            ?.arrivedContainer

    const [inputValue, setInputValue] = useState<number>()

    useEffect(() => {
        request({
            method: "post",
            url:
                "/search/search/searchSelectResult?perPage=1000&activePage=1&warehouseCode-op=eq&warehouseCode=" +
                warehouseCode +
                "&containerType-op=eq&containerType=CONTAINER",
            data: {
                searchIdentity: "SearchContainerSpecCode3",
                searchObject: {
                    tables: "w_container_spec"
                },
                showColumns: [
                    {
                        dbField: "warehouse_code",
                        name: "warehouseCode",
                        javaType: "java.lang.String"
                    },
                    {
                        dbField: "container_type",
                        name: "containerType",
                        javaType: "java.lang.String"
                    },
                    {
                        dbField: "container_spec_code",
                        name: "value",
                        javaType: "java.lang.String"
                    },
                    {
                        dbField: "container_spec_name",
                        name: "label",
                        javaType: "java.lang.String"
                    },
                    {
                        dbField: "container_slot_specs",
                        name: "containerSlotSpecs",
                        javaType: "java.lang.String"
                    }
                ]
            }
        }).then((res: any) => {
            console.log("res", res?.data?.options)
        })
    }, [])

    const handleSelectSlot = async (cell: any) => {
        if (
            arrivedContainer?.activeSlotCodes?.includes(
                cell.containerSlotSpecCode
            )
        ) {
            return
        }
        await onCustomActionDispatch({
            eventCode: CustomActionType.CHOOSE_CONTAINER_SLOT_CODE,
            data: cell.containerSlotSpecCode
        })
        // return !errorCode
    }

    const onChange = (value: number) => {
        setInputValue(value)
    }

    const handleMinus = () => {
        if (!inputValue) return
        setInputValue((prev: number) => prev - 1)
    }

    const handlePlus = () => {
        setInputValue((prev: number) => prev + 1)
    }
    return (
        <>
            <div className="d-flex items-center">
                <div className="white-space-nowrap">请扫描容器号:</div>
                <Input bordered={false} />
            </div>
            <Divider style={{ margin: "12px 0" }} />
            <div className="px-10">
                <Row>
                    <Col span={6}>
                        <div className="text-right leading-loose">
                            输入收货数量：
                        </div>
                    </Col>
                    <Col>
                        <div className="border border-solid	">
                            <Button
                                icon={<MinusOutlined />}
                                type="text"
                                onClick={handleMinus}
                                // size={size}
                                style={{ borderRight: "1px solid #ccc" }}
                            />
                            <InputNumber
                                min={0}
                                // max={10}
                                controls={false}
                                bordered={false}
                                value={inputValue}
                                onChange={onChange}
                            />
                            <Button
                                icon={<PlusOutlined />}
                                type="text"
                                onClick={handlePlus}
                                // size={size}
                                style={{ borderLeft: "1px solid #ccc" }}
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <div className="text-right leading-loose">
                            容器规格选择：
                        </div>
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <div className="text-right leading-loose">
                            请输入格口号：
                        </div>
                    </Col>
                    <Col span={14}>
                        <Input />
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default RobotHandler

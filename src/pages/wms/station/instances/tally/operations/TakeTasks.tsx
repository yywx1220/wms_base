import React, { useEffect, useState, useRef } from "react"
import request from "@/utils/requestInterceptor"
import type { OperationProps } from "@/pages/wms/station/instances/types"
import { CustomActionType } from "@/pages/wms/station/instances/tally/customActionType"

import shelfImage from "@/icon/Group 219.png"
import { Descriptions, Button } from "antd"
import Count from "@/pages/wms/station/widgets/common/Count"

const TakeTasks = (props: OperationProps<any, unknown>) => {
    const { onCustomActionDispatch } = props
    const countRef = useRef<any>(null)
    const [takeTaskQTY, setTakeTaskQTY] = useState<string | number | null>(0)
    const [tasks, setTasks] = useState({
        totalTasks: 0,
        processingTasks: 0,
        pendingTasks: 0,
        relocationPreQueryResults: []
    })

    useEffect(() => {
        request({
            method: "post",
            url: "/station/relocation/pre",
            data: {
                operationType: "ONE_STEP_RELOCATION",
                relocationPurpose: "FIFO"
            }
        }).then((res: any) => {
            setTasks(res.data.data)
        })
    }, [])

    const onCountChange = (val: string | number | null) => {
        setTakeTaskQTY(val)
    }

    const handleTakeTask = async () => {
        const { code } = await onCustomActionDispatch({
            eventCode: CustomActionType.TAKE_TASK,
            data: {
                relocationPreQueryResults:
                    tasks.relocationPreQueryResults?.slice(
                        0,
                        takeTaskQTY as number
                    )
            }
        })
    }

    return (
        <div className="d-flex ">
            <div className="flex-1 d-flex flex-col justify-center items-center">
                <div className="border w-3/5 p-10">
                    <div className="text-2xl mb-4 text-center">
                        OVERSTOCK TO ROBOTICS
                    </div>
                    <div className="d-flex justify-center items-center">
                        <img src={shelfImage} alt="" />
                    </div>
                </div>
                <div className="border w-3/5  p-10">
                    <Descriptions
                        title=""
                        column={{ sm: 1 }}
                        colon={false}
                        labelStyle={{
                            textAlign: "right",
                            width: "80%",
                            fontSize: 18
                        }}
                        contentStyle={{
                            fontSize: 18
                        }}
                    >
                        <Descriptions.Item label="TOTAL TASKS">
                            {tasks.totalTasks}
                        </Descriptions.Item>
                        <Descriptions.Item label="PROCESSING">
                            {tasks.processingTasks}
                        </Descriptions.Item>
                        <Descriptions.Item label="PENDING">
                            {tasks.pendingTasks}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            </div>
            <div className="flex-1 d-flex justify-center items-center">
                <div className="border w-3/5 h-full p-10 d-flex flex-col justify-center">
                    <div className="text-xl pb-4 text-center">
                        PLEASE SELECT ONE ACTION
                    </div>
                    <div className="mb-4">
                        <Count
                            ref={countRef}
                            height={100}
                            width="100%"
                            wantScant={false}
                            isWorkStationInput
                            onChange={onCountChange}
                            value={takeTaskQTY}
                            max={tasks.pendingTasks}
                            precision={0}
                        />
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        block
                        onClick={handleTakeTask}
                    >
                        TAKE TASKS
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default TakeTasks

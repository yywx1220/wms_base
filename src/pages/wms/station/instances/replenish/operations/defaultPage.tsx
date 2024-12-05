import type {
    WorkStationEvent,
    StationProcessingStatus
} from "@/pages/wms/station/event-loop/types"
import type { OperationProps } from "@/pages/wms/station/instances/types"
import React from "react"
import { Translation } from "react-i18next"

import noTaskImg from "@/icon/station/no_task.png"
import waitBinImg from "@/icon/station/wait_bin.png"

export interface DefaultProps {
    containerViews: any
    workStationInfo?: SworkStationInfoInterface
}
interface SworkStationInfoInterface {
    stationStatus: string
}
export interface SKUHandlerConfirmProps {
    skuCode: string
}

export const valueFilter = (
    data: WorkStationEvent<any> | undefined
):
    | OperationProps<StationProcessingStatus, SKUHandlerConfirmProps>["value"]
    | Record<string, any> => {
    if (!data) return {}
    return data.stationProcessingStatus
}

export const taskStatusText = {
    NO_TASK: <Translation>{(t) => t("station.NO_TASK")}</Translation>,
    WAIT_ROBOT: <Translation>{(t) => t("station.WAITING_ROBOT")}</Translation>,
    WAIT_CONTAINER: (
        <Translation>{(t) => t("station.WAITING_CONTAINER")}</Translation>
    ),
    WAIT_CALL_CONTAINER: (
        <Translation>{(t) => t("station.CALL_CONTAINER")}</Translation>
    )
}

const taskStatusImage = {
    NO_TASK: noTaskImg,
    WAIT_ROBOT: waitBinImg,
    WAIT_CONTAINER: waitBinImg,
    WAIT_CALL_CONTAINER: waitBinImg
}

const DefaultPage = (
    props: OperationProps<StationProcessingStatus, SKUHandlerConfirmProps>
) => {
    const { value } = props
    return (
        <div
            className="d-flex flex-col items-center justify-center h-full text-xl font-bold"
            // className={cx("default-box")}
        >
            <img
                src={taskStatusImage[value as StationProcessingStatus]}
                alt=""
            />
            <div
                style={{ padding: "24px 0", textAlign: "center" }}
                data-testid="taskStatusText"
            >
                {taskStatusText[value as StationProcessingStatus] ||
                    taskStatusText.NO_TASK}
                {value === "NO_TASK" ? (
                    <div>
                        {
                            <Translation>
                                {(t) => t("station.TAKE_TASK")}
                            </Translation>
                        }
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default DefaultPage

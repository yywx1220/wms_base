import React from "react"
// import { ReactComponent as TaskTaskSvg } from "@/icon/fontIcons/tasktask.svg" // path to your '*.svg' file.
import TaskTaskSvg from "@/icon/fontIcons/tasktask.svg" // path to your '*.svg' file.

import Content from "@/pages/wms/station/instances/outbound/custom-actions/GetTask/OutboundTask"
import type { TabAction } from "@/pages/wms/station/tab-actions/types"
import { TabActionModalType } from "@/pages/wms/station/tab-actions/types"
import { MessageType } from "@/pages/wms/station/widgets/message"
import request from "@/utils/requestInterceptor"

const taskConfig: TabAction = {
    name: "领用任务",
    // <IntlMessages id="workstaion.outbound.dialog.title.getTask" />,
    key: "getTask",
    modalType: TabActionModalType.FULL_SCREEN,
    position: "left",
    permissions: [10703],
    icon: <TaskTaskSvg />,
    content: (props) => {
        return <Content {...props} />
    },
    modalConfig: {
        title: "领用任务",
        // <IntlMessages id="workstaion.outbound.dialog.title.getTask" />,
        bodyStyle: {
            padding: 0
        }
    },
    emitter: async (payload) => {
        const { setModalVisible } = payload
        setModalVisible(true)
    },
    onSubmit: async (ref, payload) => {
        const { selectedTasks } = ref?.current
        const { message } = payload
        if (!selectedTasks.length) return true
        // const { code, msg } = await PostArray(
        //     "/station/station/manualSelectOrder",
        //     selectedTasks
        // )
        const { code, msg }: any = await request({
            method: "post",
            url: "/station/station/manualSelectOrder",
            data: selectedTasks
        })
        if (code === "-1") {
            message?.({
                type: MessageType.ERROR,
                content: msg
            })
            return false
        }
        return code !== "-1"
    }
}

export default taskConfig

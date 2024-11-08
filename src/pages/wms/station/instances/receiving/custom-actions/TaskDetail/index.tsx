// import IntlMessages from '@/@jumbo/utils/IntlMessages';
import type { TabAction } from "@/pages/wms/station/tab-actions/types"
import { TabActionModalType } from "@/pages/wms/station/tab-actions/types"
import React from "react"
import { Translation } from "react-i18next"

import Content from "@/pages/wms/station/instances/replenish/custom-actions/TaskDetail/Content"

const TaskDetail: TabAction = {
    name: "上架任务详情",
    key: "TaskDetail",
    position: "left",
    modalType: TabActionModalType.FULL_SCREEN,
    icon: "",
    permissions: [10210],
    content: (props) => {
        return <Content {...props} />
    },
    modalConfig: {
        title: "上架任务详情",
        okText: "",
        footer: null
    },
    emitter: async (payload) => {
        const { setModalVisible } = payload
        setModalVisible(true)
    }
}

export default TaskDetail

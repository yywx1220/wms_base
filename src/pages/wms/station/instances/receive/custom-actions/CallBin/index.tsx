// import IntlMessages from '@/@jumbo/utils/IntlMessages';
import type { TabAction } from "@/pages/wms/station/tab-actions/types"
import { TabActionModalType } from "@/pages/wms/station/tab-actions/types"
import React from "react"
import { Translation } from "react-i18next"

// import Content from "@/pages/wms/station/instances/replenish/custom-actions/CallBin/Content"
import Content from "./Content"

const callBin: TabAction = {
    name: <Translation>{(t) => t("button.callContainer")}</Translation>,
    key: "callBin",
    modalType: TabActionModalType.FULL_SCREEN,
    icon: "",
    disabled: (workStationEvent) => {
        return !!workStationEvent?.callContainerCount
    },
    permissions: [10210],
    testid: "callBin",
    content: (props) => {
        return <Content {...props} />
    },
    modalConfig: {
        title: <Translation>{(t) => t("button.callContainer")}</Translation>,
        okText: <Translation>{(t) => t("button.submit")}</Translation>
        // footer: null
    },
    emitter: async (payload) => {
        const { setModalVisible } = payload
        setModalVisible(true)
    },
    onSubmit: (ref: any, payload) => {
        // const { setModalVisible } = payload
        // setModalVisible(false)
        return ref.current?.onSave()
    }
}

export default callBin

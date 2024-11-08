// import IntlMessages from '@/@jumbo/utils/IntlMessages';
import type { TabAction } from "@/pages/wms/station/tab-actions/types"
import { TabActionModalType } from "@/pages/wms/station/tab-actions/types"
import React from "react"
import { Translation } from "react-i18next"
import { CustomActionType } from "@/pages/wms/station/instances/replenish/customActionType"

const unBoxConfig: TabAction = {
    name: <Translation>{(t) => t("button.normalPutAway")}</Translation>,
    key: "unBoxing",
    modalType: TabActionModalType.CONFIRM,
    modalConfig: {
        title: <Translation>{(t) => t("modal.confirmNormalMode")}</Translation>
    },
    testid: "normalPutAway",
    hide: (workStationEvent: any) => {
        const processingType = workStationEvent?.processingType
        // 初始undefined时hide
        return !processingType || processingType === "NORMAL"
    },
    position: "right",
    icon: "",
    permissions: [10210],
    emitter: async (props) => {
        const { onCustomActionDispatch } = props
        await onCustomActionDispatch({
            eventCode: CustomActionType.INBOUND_SWITCH_TYPE,
            data: {
                inboundSwitchType: "NORMAL"
            }
        })
    }
}

export default unBoxConfig

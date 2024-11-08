// import IntlMessages from '@/@jumbo/utils/IntlMessages';
import type { TabAction } from "@/pages/wms/station/tab-actions/types"
import { TabActionModalType } from "@/pages/wms/station/tab-actions/types"
import React from "react"
import { Translation } from "react-i18next"
import { CustomActionType } from "@/pages/wms/station/instances/replenish/customActionType"

const wholeBoxConfig: TabAction = {
    name: <Translation>{(t) => t("button.wholeBox")}</Translation>,
    key: "wholeBox",
    modalType: TabActionModalType.CONFIRM,
    modalConfig: {
        title: <Translation>{(t) => t("modal.confirmWholeBox")}</Translation>
    },
    testid: "wholeBox",
    hide: (workStationEvent: any) => {
        // 初始undefined时hide
        return workStationEvent?.processingType === "WHOLE_BOX"
    },
    position: "right",
    icon: "",
    permissions: [10210],
    emitter: async (props) => {
        const { onCustomActionDispatch } = props
        await onCustomActionDispatch({
            eventCode: CustomActionType.INBOUND_SWITCH_TYPE,
            data: {
                inboundSwitchType: "WHOLE_BOX"
            }
        })
    }
}

export default wholeBoxConfig

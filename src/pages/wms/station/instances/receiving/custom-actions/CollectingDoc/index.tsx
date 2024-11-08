import type { TabAction } from "@/pages/wms/station/tab-actions/types"
import { TabActionModalType } from "@/pages/wms/station/tab-actions/types"

import Content from "./Content"
import React from "react"
import { Translation } from "react-i18next"
import { CustomActionType } from "@/pages/wms/station/instances/replenish/customActionType"

const taskConfig: TabAction = {
    name: <Translation>{(t) => t("button.takeOrder")}</Translation>,
    key: "collectingDoc",
    modalType: TabActionModalType.FULL_SCREEN,
    icon: "",
    permissions: [10209],
    testid: "takeOrders",
    content: (props: any) => {
        return <Content {...props} />
    },
    modalConfig: {
        // title: <IntlMessages id="workstaion.common.action.collectingDoc" />,
        // okText: <IntlMessages id="workstaion.common.action.collectingDoc" />,
        title: <Translation>{(t) => t("button.takeOrder")}</Translation>,
        okText: <Translation>{(t) => t("button.takeOrder")}</Translation>
        // footer: null
    },
    emitter: async (payload: any) => {
        const { setModalVisible } = payload
        setModalVisible(true)
    },
    onSubmit: async (refs: any, payload: any) => {
        // return ref.current?.onSave()
        const { dataSource = [], onCustomActionDispatch } = refs?.current || {}
        if (dataSource.length === 0) return false
        const submitOrderIds = dataSource.map((item: any) => item.id)
        const { code, msg } = await onCustomActionDispatch({
            eventCode: CustomActionType.RECEIVE_RECEIPT,
            data: {
                ids: submitOrderIds
            }
        })

        return code !== "-1"
    }
}
export default taskConfig

import { Button, Form, Input, Space, Table } from "antd"
import type { InputRef } from "antd"
import React, { useEffect, useImperativeHandle, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import type { ColumnsType } from "antd/es/table"
import { useDebounceFn } from "ahooks"
import { DEBOUNCE_TIME } from "@/pages/wms/station/constant"
import request from "@/utils/requestInterceptor"
import { MessageType } from "@/pages/wms/station/widgets/message"
import { CustomActionType } from "@/pages/wms/station/instances/replenish/customActionType"

let warehouseCode = localStorage.getItem("warehouseCode")

const Content = (props: any) => {
    const { t } = useTranslation()
    const { refs, onCustomActionDispatch, message } = props
    const tableRef = useRef<any>()
    const [dataSource, setDataSource] = useState<Record<string, any>[]>([])

    useImperativeHandle(refs, () => ({
        onCustomActionDispatch,
        dataSource
    }))

    useEffect(() => {}, [])

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                "selectedRows: ",
                selectedRows
            )
        },
        getCheckboxProps: (record: any) => ({
            // disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.id
        })
    }

    const columns: ColumnsType = [
        {
            title: t("workLocationArea.serialNumber"),
            dataIndex: "index",
            fixed: "left",
            key: "index",
            width: 70,
            render: (dom, record, index) => {
                console.log("序号", dom, record, index)
                return `${index + 1}`
            }
        },
        {
            dataIndex: "customerOrderNo",
            key: "customerOrderNo",
            title: "盘点单号"
        },
        {
            dataIndex: "lpnCode",
            key: "lpnCode",
            title: "盘点类型"
        },
        {
            dataIndex: "inboundPlanOrderStatus",
            key: "inboundPlanOrderStatus",
            title: "盘点单状态"
        },
        {
            dataIndex: "inboundOrderType",
            key: "inboundOrderType",
            title: "容器数"
        },
        {
            dataIndex: "warehouseCode",
            key: "warehouseCode",
            title: "创建时间"
        },
        {
            dataIndex: "ownerCode",
            key: "ownerCode",
            title: "创建人"
        }
    ]

    return (
        <div className="d-flex overflow-auto">
            <Table
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection
                }}
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                sticky
                size="middle"
            />
        </div>
    )
}

export default Content

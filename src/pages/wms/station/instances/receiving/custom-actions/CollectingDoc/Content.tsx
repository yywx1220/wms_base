import {Button, Form, Input, Space, Table} from "antd"
import type {InputRef} from "antd"
import React, {useEffect, useImperativeHandle, useRef, useState} from "react"
import {useTranslation} from "react-i18next"
import type {ColumnsType} from "antd/es/table"
import request from "@/utils/requestInterceptor"
import {MessageType} from "@/pages/wms/station/widgets/message"

let warehouseCode = localStorage.getItem("warehouseCode")

const Content = (props: any) => {
    const {t} = useTranslation()
    const {refs, onCustomActionDispatch, message} = props
    const tableRef = useRef<any>()
    const [dataSource, setDataSource] = useState<Record<string, any>[]>([])
    const [orderNo, setOrderNo] = useState<string>("")
    const inputRef = useRef<InputRef>(null)

    useImperativeHandle(refs, () => ({
        onCustomActionDispatch,
        dataSource
    }))

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

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
            title: t("table.customerOrderNo")
        },
        {
            dataIndex: "lpnCode",
            key: "lpnCode",
            title: t("table.LPNNo")
        },
        {
            dataIndex: "inboundOrderType",
            key: "inboundOrderType",
            title: t("table.inboundOrderType")
        },
        {
            dataIndex: "warehouseCode",
            key: "warehouseCode",
            title: t("table.warehouse")
        },
        // {
        //     dataIndex: "ownerCode",
        //     key: "ownerCode",
        //     title: t("table.productOwner")
        // },
        {
            dataIndex: "inboundPlanOrderStatus",
            key: "inboundPlanOrderStatus",
            title: t("table.status")
        },
        {
            dataIndex: "option",
            key: "option",
            title: t("table.operation"),
            fixed: "right",
            width: 120,
            render: (dom, record) => [
                <Button
                    key="delete"
                    type="text"
                    style={{color: "#F5222D"}}
                    onClick={() => {
                        onDelete(record)
                    }}
                >
                    {t("button.delete")}
                </Button>
            ]
        }
    ]

    const onDelete = (record: any) => {
        const newData = dataSource.filter((item) => item.id !== record.id)
        setDataSource(newData)
    }

    const onSearch = async (val: any) => {
        const newValue = encodeURIComponent(val.trim())
        if (!newValue) return
        const res: any = await request({
            method: "get",
            url: `/wms/replenish/orders?warehouseCode=${warehouseCode}&identifyNo=${newValue}`
        })
        setOrderNo("")
        const {code, data} = res?.data || {}
        if (Number(code) === 0) {
            if (
                dataSource.some(
                    (item: any) =>
                        item.customerOrderNo === data?.customerOrderNo
                )
            ) {
                message?.({
                    type: MessageType.ERROR,
                    // content: t("toast.orderHasBeenTaken")
                    content: t("toast.inboundOrderHasBeenTaken")
                })
                return
            }
            setDataSource([...dataSource, {...data}])
        }
    }

    const handleOrderChange = (e: any) => {
        setOrderNo(e.target.value)
    }

    return (
        <div className="d-flex flex-col">
            <Form layout="vertical">
                <Form.Item label={t("table.LPNNo")}>
                    <Input.Search
                        allowClear
                        autoFocus
                        ref={inputRef}
                        value={orderNo}
                        onChange={handleOrderChange}
                        onSearch={onSearch}
                        style={{width: "450px"}}
                        data-testid="inboundOrder"
                    />
                </Form.Item>
            </Form>
            <div className="flex-1 overflow-auto">
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    sticky
                    size="middle"
                />
            </div>
        </div>
    )
}

export default Content

import React from "react"
import { useTranslation } from "react-i18next"

import { Button, Table } from "antd"
import type { ColumnsType } from "antd/es/table"

import { CustomActionType } from "@/pages/wms/station/instances/replenish/customActionType"

const RecommendTable = ({
    selectMode,
    recommendSkuInfos,
    onCustomActionDispatch
}: any) => {
    const { t } = useTranslation()

    const defaultColumns: ColumnsType<any> = [
        {
            title: t("skuArea.barcode"),
            dataIndex: "barcodes",
            key: "barcodes",
            render: (text, record) => {
                return text?.map((item: string) => {
                    return <div>{item}</div>
                })
            }
        },
        {
            title: t("skuArea.skuCode"),
            dataIndex: "skuCode",
            key: "skuCode"
        },
        Table.EXPAND_COLUMN,
        {
            title: t("skuArea.productName"),
            dataIndex: "skuName",
            key: "skuName",
            ellipsis: true
        }
    ]

    const customColumns: ColumnsType<any> = selectMode
        ? [
              {
                  title: t("table.unreceivedQuantity"),
                  dataIndex: "unReceiveQty",
                  key: "unReceiveQty",
                  align: "right"
              },
              {
                  title: t("table.LPNNo"),
                  dataIndex: "lpnCodes",
                  key: "lpnCodes",
                  ellipsis: true,
                  render: (text: string[], record: any) => {
                      return text?.map((item: string) => {
                          return <div>{item}</div>
                      })
                  }
              }
          ]
        : [
              {
                  title: t("table.operation"),
                  dataIndex: "operation",
                  key: "operation",
                  width: 240,
                  render: (dom: string[], record: any) => [
                      <Button
                          onClick={() => {
                              callSameSkuContainer(record)
                          }}
                      >
                          {t("skuArea.callTheSameContainer")}
                      </Button>
                  ]
              }
          ]

    const columns: ColumnsType<any> = [...defaultColumns, ...customColumns]

    const callSameSkuContainer = async (record: any) => {
        await onCustomActionDispatch({
            eventCode: CustomActionType.SAME_SKU_RE_CALL_CONTAINER,
            data: record.skuId
        })
    }

    return (
        <div className="flex-1 relative">
            <div
                className="absolute inset-0 overflow-auto"
                style={{ bottom: 56 }}
            >
                <Table
                    columns={columns}
                    dataSource={recommendSkuInfos}
                    expandable={{
                        expandedRowRender: (record) => (
                            <p style={{ margin: 0 }}>{record.skuName}</p>
                        ),
                        rowExpandable: (record) => record.skuName.length > 20
                    }}
                    rowKey={(record) => record.skuId}
                    pagination={false}
                    size="small"
                    onRow={(record) => {
                        return {
                            style: {
                                backgroundColor: record.sameSku ? "#eceef8" : ""
                            }
                        }
                    }}
                    style={{ overflow: "auto" }}
                />
            </div>
        </div>
    )
}
export default RecommendTable

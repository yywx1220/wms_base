import React from "react"
import { Translation } from "react-i18next"

import { Select, Card, Table, Input } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import { placeholderImage } from "@/pages/wms/station/widgets/common/SkuInfo"

const columns = (specSlotOptions: any[]): ColumnsType => {
    return [
        {
            // title: t("table.containerNumber"),
            title: (
                <Translation>{(t) => t("table.containerNumber")}</Translation>
            ),
            key: "containerCode",
            dataIndex: "containerCode",
            fixed: "left"
        },
        {
            dataIndex: "containerFace",
            key: "containerFace",
            // title: t("workLocationArea.face")
            title: (
                <Translation>{(t) => t("workLocationArea.face")}</Translation>
            )
        },

        {
            dataIndex: "containerSlotCode",
            key: "containerSlotCode",
            // title: t("table.containerSlotCode")
            title: (
                <Translation>{(t) => t("table.containerSlotCode")}</Translation>
            )
        },
        {
            dataIndex: "slotSpecCode",
            key: "slotSpecCode",
            // title: t("workLocationArea.gridSpecifications"),
            title: (
                <Translation>
                    {(t) => t("workLocationArea.gridSpecifications")}
                </Translation>
            ),
            render: (text: any) => {
                return specSlotOptions.find((item) => item.value === text)
                    ?.label
            }
        },
        {
            dataIndex: "stockQty",
            key: "stockQty",
            // title: t("table.inventoryQuantity")
            title: (
                <Translation>{(t) => t("table.inventoryQuantity")}</Translation>
            )
        },
        {
            dataIndex: "lockedQty",
            key: "lockedQty",
            // title: t("table.lockQuantity")
            title: <Translation>{(t) => t("table.lockQuantity")}</Translation>
        },
        {
            dataIndex: "totalTask",
            key: "totalTask",
            // title: t("table.unexecutedTasks")
            title: (
                <Translation>{(t) => t("table.unexecutedTasks")}</Translation>
            )
        },
        Table.SELECTION_COLUMN
    ]
}

const SkuCard = ({
    card,
    style,
    selectMode,
    specSlotOptions,
    onselectionchange,
    onSlotSpecCodeChange
}: any) => {
    return (
        <Card style={style}>
            {/* {allCardList.length > MAX_CARD_NUMBER ? (
                            <CloseOutlined
                                style={{
                                    position: "absolute",
                                    right: -5,
                                    top: -5,
                                    cursor: "pointer"
                                }}
                                onClick={() => onDelete(card.skuId)}
                            />
                        ) : null} */}
            <div className="d-flex text-xl">
                <div className="d-flex flex-col items-center w-48 pr-6 ">
                    {card.barcodes?.map((item: string) => (
                        <div>{item}</div>
                    ))}
                    <img
                        src={card.imageUrl || placeholderImage}
                        alt=""
                        style={{ width: 100, height: 120 }}
                    />
                </div>
                <div className="flex-1">
                    <div>
                        <span>{card.skuName}</span>
                        <span className="ml-10">{card.ownerCode}</span>
                    </div>
                    <div
                        style={{
                            border: "1px solid #8c8c8c"
                        }}
                    >
                        <Table
                            rowSelection={{
                                type: "checkbox",
                                selectedRowKeys: card.selectedRowKeys,
                                onChange: (selectedRowKeys, selectedRows) => {
                                    onselectionchange(
                                        selectedRowKeys,
                                        selectedRows,
                                        card.skuId
                                    )
                                },
                                getCheckboxProps: (record: any) => {
                                    let checkboxProps = {}
                                    checkboxProps["data-testid"] =
                                        "table-checkbox"

                                    return checkboxProps
                                }
                            }}
                            rowKey={(record: any) => record.stockId}
                            columns={columns(specSlotOptions)}
                            dataSource={card.details}
                            pagination={false}
                            size="small"
                            footer={() => (
                                <>
                                    <span className="text-red-500">
                                        New Location
                                    </span>
                                    <Select
                                        style={{
                                            width: 400,
                                            marginLeft: 10
                                        }}
                                        onChange={(value) =>
                                            onSlotSpecCodeChange(
                                                value,
                                                card.skuId
                                            )
                                        }
                                        allowClear
                                        value={card.slotSpecCode}
                                        options={specSlotOptions}
                                        getPopupContainer={(e) => e.parentNode}
                                        data-testid="slotSpecCode"
                                    />
                                </>
                            )}
                            id="callContainerTable"
                        />
                    </div>
                </div>
                {selectMode ? (
                    <div className="text-2xl pl-4 w-28 text-center font-semibold">
                        {card.inboundQty}
                    </div>
                ) : null}
            </div>
        </Card>
    )
}

export default SkuCard

import { Card, Button, Col, Row } from "antd"
import React from "react"
import type { OperationProps } from "@/pages/wms/station/instances/types"
import { ArrowRightOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"
import BatchChoiceSvg from "@/icon/fontIcons/batch-choice-block.svg"
import Request from "@/pages/wms/station/instances/stocktake/operations/components/Request"
interface Iprops {
    onClick: (mode: string, component: any) => void
    modeList: any[]
    batchList: any[]
}

const SelectCreateMode = ({ modeList, batchList, onClick }: Iprops) => {
    const { t } = useTranslation()
    return (
        <div className="d-flex flex-col justify-center items-center h-full">
            <div className="w-1/2">
                <h5 className="pb-10">
                    {t("inventoryCount.selectCreateMethod")}
                </h5>
                <div className="d-flex flex-row ">
                    <div className="d-flex flex-col flex-wrap gap-3 flex-1">
                        {modeList.map((item, index) => {
                            return (
                                <Button
                                    icon={item.icon}
                                    onClick={() =>
                                        onClick(item.mode, item.component)
                                    }
                                    style={{
                                        height: 80,
                                        paddingRight: 200,
                                        backgroundColor: "#f3f9fe"
                                    }}
                                >
                                    <span className="font-semibold pl-6 text-xl	">
                                        {item.mode}
                                    </span>
                                </Button>
                            )
                        })}
                    </div>
                    <div className="p-3 border ml-3 flex-1">
                        <div>
                            <BatchChoiceSvg
                                style={{ fontSize: 20, color: "#40a9ff" }}
                            />
                            <span className="font-semibold pl-6 text-xl	">
                                BATCH
                            </span>
                        </div>
                        {batchList.map((item, index) => {
                            return (
                                <Button
                                    onClick={() =>
                                        onClick(item.mode, item.component)
                                    }
                                    style={{
                                        height: 80,
                                        width: "100%",
                                        marginTop: 20,
                                        backgroundColor: "#f3f9fe"
                                    }}
                                >
                                    <span className="font-semibold pl-6 text-xl	">
                                        {item.mode}
                                    </span>
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectCreateMode

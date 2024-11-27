import { Button, Badge } from "antd"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import BatchChoiceSvg from "@/icon/fontIcons/batch-choice-block.svg"
import request from "@/utils/requestInterceptor"

let warehouseCode = localStorage.getItem("warehouseCode")

interface Iprops {
    onClick: (mode: string, component: any) => void
    modeList: any[]
    batchList: any[]
}

const columns = [
    {
        name: "id",
        label: "ID",
        hidden: true
    }
]

const SelectCreateMode = ({ modeList, batchList, onClick }: Iprops) => {
    const { t } = useTranslation()
    const [processTotal, setProcessTotal] = useState<number>(0)

    useEffect(() => {
        getOrderCount()
    }, [])

    const getOrderCount = () => {
        request({
            method: "post",
            url:
                "/search/search?page=1&perPage=10&warehouseCode-eq=" +
                warehouseCode,
            data: {
                searchIdentity: "WStocktakeTask",
                showColumns: columns,
            }
        }).then((res: any) => {
            setProcessTotal(res?.data?.total)
        })
    }
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
                        <div className="mb-4">
                            <BatchChoiceSvg
                                style={{ fontSize: 20, color: "#40a9ff" }}
                            />
                            <span className="font-semibold pl-6 text-xl	">
                                BATCH
                            </span>
                        </div>
                        {batchList.map((item, index) => {
                            return item.badge ? (
                                <div
                                    className="badge-button"
                                    style={{ marginTop: 20 }}
                                >
                                    <Badge size="default" count={processTotal}>
                                        <Button
                                            onClick={() =>
                                                onClick(
                                                    item.mode,
                                                    item.component
                                                )
                                            }
                                            style={{
                                                height: 80,
                                                width: "100%",
                                                // marginBottom: 20,
                                                backgroundColor: "#f3f9fe"
                                            }}
                                        >
                                            <span className="font-semibold pl-6 text-xl	">
                                                {item.mode}
                                            </span>
                                        </Button>
                                    </Badge>
                                </div>
                            ) : (
                                <Button
                                    onClick={() =>
                                        onClick(item.mode, item.component)
                                    }
                                    style={{
                                        height: 80,
                                        width: "95%",
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

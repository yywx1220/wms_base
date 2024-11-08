import React from "react"
import { Card, Modal, Button } from "antd"

const CardContent = (props: any) => {
    const { operationTaskDTO, skuMainDataDTO, title, onClick } = props
    return (
        <Card
            title={title}
            bordered={true}
            size="small"
            style={{ width: "100%", cursor: "pointer" }}
            headStyle={{ backgroundColor: "#dae9f8", textAlign: "center" }}
            bodyStyle={{ backgroundColor: "#ffff00", minHeight: 100 }}
            onClick={onClick}
        >
            <div className="d-flex">
                <div className="flex-1">
                    <div className="text-lg font-semibold">
                        {skuMainDataDTO?.skuBarcode?.barcodes}
                    </div>
                    <div className="text-ellipsis-line3">
                        {skuMainDataDTO?.skuName}
                    </div>
                </div>
                <div className="w-20 ml-4 d-flex flex-col justify-between">
                    <div className="text-2xl">
                        {operationTaskDTO?.operatedQty}
                    </div>
                    <div className="text-md font-semibold">
                        {operationTaskDTO?.sourceContainerSlot &&
                        operationTaskDTO?.targetContainerSlotCode
                            ? `${
                                  operationTaskDTO?.sourceContainerSlot +
                                  "→" +
                                  operationTaskDTO?.targetContainerSlotCode
                              }`
                            : ""}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default CardContent

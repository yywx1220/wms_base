import { Modal, Button } from "antd"
import React, { useState, lazy } from "react"
import type {
    WorkStationEvent,
    StationProcessingStatus
} from "@/pages/wms/station/event-loop/types"
import type { OperationProps } from "@/pages/wms/station/instances/types"
import SelectCreateMode from "./components/SelectCreateMode"
// import CreateSKUForm from "@/pages/wms/station/instances/stocktake/operations/components/CreateSKUForm"
// import CreateShelfForm from "@/pages/wms/station/instances/stocktake/operations/components/CreateShelfForm"
// import CreateLockedSKUForm from "@/pages/wms/station/instances/stocktake/operations/components/CreateLockedSKUForm"
// import Request from "@/pages/wms/station/instances/stocktake/operations/components/Request"
// import Process from "@/pages/wms/station/instances/stocktake/operations/components/Process"
import { ArrowLeftOutlined } from "@ant-design/icons"
import LockFillSvg from "@/icon/fontIcons/lock-fill.svg"
import ProcductFillSvg from "@/icon/fontIcons/product-fill.svg"
import ShelfSvg from "@/icon/fontIcons/shelf.svg"

export const valueFilter = (
    data: WorkStationEvent<any> | undefined
): string | undefined => {
    if (!data) return ""
    return data.warehouseAreaId
}
//
// 懒加载组件

const CreateSKUForm = lazy(
    () =>
        import(
            "@/pages/wms/station/instances/stocktake/operations/components/CreateSKUForm"
        )
)

const CreateShelfForm = lazy(
    () =>
        import(
            "@/pages/wms/station/instances/stocktake/operations/components/CreateShelfForm"
        )
)

const CreateLockedSKUForm = lazy(
    () =>
        import(
            "@/pages/wms/station/instances/stocktake/operations/components/CreateLockedSKUForm"
        )
)

const Request = lazy(
    () =>
        import(
            "@/pages/wms/station/instances/stocktake/operations/components/Request"
        )
)

const Process = lazy(
    () =>
        import(
            "@/pages/wms/station/instances/stocktake/operations/components/Process"
        )
)

const modeList = (props: any) => [
    {
        mode: "SKU",
        component: (
            <CreateSKUForm
                warehouseAreaId={props.value}
                onCustomActionDispatch={props.onCustomActionDispatch}
            />
        ),
        icon: <ProcductFillSvg style={{ fontSize: 20, color: "#40a9ff" }} />
    },
    {
        mode: "SHELF",
        icon: <ShelfSvg style={{ fontSize: 20, color: "#40a9ff" }} />,
        component: (
            <CreateShelfForm
                warehouseAreaId={props.value}
                onCustomActionDispatch={props.onCustomActionDispatch}
            />
        )
    },
    {
        mode: "LOCKED",
        icon: <LockFillSvg style={{ fontSize: 20, color: "#40a9ff" }} />,
        component: (
            <CreateLockedSKUForm
                warehouseAreaId={props.value}
                onCustomActionDispatch={props.onCustomActionDispatch}
            />
        )
    }
]

const CreateOrder = (props: OperationProps<any, any>) => {
    const [currentMode, setCurrentMode] = useState<any>({})
    const handleReturn = () => {
        setCurrentMode({})
    }

    const batchList = [
        {
            mode: "Process",
            component: (
                <Process
                    onCustomActionDispatch={props.onCustomActionDispatch}
                />
            ),
            badge: true
        },
        {
            mode: "Request",
            component: <Request warehouseAreaId={props.value} />
        }
    ]

    const handleClick = (mode: string, comp: any) => {
        setCurrentMode({ mode, component: comp })
    }

    return (
        <div className="h-full">
            {currentMode?.mode ? (
                <div>
                    <div className="w-full">
                        <Button
                            size="large"
                            type="link"
                            icon={<ArrowLeftOutlined />}
                            onClick={handleReturn}
                        ></Button>
                    </div>
                    {currentMode.component}
                </div>
            ) : (
                <SelectCreateMode
                    modeList={modeList(props)}
                    batchList={batchList}
                    onClick={handleClick}
                />
            )}
        </div>
    )
}

export default CreateOrder

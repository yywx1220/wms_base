// import type { ActionType } from "@ant-design/pro-table"
import React, { useImperativeHandle, useMemo, useRef, useState } from "react"
// // import { useSelector } from 'react-redux';

// import CrudTable from "@/components/CrudTable"
// import { metaRequest } from "@/routes/Template/utils/handleRequest"
// import { addExtraText } from "@/util/utils"

// import { generateTableOptions, tableRowKey } from "./meta"

const containerCodeWhenHangKey = "ksOutboundOrder_containerCodeWhenHang" // 挂单前绑定的周转容器号

const OutboundTask = (props: any) => {
    // const { refs } = props
    // const tableRef = useRef<ActionType>()
    // // const { valueEnums } = useSelector((state: any) => state.enums);
    // const valueEnums = {}
    // const [selectedTasks, setSelectedTasks] = useState<string[]>([])
    // const [searchParamsData, setSearchParamsData] = useState({})
    // const [dataParams, setDataParams] = useState({})

    // useImperativeHandle(refs, () => ({
    //     selectedTasks
    // }))

    // const tableOptions = useMemo(() => {
    //     return generateTableOptions({ valueEnums, searchParamsData })
    // }, [valueEnums, searchParamsData])

    // // 获取接口返回的下拉数据
    // const getOrderSearchParamsByTaskList = async () => {
    //     const { data = {} } = await metaRequest(
    //         "post:/outbound/getOrderSearchParamsByTaskList",
    //         {
    //             params: {
    //                 pageSize: undefined,
    //                 pageIndex: undefined,
    //                 customerGroupNoAllMatch: undefined
    //             }
    //         }
    //     )

    //     setSearchParamsData({
    //         customerGroupNo: addExtraText(data.customerGroupNo)
    //     })
    // }

    // // 获取查询数据
    // const handleRequest = async (params, sorter, filter) => {
    //     await getOrderSearchParamsByTaskList()
    //     setDataParams(params)
    //     return (tableOptions as any).request(params, sorter, filter)
    // }

    // const onDataSourceChange = (dataSource) => {
    //     if (
    //         dataParams.hasOwnProperty(containerCodeWhenHangKey) &&
    //         dataParams[containerCodeWhenHangKey]
    //     ) {
    //         const taskKeys = dataSource.map((item) => item[tableRowKey])
    //         setSelectedTasks(taskKeys)
    //     } else setSelectedTasks([])
    // }

    return (
        <div>OutboundTask</div>
        // <CrudTable
        //     {...tableOptions}
        //     scrollYOffset={-30}
        //     actionRef={tableRef}
        //     onDataSourceChange={onDataSourceChange}
        //     request={handleRequest}
        //     rowSelection={{
        //         fixed: "left",
        //         onChange: (
        //             keys: React.Key[],
        //             selectedRows: Record<string, any>[]
        //         ) => {
        //             setSelectedTasks(keys as string[])
        //         },
        //         selectedRowKeys: selectedTasks
        //     }}
        // />
    )
}

export default OutboundTask

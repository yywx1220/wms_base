import schema2component from "@/utils/schema2component"
import {
    warehouse_area_id,
    work_station
} from "@/pages/wms/constants/select_search_api_contant"
import { create_update_columns } from "@/utils/commonContants"

let warehouseCode = localStorage.getItem("warehouseCode")

const baseInfoForm = [
    {
        type: "hidden",
        name: "id"
    },
    {
        label: "${'table.workBitEncoding' | t}",
        name: "locationCode",
        type: "input-text",
        required: true
    },
    {
        label: "${'table.theTypeOfConatainerReceived' | t}",
        name: "receiveContainerType",
        type: "select",
        source: "${ContainerType}",
        required: true
    },
    {
        label: "${'workLocationArea.warehouseArea' | t}",
        name: "warehouseAreaId",
        type: "select",
        source: warehouse_area_id,
        required: true
    },
    {
        type: "hidden",
        name: "warehouseCode",
        label: "${'table.warehouseCode' | t}",
        value: warehouseCode
    }
]

const add = {
    type: "button",
    actionType: "dialog",
    icon: "fa fa-plus",
    label: "${'button.add' | t}",
    target: "role",
    dialog: {
        title: "${'button.add' | t}",
        size: "lg",
        closeOnEsc: true,
        body: {
            type: "form",
            api: "post:/wms/workLocation/createOrUpdateWorkLocation",
            body: baseInfoForm
        }
    }
}

const columns = [
    {
        name: "id",
        label: "ID",
        hidden: true
    },
    {
        name: "locationCode",
        label: "${'table.workBitEncoding' | t}"
    },
    {
        name: "receiveContainerType",
        label: "${'table.theTypeOfConatainerReceived' | t}",
        searchable: {
            type: "select",
            source: "${ContainerType}"
        }
    },
    {
        name: "warehouseAreaId",
        label: "${'workLocationArea.warehouseArea' | t}",
        type: "mapping",
        source: warehouse_area_id
    },
    {
        name: "warehouseCode",
        label: "${'table.warehouseCode' | t}",
        hidden: true
    },
    ...create_update_columns
]

const searchIdentity = "EWorkLocation"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'workBitsManagement.title' | t}",
    toolbar: [],
    initApi: "/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "role",
            api: {
                method: "POST",
                url:
                    "/search/search?page=${page}&perPage=${perPage}&createTime-op=bt&warehouseCode-op=eq&warehouseCode=" +
                    warehouseCode,
                dataType: "application/json"
            },
            defaultParams: {
                searchIdentity: searchIdentity,
                showColumns: showColumns,
                searchObject: {
                    orderBy: "update_time desc"
                }
            },
            autoFillHeight: true,
            autoGenerateFilter: {
                columnsNum: 3,
                showBtnToolbar: true
            },
            headerToolbar: [add],
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: [
                ...columns,
                {
                    type: "operation",
                    label: "${'table.operation' | t}",
                    width: 180,
                    buttons: [
                        {
                            label: "${'button.modify' | t}",
                            type: "button",
                            actionType: "dialog",
                            dialog: {
                                title: "${'button.modify' | t}",
                                size: "lg",
                                closeOnEsc: true,
                                body: {
                                    type: "form",
                                    api: "post:/wms/workLocation/createOrUpdateWorkLocation",
                                    body: baseInfoForm
                                }
                            }
                        }
                    ],
                    toggled: true
                }
            ]
        }
    ]
}

export default schema2component(schema)

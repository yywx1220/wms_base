import schema2component from "@/utils/schema2component"
import {container_spec, warehouse_area_id, warehouse_logic_code} from "@/pages/wms/constants/select_search_api_contant"
import {create_update_columns, true_false_options} from "@/utils/commonContants"

let warehouseCode = localStorage.getItem("warehouseCode")

const fromBody = [
    {
        type: "hidden",
        name: "id"
    },
    {
        type: "hidden",
        name: "version"
    },
    {
        label: "${'table.containerType' | t}",
        type: "select",
        name: "containerType",
        source: "${ContainerType}",
        required: true
    },
    {
        label: "${'workLocationArea.containerSpecification' | t}",
        type: "select",
        name: "containerSpecCode",
        initFetchOn: "data.containerType",
        source: {
            ...container_spec,
            url:
                container_spec.url +
                "&containerType-op=eq&containerType=${containerType}"
        },
        required: true
    },
    {
        label: "${'table.numberOfDigits' | t}",
        type: "input-text",
        name: "indexNumber",
        required: true
    },
    {
        label: "${'table.numberingPrefix' | t}",
        type: "input-text",
        name: "containerCodePrefix",
        required: true
    },
    {
        label: "${'table.startNumber' | t}",
        type: "input-number",
        name: "startIndex",
        required: true
    },
    {
        label: "${'table.createdNumber' | t}",
        type: "input-text",
        name: "createNumber",
        required: true
    },
    {
        type: "hidden",
        name: "warehouseCode",
        label: "${'table.warehouseCode' | t}",
        value: warehouseCode
    }
]

const form = {
    type: "form",
    api: "post:/wms/container/create",
    body: fromBody
}

const add = {
    type: "button",
    actionType: "drawer",
    icon: "fa fa-plus",
    label: "${'button.batchCreation' | t}",
    target: "ContainerTable",
    drawer: {
        size: "lg",
        title: "${'button.batchCreation' | t}",
        closeOnEsc: true,
        body: form
    }
}

const columns = [
    {
        name: "id",
        label: "ID",
        hidden: true
    },
    {
        name: "version",
        label: "Version",
        hidden: true
    },
    {
        name: "containerCode",
        label: "${'table.containerCode' | t}",
        searchable: true
    },
    {
        name: "face",
        label: "${'table.face' | t}",
        searchable: true
    },
    {
        name: "containerSlotCode",
        label: "${'table.containerSlotCode' | t}",
        searchable: true
    },
    {
        name: "containerSpecCode",
        label: "${'workLocationArea.containerSpecification' | t}",
        type: "mapping",
        source: container_spec,
        searchable: {
            type: "select",
            source: {
                ...container_spec,
                url:
                    container_spec.url +
                    "&containerType-op=il&containerType=SHELF,CONTAINER"
            }
        }
    },
    {
        name: "containerStatus",
        label: "${'table.containerStatus' | t}",
        type: "mapping",
        source: "${ContainerStatus}"
    },
    {
        name: "warehouseAreaId",
        label: "${'table.warehouseAreaName' | t}",
        type: "mapping",
        source: warehouse_area_id
    },
    {
        name: "warehouseLogicCode",
        label: "${'table.warehouseLogicName' | t}",
        type: "mapping",
        source: warehouse_logic_code
    },
    {
        name: "emptyContainer",
        label: "${'table.emptyContainers' | t}",
        type: "mapping",
        map: true_false_options,
        searchable: {
            type: "select",
            options: true_false_options
        }
    },
    {
        name: "locked",
        label: "${'table.lock' | t}",
        type: "mapping",
        map: true_false_options
    },
    {
        name: "locationCode",
        label: "${'table.locationCode' | t}",
        searchable: true
    },
    ...create_update_columns
]

const searchIdentity = "WContainer"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'containerManagement.title' | t}",
    toolbar: [],
    initApi: "/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            name: "ContainerTable",
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
            autoGenerateFilter: {
                columnsNum: 3,
                showBtnToolbar: true
            },
            bulkActions: [
                {
                    label: "${'button.batchChangeWarehouseLogic' | t}",
                    type: "button",
                    onEvent: {
                        click: {
                            actions: [
                                {
                                    actionType: "dialog",
                                    dialog: {
                                        title: "${'batchChangeWarehouseArea.title' | t}",
                                        body: {
                                            type: "form",
                                            api: "post:/wms/container/changeWarehouseLogicArea",
                                            reload: "ContainerTable",
                                            body: [
                                                {
                                                    type: "select",
                                                    label: "${'table.warehouseLogicName' | t}",
                                                    name: "warehouseLogicCode",
                                                    source: warehouse_logic_code
                                                },
                                                {
                                                    type: "hidden",
                                                    name: "containerIds",
                                                    value: "${SPLIT(ids, \",\")}"
                                                }
                                            ]
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            ],
            headerToolbar: [
                "reload",
                add,
                "bulkActions",
                {
                    type: "export-excel",
                    label: "${'button.export' | t}",
                    api: {
                        method: "POST",
                        url:
                            "/search/search?page=${1}&perPage=${100000}&createTime-op=bt&warehouseCode-op=eq&warehouseCode=" +
                            warehouseCode,
                        dataType: "application/json"
                    },
                    filename: "container"
                }
            ],
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: [
                ...columns
                // {
                //     type: "operation",
                //     label: "${'table.operation' | t}",
                //     width: 100,
                //     buttons: [],
                //     toggled: true
                // }
            ]
        }
    ]
}

export default schema2component(schema)

import schema2component from "@/utils/schema2component"
import {put_wall_spec, work_station} from "@/pages/wms/constants/select_search_api_contant"
import {create_update_columns, enable_options} from "@/utils/commonContants"

let warehouseCode = localStorage.getItem("warehouseCode")

const putWallSlotColumns = [
    {
        name: "id",
        hidden: true
    },
    {
        name: "workStationId",
        hidden: true
    },
    {
        name: "putWallId",
        hidden: true
    },
    {
        label: "${'table.putWallSlotCode' | t}",
        name: "putWallSlotCode",
        value: "${putWallSlotCode == null ? containerSlotSpecCode : putWallSlotCode}"
    },
    {
        label: "${'table.ptlTag' | t}",
        name: "ptlTag",
        type: "input-text",
        required: true
    },
    {
        label: "face",
        name: "face",
        hidden: true
    },
    {
        label: "${'table.putWallLevel' | t}",
        name: "level"
    },
    {
        label: "${'table.putWallBay' | t}",
        name: "bay"
    },
    {
        label: "locLevel",
        name: "locLevel",
        hidden: true
    },
    {
        label: "locBay",
        name: "locBay",
        hidden: true
    },
    {
        label: "${'table.enable' | t}",
        name: "enable",
        value: true,
        type: "switch"
    }];

const formApi = {
    url: "post:/wms/putWall/createOrUpdate?warehouseCode=" + warehouseCode,
    requestAdaptor: (api: any, context: any) => {
        return {
            ...api,
            data: {
                ...api.data,
                putWallSlots: api.data.putWallSlots.map((slot: any) => {
                    return {
                        ...slot,
                        workStationId: api.data.workStationId,
                        putWallCode: api.data.putWallCode,
                        putWallSlotCode: slot.putWallSlotCode ? slot.putWallSlotCode : slot.containerSlotSpecCode,
                        putWallSlotStatus: 'IDLE'
                    }
                })
            }
        }
    }
}

const formBody = [
    {
        type: "hidden",
        name: "id"
    },
    {
        type: "hidden",
        name: "version"
    },
    {
        type: "hidden",
        name: "putWallStatus",
        value: "IDLE"
    },
    {
        label: "${'table.seedingWallCoding' | t}",
        name: "putWallCode",
        type: "input-text",
        disabledOn: "${id != null}",
        required: true
    },
    {
        label: "${'table.seedingWallName' | t}",
        name: "putWallName",
        type: "input-text",
        disabledOn: "${id != null}",
        required: true
    },
    {
        label: "${'table.workstationBelongs' | t}",
        name: "workStationId",
        type: "select",
        disabledOn: "${id != null}",
        source: work_station,
        required: true
    },
    {
        label: "${'table.seedingWallSpecifications' | t}",
        name: "containerSpecId",
        type: "select",
        source: put_wall_spec,
        required: true,
        onEvent: {
            change: {
                actions: [
                    {
                        componentId: "putWallSlots",
                        actionType: "setValue",
                        args: {
                            value: "${event.data.selectedItems.containerSlotSpecs|toJson}"
                        }
                    }
                ]
            }
        }
    },
    {
        label: "${'table.seedingWallLocation' | t}",
        name: "location",
        type: "select",
        source: "${PutwallLocation}",
        required: true
    },
    {
        name: "enable",
        type: "switch",
        label: "${'table.whetherEnabled' | t}"
    },
    {
        id: "putWallSlots",
        name: "putWallSlots",
        type: "input-table",
        columnsTogglable: false,
        columns: putWallSlotColumns
    }
]

const add = {
    type: "button",
    actionType: "dialog",
    icon: "fa fa-plus",
    label: "${'button.add' | t}",
    target: "PutWallTable",
    dialog: {
        title: "${'button.add' | t}",
        size: "lg",
        body: {
            type: "form",
            api: formApi,
            body: formBody
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
        name: "version",
        label: "Version",
        hidden: true
    },
    {
        name: "workStationId",
        label: "${'table.workstationBelongs' | t}",
        type: "mapping",
        source: work_station
    },
    {
        name: "putWallCode",
        label: "${'table.seedingWallCoding' | t}",
        searchable: true
    },
    {
        name: "putWallName",
        label: "${'table.seedingWallName' | t}",
        searchable: true
    },
    {
        name: "containerSpecId",
        label: "${'table.seedingWallSpecifications' | t}",
        type: "mapping",
        source: put_wall_spec
    },
    {
        name: "enable",
        label: "${'table.enable' | t}",
        type: "mapping",
        source: "${EnableStatus}",
    },
    ...create_update_columns
]

const searchIdentity = "WPutWall"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'seedingWallManagement.title' | t}",
    toolbar: [],
    initApi: "post:/mdm/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "PutWallTable",
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
                    where: "deleted = false",
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
                    width: 100,
                    buttons: [
                        {
                            label: "${'button.modify' | t}",
                            type: "button",
                            actionType: "dialog",
                            dialog: {
                                title: "${'button.modify' | t}",
                                size: "lg",
                                body: {
                                    type: "form",
                                    api: formApi,
                                    initApi: "get:/wms/putWall/${id}",
                                    body: formBody
                                }
                            }
                        },
                        {
                            label: "${'button.delete' | t}",
                            type: "button",
                            actionType: "ajax",
                            level: "danger",
                            confirmText: "${'toast.sureDelete' | t}",
                            confirmTitle: "${'button.delete' | t}",
                            api: "delete:/wms/putWall/${id}",
                            reload: "PutWallTable"
                        }
                    ],
                    toggled: true
                }
            ]
        }
    ]
}

export default schema2component(schema)

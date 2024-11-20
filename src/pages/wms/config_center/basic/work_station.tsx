import schema2component from "@/utils/schema2component"
import {warehouse_area_id, work_location} from "@/pages/wms/constants/select_search_api_contant"
import {create_update_columns, true_false_options} from "@/utils/commonContants"

let warehouseCode = localStorage.getItem("warehouseCode")

const baseInfoForm = [
    {
        type: "hidden",
        name: "id"
    },
    {
        type: "hidden",
        name: "version"
    },
    {
        label: "${'table.workstationCoding' | t}",
        name: "stationCode",
        type: "input-text",
        required: true
    },
    {
        label: "${'table.workstationName' | t}",
        name: "stationName",
        type: "input-text",
        required: true
    },
    {
        label: "${'table.warehouseAreaBelongs' | t}",
        name: "warehouseAreaId",
        type: "select",
        source: warehouse_area_id,
        required: true
    },
    {
        label: "${'table.taskRules' | t}",
        name: "stationRuleId",
        type: "select"
    },
    {
        label: "${'table.operationalBusiness' | t}",
        name: "allowOperationTypes",
        type: "select",
        multiple: true,
        source: "${WorkStationOperationType}"
    },
    {
        label: "${'table.position' | t}",
        name: "position",
        type: "combo",
        items: [
            {
                name: "x",
                label: "x",
                type: "input-number"
            },
            {
                name: "y",
                label: "y",
                type: "input-number"
            },
            {
                name: "z",
                label: "z",
                type: "input-number"
            }
        ]
    },
    {
        type: "tabs",
        tabs: [
            {
                title: "${'table.robotWorkstations' | t}",
                body: [
                    {
                        label: "${'table.workBitEncoding' | t}",
                        name: "workLocations[0].workLocationCode",
                        type: "select",
                        source: work_location,
                        requiredOn: "${workLocations[0].enable}"
                    },
                    {
                        label: "${'table.terminalType' | t}",
                        name: "workLocations[0].terminalType",
                        type: "select",
                        source: "${TerminalType}",
                        requiredOn: "${workLocations[0].enable}"
                    },
                    {
                        label: "${'table.whetherEnabled' | t}",
                        name: "workLocations[0].enable",
                        type: "switch"
                    }
                ]
            },
            {
                title: "${'table.conveyorLines' | t}",
                body: [
                    {
                        label: "${'table.workBitEncoding' | t}",
                        name: "workLocations[1].workLocationCode",
                        type: "select",
                        source: work_location,
                        requiredOn: "${workLocations[1].enable}"
                    },
                    {
                        label: "${'table.terminalType' | t}",
                        name: "workLocations[1].terminalType",
                        type: "select",
                        source: "${TerminalType}",
                        requiredOn: "${workLocations[1].enable}"
                    },
                    {
                        label: "${'table.whetherEnabled' | t}",
                        name: "workLocations[1].enable",
                        type: "switch"
                    }
                ]
            },
            {
                title: "${'table.cacheShelves' | t}",
                body: [
                    {
                        label: "${'table.workBitEncoding' | t}",
                        name: "workLocations[2].workLocationCode}",
                        type: "select",
                        source: work_location,
                        requiredOn: "${workLocations[2].enable}"
                    },
                    {
                        label: "${'table.terminalType' | t}",
                        name: "workLocations[2].terminalType",
                        type: "select",
                        source: "${TerminalType}",
                        requiredOn: "${workLocations[2].enable}"
                    },
                    {
                        label: "${'table.whetherEnabled' | t}",
                        name: "workLocations[2].enable",
                        type: "switch"
                    },
                    {
                        name: "workLocations[2].workLocationSlots",
                        label: "${'table.workingCompartmentInformation' | t}",
                        type: "input-table",
                        addable: true,
                        editable: true,
                        columns: [
                            {
                                name: "workLocationCode",
                                type: "input-text",
                                label: "${'table.workBitEncoding' | t}"
                            },
                            {
                                name: "groupCode",
                                type: "input-text",
                                label: "${'table.groupNumber' | t}"
                            },
                            {
                                name: "slotCode",
                                type: "input-text",
                                label: "${'table.gridSlogan' | t}"
                            },
                            {
                                name: "level",
                                type: "input-number",
                                label: "${'workLocationArea.layer' | t}"
                            },
                            {
                                name: "bay",
                                type: "input-number",
                                label: "${'table.colum' | t}"
                            },
                            {
                                name: "enable",
                                type: "switch",
                                label: "${'table.whetherEnabled' | t}"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        type: "hidden",
        name: "warehouseCode",
        label: "仓库编码",
        value: warehouseCode
    }
]

const configInfoForm = [
    {
        name: "configId",
        type: "input-text",
        hidden: true
    },
    {
        name: "version",
        type: "input-text",
        hidden: true
    },
    {
        name: "workStationId",
        type: "input-text",
        value: "${id}",
        hidden: true
    },
    {
        type: "tabs",
        tabs: [
            // {
            //     "title": "入库配置",
            //     "body": [
            //
            //     ]
            // },
            {
                title: "${'table.outboundConfiguration' | t}",
                body: [
                    {
                        type: "combo",
                        name: "pickingStationConfig",
                        items: [
                            {
                                type: "switch",
                                label: "${'table.emptyContainerRecycling' | t}",
                                name: "emptyToteRecycle",
                                options: true_false_options
                            },
                            {
                                type: "switch",
                                label: "${'table.mergeBatchPicking' | t}",
                                name: "mergeBatchPicking",
                                options: true_false_options
                            },
                            {
                                type: "switch",
                                label: "${'table.validateCustomerWaveNoBeforeBound' | t}",
                                name: "validateCustomerWaveNoBeforeBound",
                                options: true_false_options
                            },
                            {
                                type: "switch",
                                label: "${'table.validateTransferContainerPicking' | t}",
                                name: "validateTransferContainerPicking",
                                options: true_false_options
                            }
                        ]
                    },
                    {
                        type: "divider"
                    },
                    {
                        type: "fieldSet",
                        title: "${'table.seedingWallDisplayOrder' | t}",
                        body: [
                            {
                                type: "combo",
                                name: "pickingStationConfig",
                                items: [
                                    {
                                        type: "select",
                                        label: "${'table.leftSeedingWall' | t}",
                                        name: "leftPutWallDisplayOrder",
                                        source: "${PutWallDisplayOrderEnum}"
                                    },
                                    {
                                        type: "select",
                                        label: "${'table.rightSeedingWall' | t}",
                                        name: "rightPutWallDisplayOrder",
                                        source: "${PutWallDisplayOrderEnum}"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: "divider"
                    },
                    {
                        type: "fieldSet",
                        title: "${'table.seedingWallGridField' | t}",
                        body: [
                            {
                                type: "combo",
                                name: "pickingStationConfig.putWallSlotFields",
                                multiple: true,
                                addable: false,
                                removable: false,
                                draggable: true,
                                items: [
                                    {
                                        type: "input-text",
                                        name: "fieldName",
                                        label: "${'table.fieldName' | t}",
                                        hidden: "true"
                                    },
                                    {
                                        type: "input-text",
                                        name: "fieldDesc",
                                        label: "${'table.fieldDescription' | t}",
                                        readOnly: "true"
                                    },
                                    {
                                        type: "switch",
                                        name: "display",
                                        label: "${'table.whetherDisplayed' | t}"
                                    },
                                    {
                                        type: "select",
                                        name: "color",
                                        label: "${'table.fieldColor' | t}",
                                        source: "${FieldColors}"
                                    },
                                    {
                                        type: "checkbox",
                                        name: "bold",
                                        label: "${'table.whetherBold' | t}"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: "divider"
                    },
                    {
                        type: "fieldSet",
                        title: "${'table.seedingWallTplConfig' | t}",
                        body: [
                            {
                                type: "combo",
                                name: "pickingStationConfig.putWallTagConfig.waitingBinding",
                                label: "${'putWallArea.bindBox' | t}",
                                items: [
                                    {
                                        type: "select",
                                        name: "color",
                                        label: "${'table.tplLightColor' | t}",
                                        source: "${PtlColorEnum}"
                                    },
                                    {
                                        type: "select",
                                        name: "mode",
                                        label: "${'table.tplLightMode' | t}",
                                        source: "${PtlModeEnum}"
                                    },
                                    {
                                        type: "select",
                                        name: "updown",
                                        label: "${'table.tplLightUpdown' | t}",
                                        source: "${PtlUpdownEnum}"
                                    }
                                ]
                            },
                            {
                                type: "combo",
                                name: "pickingStationConfig.putWallTagConfig.dispatch",
                                label: "${'putWallArea.sowing' | t}",
                                items: [
                                    {
                                        type: "select",
                                        name: "color",
                                        label: "${'table.tplLightColor' | t}",
                                        source: "${PtlColorEnum}"
                                    },
                                    {
                                        type: "select",
                                        name: "mode",
                                        label: "${'table.tplLightMode' | t}",
                                        source: "${PtlModeEnum}"
                                    },
                                    {
                                        type: "select",
                                        name: "updown",
                                        label: "${'table.tplLightUpdown' | t}",
                                        source: "${PtlUpdownEnum}"
                                    }
                                ]
                            },
                            {
                                type: "combo",
                                name: "pickingStationConfig.putWallTagConfig.waitingSeal",
                                label: "${'putWallArea.seal' | t}",
                                items: [
                                    {
                                        type: "select",
                                        name: "color",
                                        label: "${'table.tplLightColor' | t}",
                                        source: "${PtlColorEnum}"
                                    },
                                    {
                                        type: "select",
                                        name: "mode",
                                        label: "${'table.tplLightMode' | t}",
                                        source: "${PtlModeEnum}"
                                    },
                                    {
                                        type: "select",
                                        name: "updown",
                                        label: "${'table.tplLightUpdown' | t}",
                                        source: "${PtlUpdownEnum}"
                                    }
                                ]
                            },
                            {
                                type: "combo",
                                name: "pickingStationConfig.putWallTagConfig.disabled",
                                label: "${'putWallArea.disabled' | t}",
                                items: [
                                    {
                                        type: "select",
                                        name: "color",
                                        label: "${'table.tplLightColor' | t}",
                                        source: "${PtlColorEnum}"
                                    }
                                ]
                            },
                            {
                                type: "combo",
                                name: "pickingStationConfig.putWallTagConfig.selected",
                                label: "${'putWallArea.selected' | t}",
                                items: [
                                    {
                                        type: "select",
                                        name: "color",
                                        label: "${'table.tplLightColor' | t}",
                                        source: "${PtlColorEnum}"
                                    }
                                ]
                            },
                            {
                                type: "combo",
                                name: "pickingStationConfig.putWallTagConfig.optional",
                                label: "${'putWallArea.optional' | t}",
                                items: [
                                    {
                                        type: "select",
                                        name: "color",
                                        label: "${'table.tplLightColor' | t}",
                                        source: "${PtlColorEnum}"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
            // {
            //     "title": "盘点配置",
            //     "body": [
            //
            //     ]
            // },
            // {
            //     "title": "理库配置",
            //     "body": [
            //
            //     ]
            // }
        ]
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
            api: "post:/wms/workStation/createOrUpdateStation",
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
        name: "version",
        label: "Version",
        hidden: true
    },
    {
        name: "warehouseCode",
        label: "${'table.warehouseCode' | t}",
        hidden: true
    },
    {
        name: "warehouseAreaId",
        label: "${'table.warehouseAreaBelongs' | t}",
        type: "mapping",
        source: warehouse_area_id,
        searchable: {
            type: "select",
            source: warehouse_area_id
        }
    },
    {
        name: "stationCode",
        label: "${'table.workstationCoding' | t}",
        searchable: true
    },
    {
        name: "stationName",
        label: "${'table.workstationName' | t}"
    },
    {
        name: "operationType",
        label: "${'table.currentOperationType' | t}",
        type: "mapping",
        source: "${WorkStationOperationType}"
    },
    {
        name: "workStationStatus",
        label: "${'table.status' | t}",
        type: "mapping",
        source: "${WorkStationStatus}",
        searchable: {
            type: "select",
            source: "${WorkStationStatus}"
        }
    },
    {
        name: "workLocations",
        hidden: true
    },
    ...create_update_columns
]

const searchIdentity = "WWorkStation"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'workstationManagement.title' | t}",
    toolbar: [],
    initApi: "post:/mdm/config/dictionary/getAll",
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
                                closeOnOutside: true,
                                body: {
                                    type: "form",
                                    api: "post:/wms/workStation/createOrUpdateStation",
                                    initApi: "get:/wms/workStation/${id}",
                                    body: baseInfoForm
                                }
                            }
                        },
                        {
                            label: "${'table.workstationConfiguration' | t}",
                            type: "button",
                            actionType: "dialog",
                            dialog: {
                                title: "${'table.workstationConfiguration' | t}",
                                size: "lg",
                                closeOnEsc: true,
                                closeOnOutside: true,
                                body: {
                                    type: "form",
                                    api: "post:/wms/workStation/createOrUpdateStationConfig",
                                    initApi: {
                                        method: "get",
                                        url: "/wms/workStation/getStationConfig/${id}",
                                        adaptor: function (payload: any) {
                                            // 新增配置时，删除后端返回的空 workStationId，避免将上下文中获取的 workStationId 覆盖掉
                                            if (
                                                payload["workStationId"] == null
                                            ) {
                                                delete payload["workStationId"]
                                            }
                                            return payload
                                        }
                                    },
                                    body: configInfoForm
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

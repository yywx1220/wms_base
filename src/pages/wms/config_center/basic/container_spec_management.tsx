import React from "react"
import schema2component from "@/utils/schema2component"
import { volume } from "@/pages/wms/config_center/constants/form_constants"
import { Translation } from "react-i18next"
import { create_update_columns } from "@/utils/commonContants"

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
        label: "${'table.specificationCode' | t}",
        type: "input-text",
        name: "containerSpecCode",
        required: true
    },
    {
        label: "${'table.specificationName' | t}",
        type: "input-text",
        name: "containerSpecName",
        required: true
    },
    {
        label: "${'table.containerType' | t}",
        type: "select",
        name: "containerType",
        source: "${ContainerType}",
        required: true
    },
    {
        type: "hidden",
        name: "warehouseCode",
        label: "${'table.warehouseCode' | t}",
        value: warehouseCode
    },
    ...volume,
    {
        type: "input-table",
        name: "containerSlotSpecs",
        addable: true,
        editable: true,
        removable: true,
        needConfirm: false,
        columns: [
            ...volume,
            {
                name: "containerSlotSpecCode",
                label: "${'table.containerLatticeSlogan' | t}",
                type: "input-text",
                required: true
            },
            {
                name: "face",
                label: "${'table.face/wall_coding' | t}",
                type: "select",
                options: [
                    {
                        label: "F",
                        value: "F"
                    },
                    {
                        label: "B",
                        value: "B"
                    }
                ],
                required: true
            },
            {
                name: "level",
                label: "${'workLocationArea.layer' | t}",
                type: "input-text",
                required: true
            },
            {
                name: "bay",
                label: "${'table.column' | t}",
                type: "input-number",
                required: true
            },
            {
                name: "locLevel",
                label: "格口所在的层",
                type: "input-number",
                required: true
            },
            {
                name: "locBay",
                label: "格口所在的列",
                type: "input-number",
                required: true
            }
        ]
    }
]

const form = {
    type: "form",
    api: "post:/wms/basic/containerSpec/createOrUpdate",
    body: fromBody
}

const add = {
    type: "button",
    actionType: "dialog",
    icon: "fa fa-plus",
    label: "${'button.add' | t}",
    target: "role",
    dialog: {
        size: "full",
        title: "${'button.add' | t}",
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
        name: "containerSpecCode",
        label: "${'table.specificationCode' | t}",
        searchable: true
    },
    {
        name: "containerSpecName",
        label: "${'table.specificationName' | t}",
        searchable: true
    },
    {
        name: "containerType",
        label: "${'table.containerType' | t}",
        type: "mapping",
        source: "${ContainerType}",
        searchable: {
            type: "select",
            source: "${ContainerType}"
        }
    },
    {
        label: "${'table.volume' | t}(mm³)",
        name: "volume",
        tpl: "${volume} mm³"
    },
    {
        label: "${'table.length' | t}(mm)",
        name: "length",
        tpl: "${length} mm"
    },
    {
        label: "${'table.width' | t}(mm)",
        name: "width",
        tpl: "${width} mm"
    },
    {
        label: "${'table.height' | t}(mm)",
        name: "height",
        tpl: "${height} mm"
    },
    ...create_update_columns
]

const searchIdentity = "WContainerSpec"
const showColumns = columns

const schema = {
    type: "page",
    //   title: "容器规格管理",
    title: <Translation>{(t) => t("containerSpec.title")}</Translation>,
    toolbar: [],
    initApi: "post:/mdm/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "ContainerSpecTable",
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
            headerToolbar: [
                "reload",
                add,
                {
                    type: "export-excel",
                    label: "${'button.export' | t}",
                    api:
                        "post:/search/search?page=${1}&perPage=${100000}&createTime-op=bt&warehouseCode-op=eq&warehouseCode=" +
                        warehouseCode,
                    fileName: "container_spec"
                }
            ],
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
                                closeOnEsc: true,
                                closeOnOutside: true,
                                size: "xl",
                                body: {
                                    type: "form",
                                    initApi: {
                                        url: "/wms/containerSpec/${id}",
                                        method: "get"
                                    },
                                    api: "post:/wms/basic/containerSpec/createOrUpdate",
                                    controls: fromBody
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
                            api: "delete:/wms/containerSpec/${id}",
                            reload: "ContainerSpecTable"
                        }
                    ],
                    toggled: true
                }
            ]
        }
    ]
}

export default schema2component(schema)

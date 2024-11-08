import schema2component from "@/utils/schema2component"
import {
    warehouse_area_id,
    warehouse_logic_id
} from "@/pages/wms/constants/select_search_api_contant"
import {
    create_update_columns,
    enable_options,
    true_false_options
} from "@/utils/commonContants"

let warehouseCode = localStorage.getItem("warehouseCode")

const form = {
    type: "form",
    api: {
        url: "/wms/warehouseLogic/create"
    },
    body: [
        {
            type: "hidden",
            name: "id"
        },
        {
            type: "hidden",
            name: "version"
        },
        {
            label: "${'table.reservoirAreaCode' | t}",
            name: "warehouseAreaCode",
            type: "select",
            source: warehouse_area_id
        },
        {
            label: "${'table.warehouseLogicName' | t}",
            name: "warehouseLogicId",
            type: "select",
            source: warehouse_logic_id
        },
        {
            label: "${'table.roadwayCoding' | t}",
            name: "aisleCode",
            type: "input-text"
        },
        {
            label: "${'table.locationType' | t}",
            name: "locationType",
            type: "select",
            source: "${LocationType}"
        },
        {
            label: "${'table.locationCode' | t}",
            name: "locationCode",
            type: "input-text"
        },
        {
            label: "${'table.locationHeat' | t}",
            name: "heat",
            type: "input-text"
        },
        {
            label: "${'table.occupation' | t}",
            name: "occupied",
            type: "switch",
            options: true_false_options
        },
        {
            label: "${'table.remark' | t}",
            name: "remark",
            type: "input-text"
        },
        {
            label: "${'table.locationStatus' | t}",
            name: "locationStatus",
            type: "switch",
            options: enable_options
        },
        {
            label: "${'table.warehouseCode' | t}",
            name: "warehouseCode",
            type: "hidden",
            value: warehouseCode
        }
    ]
}
const add = {
    type: "button",
    actionType: "drawer",
    icon: "fa fa-plus",
    label: "${'button.add' | t}",
    target: "role",
    drawer: {
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
        name: "warehouseCode",
        label: "${'table.warehouseCode' | t}",
        hidden: true
    },
    {
        name: "warehouseAreaId",
        label: "${'table.warehouseLogicName' | t}",
        type: "mapping",
        source: warehouse_area_id,
        searchable: {
            type: "select",
            source: warehouse_area_id
        }
    },
    {
        name: "warehouseLogicId",
        label: "${'table.logicalAreaEncoding' | t}",
        type: "mapping",
        source: warehouse_logic_id,
        searchable: {
            type: "select",
            source: warehouse_logic_id
        }
    },
    {
        name: "aisleCode",
        label: "${'table.roadwayCoding' | t}",
        searchable: true
    },
    {
        name: "shelfCode",
        label: "${'table.shelfCoding' | t}",
        searchable: true
    },
    {
        name: "locationCode",
        label: "${'table.locationCode' | t}",
        searchable: true
    },
    {
        name: "locationType",
        label: "${'table.locationType' | t}",
        source: "${LocationType}"
    },
    {
        name: "heat",
        label: "${'table.locationHeat' | t}"
    },
    {
        name: "occupied",
        label: "${'table.occupation' | t}"
    },
    {
        name: "position",
        hidden: true
    },
    {
        name: "locationStatus",
        label: "${'table.locationStatus' | t}",
        type: "mapping",
        map: enable_options
    },
    ...create_update_columns
]

const searchIdentity = "WLocation"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'locationManagement.title' | t}",
    toolbar: [],
    initApi: "/mdm/dictionary/getAll",
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
                showColumns: showColumns
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
                    label: "x",
                    tpl: "<%=JSON.parse(data.position)?.x || '-'%>"
                },
                {
                    label: "y",
                    tpl: "<%=JSON.parse(data.position)?.y || '-'%>"
                },
                {
                    label: "z",
                    tpl: "<%=JSON.parse(data.position)?.z || '-'%>"
                },
                {
                    type: "operation",
                    label: "${'table.operation' | t}",
                    width: 100,
                    buttons: [
                        {
                            label: "${'button.modify' | t}",
                            type: "button",
                            actionType: "drawer",
                            drawer: {
                                title: "${'button.modify' | t}",
                                closeOnEsc: true,
                                closeOnOutside: true,
                                body: form
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

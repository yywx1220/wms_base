import schema2component from "@/utils/schema2component"
import {
    owner_code,
    warehouse_area_code
} from "@/pages/wms/constants/select_search_api_contant"

let warehouseCode = localStorage.getItem("warehouseCode")
const permissions = localStorage.getItem("permissions")?.split(",")
console.log("permissions", permissions?.includes("15230"))

const form = [
    {
        type: "hidden",
        name: "id"
    },
    {
        type: "hidden",
        name: "version"
    }
]

const columns = [
    {
        name: "id",
        label: "ID",
        hidden: true,
        dbField: "k.id"
    },
    {
        name: "version",
        label: "Version",
        hidden: true,
        dbField: "k.version"
    },
    {
        name: "skuCode",
        label: "${'skuArea.skuCode' | t}",
        dbField: "a.sku_code",
        searchable: true
    },
    {
        name: "barcode",
        label: "${'skuArea.barcode' | t}",
        dbField: "f.bar_code",
        searchable: true
    },
    {
        name: "ownerCode",
        label: "${'skuArea.ownerCode' | t}",
        dbField: "a.owner_code",
        source: owner_code,
        searchable: {
            type: "select",
            source: owner_code
        }
    },
    {
        name: "brand",
        label: "${'table.brand' | t}",
        dbField: "a.brand"
        // searchable: true
    },
    {
        name: "style",
        label: "${'table.style' | t}",
        dbField: "a.style"
        // searchable: true
    },
    {
        name: "color",
        label: "${'table.color' | t}",
        dbField: "a.color"
        // searchable: true
    },
    {
        name: "size",
        label: "${'table.size' | t}",
        dbField: "a.size"
        // searchable: true
    },
    {
        name: "skuFirstCategory",
        label: "${'table.levelOneClassification' | t}",
        dbField: "a.sku_first_category"
    },
    {
        name: "skuAttributeCategory",
        label: "${'table.first-level_attributes' | t}",
        dbField: "a.sku_attribute_category"
    },
    {
        name: "skuAttributes",
        label: "${'table.batchAttributes' | t}",
        dbField: "e.sku_attributes"
    },
    {
        name: "warehouseAreaCode",
        label: "${'workLocationArea.warehouseArea' | t}",
        dbField: "wa.warehouse_area_code",
        source: warehouse_area_code,
        searchable: {
            type: "select",
            source: warehouse_area_code
        }
    },
    {
        name: "containerCode",
        label: "${'table.containerCode' | t}",
        dbField: "k.container_code",
        searchable: true
    },
    {
        name: "containerSlotCode",
        label: "${'table.containerSlotCode' | t}",
        dbField: "k.container_slot_code"
    },
    {
        name: "totalQty",
        label: "${'table.inventoryQuantity' | t}",
        dbField: "k.total_qty"
    },
    {
        name: "availableQty",
        label: "${'table.availableQuantity' | t}",
        dbField: "k.available_qty"
    },
    {
        name: "noOutboundLockedQty",
        label: "${'table.libraryOccupancy' | t}",
        dbField: "k.no_outbound_locked_qty"
    },
    {
        name: "outboundLockedQty",
        label: "${'table.pickingOccupancy' | t}",
        dbField: "k.outbound_locked_qty"
    },
    {
        name: "frozenQty",
        label: "${'table.frozenQuantity' | t}",
        dbField: "k.frozen_qty"
    },
    {
        name: "createTime",
        label: "${'table.creationTime' | t}",
        dbField: "k.create_time",
        tpl: "${createTime/1000|date:YYYY-MM-DD HH\\:mm\\:ss}",
        searchable: {
            type: "input-date-range",
            valueFormat: "x"
        }
    },
    {
        name: "updateTime",
        label: "${'table.updated' | t}",
        dbField: "k.update_time",
        tpl: "${updateTime/1000|date:YYYY-MM-DD HH\\:mm\\:ss}"
    },
    {
        name: "warehouseCode",
        label: "${'table.warehouseCode' | t}",
        dbField: "k.warehouse_code",
        hidden: true
    }
]

const searchIdentity = "WContainerStock"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'inventoryDetails.title' | t}",
    toolbar: [],
    initApi: "/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "paramConfigTable",
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
                    tables: "w_container_stock k left join w_sku_batch_stock b on k.sku_batch_stock_id = b.id  left join w_sku_batch_attribute e on k.sku_batch_attribute_id = e.id  left join w_warehouse_area wa on b.warehouse_area_id = wa.id  left join m_sku_main_data a on e.sku_id = a.id left join m_sku_barcode_data f  on a.id = f.sku_id",
                    where: "k.total_qty > 0 and k.container_id is not null"
                }
            },
            autoFillHeight: true,
            autoGenerateFilter: {
                columnsNum: 3,
                showBtnToolbar: true
            },
            headerToolbar: [
                "reload",
                {
                    type: "export-excel",
                    label: "${'button.export' | t}",
                    api:
                        "/search/search?page=${1}&perPage=${100000}&createTime-op=bt&warehouseCode-op=eq&warehouseCode=" +
                        warehouseCode,
                    fileName: "container_stock"
                }
            ],
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: [
                ...columns,
                {
                    type: "operation",
                    label: "${'table.operation' | t}",
                    width: 130,
                    hidden:
                        !permissions?.includes("freeze") &&
                        !permissions?.includes("thaw"),
                    buttons: [
                        {
                            label: "${'button.freeze' | t}",
                            type: "button",
                            level: "link",
                            actionType: "dialog",
                            hidden: !permissions?.includes("freeze"),
                            dialog: {
                                title: "${'button.freeze' | t}",
                                size: "sm",
                                closeOnEsc: true,
                                closeOnOutside: true,
                                body: {
                                    type: "form",
                                    api: "post:/wms/containerStock/freezeContainerStock",
                                    controls: [
                                        ...form,
                                        {
                                            label: "${'table.quantity' | t}",
                                            type: "input-number",
                                            name: "qty",
                                            min: 1,
                                            max: "${availableQty}",
                                            required: true
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            label: "${'button.thaw' | t}",
                            type: "button",
                            level: "link",
                            actionType: "dialog",
                            disabledOn: "${frozenQty === 0}",
                            hidden: !permissions?.includes("thaw"),
                            dialog: {
                                title: "${'button.thaw' | t}",
                                size: "sm",
                                closeOnEsc: true,
                                closeOnOutside: true,
                                body: {
                                    type: "form",
                                    api: "post:/wms/containerStock/unfreezeContainerStock",
                                    controls: [
                                        ...form,
                                        {
                                            label: "${'table.quantity' | t}",
                                            type: "input-number",
                                            name: "qty",
                                            min: 1,
                                            max: "${frozenQty}",
                                            required: true
                                        }
                                    ]
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

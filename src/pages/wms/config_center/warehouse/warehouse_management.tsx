import schema2component from "@/utils/schema2component"
import {
    api_warehouse_add,
    api_warehouse_get,
    api_warehouse_update
} from "@/pages/wms/config_center/constants/api_constant"
import {
    create_update_columns,
    true_false_options
} from "@/utils/commonContants"
import {
    city,
    country,
    district,
    province
} from "@/pages/wms/constants/select_search_api_contant"

const form = [
    {
        type: "hidden",
        name: "id"
    },
    {
        type: "hidden",
        name: "version"
    },
    {
        label: "${'table.warehouseCode' | t}",
        type: "input-text",
        name: "warehouseCode",
        maxLength: 64,
        required: true
    },
    {
        label: "${'table.warehouseName' | t}",
        type: "input-text",
        name: "warehouseName",
        maxLength: 128,
        required: true
    },
    {
        label: "${'table.warehouseType' | t}",
        type: "select",
        name: "warehouseType",
        source: "${WarehouseType}",
        required: true
    },
    {
        label: "${'table.warehouseProperties' | t}",
        type: "select",
        name: "warehouseAttrType",
        source: "${WarehouseAttrType}",
        required: true
    },
    {
        label: "${'table.warehouseLevel' | t}",
        type: "select",
        name: "warehouseLevel",
        source: "${WarehouseLevel}",
        required: true
    },
    {
        label: "${'table.warehouseLables' | t}",
        type: "select",
        name: "warehouseLabel",
        source: "${WarehouseLabel}",
        maxLength: 64
    },
    {
        label: "${'table.mainBusiness' | t}",
        type: "select",
        name: "businessType",
        source: "${WarehouseBusinessType}",
        required: true
    },
    {
        label: "${'table.warehouseStructure' | t}",
        type: "select",
        name: "structureType",
        source: "${WarehouseStructureType}",
        required: true
    },
    {
        label: "${'table.warehouseArea' | t}",
        type: "input-number",
        name: "area",
        minimum: 0
    },
    {
        label: "${'table.WarehouseFloorHeight' | t}",
        type: "input-number",
        name: "height",
        minimum: 0
    },
    {
        label: "${'table.virtualWarehouse' | t}",
        type: "switch",
        name: "virtualWarehouse",
        value: false
    },

    // 地址信息
    {
        label: "${'table.country' | t}",
        type: "select",
        name: "addressDTO.country",
        source: country
    },
    {
        label: "${'table.province' | t}",
        type: "select",
        name: "addressDTO.province",
        initFetchOn: "data.addressDTO.country",
        source: {
            ...province,
            url: province.url + "&country-op=eq&country=${addressDTO.country}"
        }
    },
    {
        label: "${'table.city' | t}",
        type: "select",
        name: "addressDTO.city",
        initFetchOn: "data.addressDTO.province",
        source: {
            ...city,
            url:
                city.url +
                "&country-op=eq&country=${addressDTO.country}&province-op=eq&province=${addressDTO.province}"
        }
    },
    {
        label: "${'table.district/county' | t}",
        type: "select",
        name: "addressDTO.district",
        initFetchOn: "data.addressDTO.city",
        source: {
            ...district,
            url:
                district.url +
                "&country-op=eq&country=${addressDTO.country}&province-op=eq&province=${addressDTO.province}&city-op=eq&city=${addressDTO.city}"
        }
    },
    {
        label: "${'table.fullAddress' | t}",
        type: "input-text",
        name: "addressDTO.address"
    },

    // 联系方式
    {
        label: "${'table.contact' | t}",
        type: "input-text",
        name: "contactorDTO.name"
    },
    {
        label: "${'table.phoneNumber' | t}",
        type: "input-text",
        name: "contactorDTO.tel",
        validations: {
            isTelNumber: true
        }
    },
    {
        label: "${'table.email' | t}",
        type: "input-text",
        name: "contactorDTO.mail",
        validations: {
            isEmail: true
        }
    },
    {
        label: "${'table.fax' | t}",
        type: "input-text",
        name: "contactorDTO.fax",
        validations: {
            isTelNumber: true
        }
    }
]

const add = {
    type: "button",
    actionType: "drawer",
    icon: "fa fa-plus",
    label: "${'button.add' | t}",
    target: "role",
    drawer: {
        title: "${'button.add' | t}",
        closeOnEsc: true,
        body: {
            type: "form",
            api: api_warehouse_add,
            body: form
        }
    },
    reload: "role"
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
        searchable: true
    },
    {
        name: "warehouseName",
        label: "${'table.warehouseName' | t}",
        searchable: true
    },
    {
        name: "warehouseType",
        label: "${'table.warehouseType' | t}",
        type: "mapping",
        source: "${WarehouseType}",
        searchable: {
            type: "select",
            source: "${WarehouseType}"
        }
    },
    {
        name: "warehouseAttrType",
        label: "${'table.warehouseProperties' | t}",
        type: "mapping",
        source: "${WarehouseAttrType}",
        searchable: {
            type: "select",
            source: "${WarehouseAttrType}"
        }
    },
    {
        name: "warehouseLevel",
        label: "${'table.warehouseLevel' | t}",
        type: "mapping",
        source: "${WarehouseLevel}",
        searchable: {
            type: "select",
            source: "${WarehouseLevel}"
        }
    },
    {
        name: "warehouseLabel",
        label: "${'table.warehouseLables' | t}",
        type: "mapping",
        source: "${WarehouseLabel}",
        searchable: {
            type: "select",
            source: "${WarehouseLabel}"
        }
    },
    {
        name: "businessType",
        label: "${'table.mainBusiness' | t}",
        type: "mapping",
        source: "${WarehouseBusinessType}",
        searchable: {
            type: "select",
            source: "${WarehouseBusinessType}"
        }
    },
    {
        name: "structureType",
        label: "${'table.warehouseStructure' | t}",
        type: "mapping",
        source: "${WarehouseStructureType}",
        searchable: {
            type: "select",
            source: "${WarehouseStructureType}"
        }
    },
    {
        name: "virtualWarehouse",
        label: "${'table.virtualWarehouse' | t}",
        type: "mapping",
        map: true_false_options
    },
    {
        name: "country",
        label: "${'table.country' | t}"
    },
    {
        name: "province",
        label: "${'table.province' | t}"
    },
    {
        name: "city",
        label: "${'table.city' | t}"
    },
    {
        name: "district",
        label: "${'table.district/county' | t}"
    },
    {
        name: "name",
        label: "${'table.contact' | t}"
    },
    {
        name: "tel",
        label: "${'table.phoneNumber' | t}"
    },
    {
        name: "mail",
        label: "${'table.email' | t}"
    },
    {
        name: "fax",
        label: "${'table.fax' | t}"
    },
    ...create_update_columns
]

const searchIdentity = "MWarehouseMainData"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'warehouseManagement.title' | t}",
    toolbar: [],
    initApi: "/config/dictionary/getAll",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "role",
            api: {
                method: "POST",
                url: "/search/search?page=${page}&perPage=${perPage}&createTime-op=bt",
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
                    width: 150,
                    buttons: [
                        {
                            label: "${'button.modify' | t}",
                            type: "button",
                            actionType: "drawer",
                            drawer: {
                                title: "${'button.modify' | t}",
                                closeOnEsc: true,
                                closeOnOutside: true,
                                body: {
                                    type: "form",
                                    initApi: api_warehouse_get,
                                    api: api_warehouse_update,
                                    body: form
                                }
                            },
                            reload: "role"
                        },
                        {
                            label: "${'button.parameterConfiguration' | t}",
                            type: "button",
                            actionType: "drawer",
                            drawer: {
                                title: "${'button.modify' | t}",
                                closeOnEsc: true,
                                closeOnOutside: true,
                                body: {
                                    type: "form",
                                    initApi:
                                        "get:/wms/warehouseConfig/${warehouseCode}",
                                    api: "post:/wms/warehouseConfig/createOrUpdate",
                                    body: form
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

import schema2component from "@/utils/schema2component"
import {
    api_owner_add,
    api_owner_get,
    api_owner_update
} from "@/pages/wms/config_center/constants/api_constant"
import { create_update_columns } from "@/utils/commonContants"
import {
    city,
    country,
    district,
    province
} from "@/pages/wms/constants/select_search_api_contant"

let warehouseCode = localStorage.getItem("warehouseCode")

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
        label: "${'skuArea.ownerCode' | t}",
        type: "input-text",
        name: "ownerCode",
        required: true
    },
    {
        label: "${'table.ownerName' | t}",
        type: "input-text",
        name: "ownerName",
        required: true
    },
    {
        label: "${'table.ownerType' | t}",
        type: "select",
        name: "ownerType",
        source: "${OwnerType}",
        required: true
    },
    {
        label: "${'table.warehouseCode' | t}",
        name: "warehouseCode",
        type: "hidden",
        value: warehouseCode
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
            api: api_owner_add,
            body: form
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
        name: "ownerCode",
        label: "${'skuArea.ownerCode' | t}",
        searchable: true
    },
    {
        name: "ownerName",
        label: "${'table.ownerName' | t}",
        searchable: true
    },
    {
        name: "ownerType",
        label: "${'table.ownerType' | t}",
        type: "mapping",
        source: "${OwnerType}",
        searchable: {
            type: "select",
            source: "${OwnerType}"
        }
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

const searchIdentity = "MOwnerMainData"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'shipperManagement.title' | t}",
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
                                body: {
                                    type: "form",
                                    initApi: api_owner_get,
                                    api: api_owner_update,
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

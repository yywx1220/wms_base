import {
    city,
    country,
    district,
    province
} from "@/pages/wms/constants/select_search_api_contant"

export const contactor = [
    {
        label: "${'table.contact' | t}",
        type: "input-text",
        name: "name"
    },
    {
        label: "${'table.phoneNumber' | t}",
        type: "input-text",
        validations: {
            isTelNumber: true
        },
        name: "tel"
    },
    {
        label: "${'table.email' | t}",
        type: "input-text",
        validations: {
            isEmail: true
        },
        name: "mail"
    },
    {
        label: "${'table.fax' | t}",
        type: "input-text",
        validations: {
            isTelNumber: true
        },
        name: "fax"
    }
]

export const address = [
    {
        label: "${'table.country' | t}",
        type: "select",
        name: "country",
        source: country
    },
    {
        label: "${'table.province' | t}",
        type: "select",
        name: "province",
        initFetchOn: "data.country",
        source: {
            ...province,
            url: province.url + "&country-op=eq&country=${country}"
        }
    },
    {
        label: "${'table.city' | t}",
        type: "select",
        name: "city",
        initFetchOn: "data.province",
        source: {
            ...city,
            url:
                city.url +
                "&country-op=eq&country=${country}&province-op=eq&province=${province}"
        }
    },
    {
        label: "${'table.district/county' | t}",
        type: "select",
        name: "district",
        initFetchOn: "data.city",
        source: {
            ...district,
            url:
                district.url +
                "&country-op=eq&country=${country}&province-op=eq&province=${province}&city-op=eq&city=${city}"
        }
    },
    {
        label: "${'table.fullAddress' | t}",
        type: "input-text",
        name: "address"
    }
]

export const volume = [
    {
        label: "${'table.volume' | t}(mm³)",
        type: "input-number",
        name: "volume"
        // description: "mm³"
    },
    {
        label: "${'table.length' | t}(mm)",
        type: "input-number",
        name: "length"
        // description: "mm"
    },
    {
        label: "${'table.width' | t}(mm)",
        type: "input-number",
        name: "width"
        // description: "mm"
    },
    {
        label: "${'table.height' | t}(mm)",
        type: "input-number",
        name: "height"
        // description: "mm"
    }
]

export const weight = [
    {
        label: "${'table.grossWeight' | t}",
        type: "input-number",
        name: "grossWeight"
    },
    {
        label: "${'table.netWeight' | t}",
        type: "input-number",
        name: "netWeight"
    }
]

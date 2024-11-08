import schema2component from "@/utils/schema2component"
import { role_search_api } from "@/pages/user/constants/select_search_api_constant"
import {
    api_user_add,
    api_user_delete,
    api_user_get,
    api_user_reset_password,
    api_user_update
} from "@/pages/user/constants/api_constant"
import { create_update_columns, yes_no_options } from "@/utils/commonContants"

const form = [
    {
        type: "hidden",
        name: "id"
    },
    {
        label: "${'userCenter.userManagement.table.loginUsername' | t}",
        type: "input-text",
        name: "account",
        required: true
    },
    {
        label: "${'userCenter.userManagement.table.name' | t}",
        type: "input-text",
        name: "name",
        required: true
    },
    {
        label: "${'userCenter.userManagement.form.role' | t}",
        type: "select",
        name: "roleIds",
        multiple: true,
        source: role_search_api,
        required: true
    },
    // {
    //     "label": "密码",
    //     "type": "input-password",
    //     "name": "password",
    //     "required": true
    // },
    {
        label: "${'userCenter.userManagement.table.mobilePhoneNumber' | t}",
        type: "input-text",
        name: "phone",
        required: true
    },
    {
        label: "${'table.email' | t}",
        type: "input-text",
        name: "email"
    },
    {
        label: "${'table.status' | t}",
        type: "switch",
        name: "status",
        value: 1,
        trueValue: 1,
        falseValue: 0
    }
]

const add = {
    type: "button",
    actionType: "drawer",
    icon: "fa fa-plus",
    label: "${'button.add' | t}",
    target: "UserTable",
    drawer: {
        size: "lg",
        title: "${'button.add' | t}",
        closeOnEsc: true,
        body: {
            type: "form",
            api: api_user_add,
            body: form,
            reload: "UserTable"
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
        name: "name",
        label: "${'userCenter.userManagement.table.name' | t}",
        searchable: true
    },
    {
        name: "account",
        label: "${'userCenter.userManagement.table.loginUsername' | t}",
        searchable: true
    },
    {
        name: "email",
        label: "${'table.email' | t}",
        searchable: true
    },
    {
        name: "phone",
        label: "${'userCenter.userManagement.table.mobilePhoneNumber' | t}",
        searchable: true
    },
    {
        name: "status",
        label: "${'table.status' | t}",
        type: "mapping",
        map: yes_no_options
    },
    {
        name: "lastLoginIp",
        label: "${'userCenter.userManagement.table.LoginIP' | t}"
    },
    ...create_update_columns
]

const searchIdentity = "UUser"
const showColumns = columns

const schema = {
    type: "page",
    title: "${'userCenter.userManagement.title' | t}",
    toolbar: [],
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "UserTable",
            api: {
                method: "POST",
                url: "/search/search?page=${page}&perPage=${perPage}&createTime-op=bt",
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
            headerToolbar: [
                "reload",
                add,
                {
                    type: "export-excel",
                    label: "${'button.export' | t}",
                    api: {
                        method: "POST",
                        url: "/search/search?page=${1}&perPage=${100000}&createTime-op=bt"
                    },
                    fileName: "user"
                }
            ],
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: [
                ...columns,
                {
                    type: "operation",
                    label: "${'table.operation' | t}",
                    width: 200,
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
                                    initApi: api_user_get,
                                    api: api_user_update,
                                    body: form,
                                    reload: "UserTable"
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
                            api: api_user_delete
                        },
                        {
                            label: "${'button.resetPassword' | t}",
                            type: "button",
                            actionType: "ajax",
                            confirmText: "${'toast.sureResetPassword' | t}",
                            confirmTitle: "${'button.reset' | t}",
                            api: api_user_reset_password
                        }
                    ],
                    toggled: true
                }
            ]
        }
    ]
}

export default schema2component(schema)

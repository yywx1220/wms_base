import schema2component from "@/utils/schema2component"
import {
    api_plugin_config,
    api_plugin_install,
    api_plugin_tenant_config,
    api_plugin_uninstall
} from "@/pages/plugin/constants/api_constant"
import { Translation } from "react-i18next"
import React from "react"

const configForm = {
    type: "form",
    api: api_plugin_config,
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
            label: "插件配置",
            type: "textarea",
            name: "configInfo",
            required: true
        }
    ]
}

const schema = {
    type: "page",
    title: "${'pluginSystem.pluginStore.title' | t}",
    toolbar: [],
    initApi: "/plugin/pluginManage/storeQuery",
    body: {
        type: "cards",
        source: "$pluginStore",
        card: {
            body: [
                {
                    hidden: true,
                    label: "插件id",
                    name: "id"
                },
                {
                    hidden: true,
                    label: "${'pluginSystem.pluginManagement.table.pluginCoding' | t}",
                    name: "code"
                },
                {
                    label: (
                        <Translation>
                            {(t) =>
                                t(
                                    "pluginSystem.pluginManagement.table.pluginName"
                                )
                            }
                        </Translation>
                    ),
                    name: "name"
                },
                {
                    label: (
                        <Translation>
                            {(t) =>
                                t(
                                    "pluginSystem.pluginManagement.table.developers"
                                )
                            }
                        </Translation>
                    ),
                    name: "developer"
                },
                {
                    label: (
                        <Translation>
                            {(t) =>
                                t(
                                    "pluginSystem.pluginManagement.table.pluginVersion"
                                )
                            }
                        </Translation>
                    ),
                    name: "pluginVersion"
                }
            ],
            actions: [
                {
                    label: "${'pluginSystem.pluginStore.table.installation' | t}",
                    type: "button",
                    level: "link",
                    icon: "arrow-down",
                    actionType: "ajax",
                    confirmText: "确认安装？",
                    api: api_plugin_install
                },
                {
                    label: "${'pluginSystem.pluginStore.table.unload' | t}",
                    type: "button",
                    level: "link",
                    icon: "arrow-up",
                    actionType: "ajax",
                    confirmText: "确认卸载？",
                    api: api_plugin_uninstall
                },
                {
                    label: "${'pluginSystem.pluginStore.table.parameterSettings' | t}",
                    type: "button",
                    level: "link",
                    icon: "arrow-up",
                    actionType: "drawer",
                    drawer: {
                        title: "${'button.modify' | t}",
                        body: {
                            type: "form",
                            initApi: api_plugin_tenant_config,
                            api: api_plugin_config,
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
                                    label: "${'pluginSystem.pluginStore.table.pluginConfiguration' | t}",
                                    type: "textarea",
                                    name: "configInfo",
                                    required: true
                                }
                            ]
                        }
                    }
                }
            ]
        }
    }
}

export default schema2component(schema)

export const international_app_code = {
    "method": "post",
    "url": "/search/search/searchSelectResult?perPage=1000&activePage=1",
    "data": {
        "searchIdentity": "SearchInternationalApp",
        "searchObject": {
            "tables": "i_international_app"
        },
        "showColumns": [
            {
                "dbField": "app_code",
                "name": "value",
                "javaType": "java.lang.String"
            },
            {
                "dbField": "app_name",
                "name": "label",
                "javaType": "java.lang.String"
            }
        ]
    }
}

export const international_app_language_item_mapping = {
    "method": "post",
    "url": "/search/search/searchSelectResult?perPage=1000&activePage=1&app_code=${appCode}&app_code-op=eq",
    "data": {
        "searchIdentity": "SearchInternationalAppLanguageItemMapping",
        "searchObject": {
            "tables": "i_international_app"
        },
        "showColumns": [
            {
                "dbField": "app_code",
                "name": "app_code",
                "javaType": "java.lang.String"
            },
            {
                "dbField": "language_item_mappings",
                "name": "controls",
                "javaType": "java.lang.String"
            }
        ]
    },
    /**
     * {
     *     "options": [
     *         {
     *             "app_code": "wms",
     *             "controls": "[{\"language\": \"zh_CN\", \"description\": \"简体中文\"}, {\"language\": \"en_US\", \"description\": \"English\"}, {\"language\": \"fr_FR\", \"description\": \"Français\"}]"
     *         }
     *     ]
     * }
     * 下面的代码是把上面的接口返回数据转换成表单的动态输入域；
     * 并追加一个 languages 的字段，这个数组表示当前正在操作的 App 支持的语言的列表
     */
    "adaptor": `const app = payload.options[0];
                const controls = JSON.parse(app.controls);
                const fields = controls.map(item => {
                                 return {
                                    type: "input-text",
                                    name: item.language,
                                    label: item.description
                                 }});
                const languages = controls.map(item => item.language);
                return {
                    ...payload,
                    controls: [
                        ...fields,
                        {
                            type: "input-text",
                            name: "languages",
                            value: languages,
                            hidden: true
                        }
                    ]
                }`
}
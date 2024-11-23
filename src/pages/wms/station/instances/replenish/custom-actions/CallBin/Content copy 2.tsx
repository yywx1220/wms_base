import React from "react"
import { Translation } from "react-i18next"
import { debounce, method } from "lodash"

import schema2component from "@/utils/schema2component"
import { container_spec } from "@/pages/wms/constants/select_search_api_contant"
import { CustomActionType } from "@/pages/wms/station/instances/replenish/customActionType"
import { DEBOUNCE_TIME } from "@/pages/wms/station/constant"

let warehouseCode = localStorage.getItem("warehouseCode")

const schema = {
    type: "page",
    // initApi: "/station/inbound/callContainer",
    initApi: {
        method: "post",
        url: "/station/inbound/callContainer",
        data: { warehouseCode }
    },
    id: "pageData",
    data: {
        warehouseCode: "", //仓库代码
        ownerCode: "", //货主编码
        containerSpecCode: [
            //容器规格代码
        ],
        slotSpecCode: [
            //格口规格代码（定制）
        ],
        containerAndFaces: [],
        skuIds: [
            //商品ID
            0
        ]
    },

    // className: "bg-gray-100",
    body: [
        {
            name: "barCode",
            type: "input-text",
            label: "skuArea.scanBarcode",
            autoFocus: true
        },
        {
            type: "cards",
            name: "detailCards",
            id: "cards_setvalue",
            // source: "$items",
            className: "gap-4",
            // itemClassName: "col-sm-4 mb-4 gap-2",
            columnsCount: 1,
            card: {
                useCardLabel: false,
                className: "${index % 2 === 0 ? 'bg-blue-200' : ''}",
                header: {
                    title: "${barcodes}",
                    description: "${skuName}",
                    avatarClassName: "pull-left thumb-md avatar b-3x m-r",
                    avatar: "${imageUrl}"
                },
                body: [
                    {
                        type: "divider"
                    },
                    {
                        type: "table2",
                        source: "$details",
                        id: "tableDetails",
                        rowSelection: {
                            type: "checkbox",
                            keyField: "stockId",
                            rowClick: true
                        },
                        onEvent: {
                            selectedChange: {
                                actions: [
                                    {
                                        actionType: "setValue",
                                        componentId: "pageData",
                                        args: {
                                            value: {
                                                "${skuId}":
                                                    "${UNIQ(CONCAT(containerAndFaces, ARRAYMAP(selectedItems, item => {containerCode: item.containerCode, containerFace: item.containerFace})))}"
                                            }
                                        }
                                    }
                                    // {
                                    //     actionType: "toast",
                                    //     args: {
                                    //         msg: "${data}"
                                    //     }
                                    // }
                                ]
                            }
                        },
                        rowClassNameExpr: "${index % 2 ? 'bg-success' : ''}",
                        columns: [
                            {
                                title: "库存ID",
                                name: "stockId",
                                hidden: true
                            },
                            {
                                title: "容器号",
                                name: "containerCode",
                                "en-US": {
                                    title: "Container Number"
                                }
                            },
                            {
                                title: "面",
                                name: "containerFace",
                                "en-US": {
                                    title: "Face"
                                }
                            },
                            {
                                title: "未执行的任务数",
                                name: "totalTask",
                                "en-US": {
                                    title: "Number of unexecuted tasks"
                                }
                            },
                            {
                                title: "格口编码",
                                name: "containerSlotCode",
                                "en-US": {
                                    title: "Container slot code"
                                }
                            },
                            {
                                title: "格口规格",
                                name: "slotSpecCode",
                                "en-US": {
                                    title: "Grid specifications"
                                }
                            },
                            {
                                title: "库存数量",
                                name: "stockQty",
                                "en-US": {
                                    title: "QTY Inventory"
                                }
                            },
                            {
                                title: "锁定数量",
                                name: "lockedQty",
                                "en-US": {
                                    title: "Lock quantity"
                                }
                            }
                        ]
                    },

                    {
                        mode: "horizontal",
                        name: "barCode",
                        label: "New Location",
                        type: "select",
                        clearable: true,
                        size: "lg",
                        className: "flex justify-center items-center pt-3"
                    }
                ],
                toolbar: [
                    {
                        type: "tpl",
                        tpl: "${inboundQty}",
                        className: "text-2xl font-bold"
                    }
                ]
                // actions: [
                //     {
                //         type: "button",
                //         level: "link",
                //         label: "button.chooseContainer",
                //         // icon: "fa fa-eye",
                //         actionType: "dialog",
                //         dialog: {
                //             size: "lg",
                //             title: "button.chooseContainer",
                //             body: {
                //                 type: "table2",
                //                 source: "$details",
                //                 rowSelection: {
                //                     type: "checkbox",
                //                     keyField: "stockId"
                //                     // selectedRowKeys: "all"
                //                     // selectedRowKeysExpr:
                //                     //     "data.record.details === 1"
                //                 },
                //                 columns: [
                //                     {
                //                         title: "库存ID",
                //                         name: "stockId",
                //                         hidden: true
                //                     },
                //                     {
                //                         // label: "table.containerNumber",
                //                         // title: (
                //                         //     <Translation>
                //                         //         {(t) =>
                //                         //             t("table.containerNumber")
                //                         //         }
                //                         //     </Translation>
                //                         // ),
                //                         title: "容器号",
                //                         name: "containerCode",
                //                         "en-US": {
                //                             title: "Container Number"
                //                         }
                //                     },
                //                     {
                //                         // title: "workLocationArea.face",
                //                         // title: (
                //                         //     <Translation>
                //                         //         {(t) =>
                //                         //             t("workLocationArea.face")
                //                         //         }
                //                         //     </Translation>
                //                         // ),
                //                         title: "面",
                //                         name: "containerFace",
                //                         "en-US": {
                //                             title: "Face"
                //                         }
                //                     },
                //                     {
                //                         // title: "table.containerSlotCode",
                //                         // title: (
                //                         //     <Translation>
                //                         //         {(t) =>
                //                         //             t("table.containerSlotCode")
                //                         //         }
                //                         //     </Translation>
                //                         // ),
                //                         title: "格口编码",
                //                         name: "containerSlotCode",
                //                         "en-US": {
                //                             title: "Container slot code"
                //                         }
                //                     },
                //                     {
                //                         // title: "workLocationArea.gridSpecifications",
                //                         // title: (
                //                         //     <Translation>
                //                         //         {(t) =>
                //                         //             t(
                //                         //                 "workLocationArea.gridSpecifications"
                //                         //             )
                //                         //         }
                //                         //     </Translation>
                //                         // ),
                //                         title: "格口规格",
                //                         name: "slotSpecCode",
                //                         "en-US": {
                //                             title: "Grid specifications"
                //                         }
                //                     },
                //                     {
                //                         // title: "table.inventoryQuantity",
                //                         // title: (
                //                         //     <Translation>
                //                         //         {(t) =>
                //                         //             t("table.inventoryQuantity")
                //                         //         }
                //                         //     </Translation>
                //                         // ),
                //                         title: "库存数量",
                //                         name: "stockQty",
                //                         "en-US": {
                //                             title: "QTY Inventory"
                //                         }
                //                     },
                //                     {
                //                         // title: "table.lockQuantity",
                //                         // title: (
                //                         //     <Translation>
                //                         //         {(t) => t("table.lockQuantity")}
                //                         //     </Translation>
                //                         // ),
                //                         title: "锁定数量",
                //                         name: "lockedQty",
                //                         "en-US": {
                //                             title: "Lock quantity"
                //                         }
                //                     }
                //                     // {
                //                     //     title: "Operation",
                //                     //     name: "operation",
                //                     //     type: "button",
                //                     //     label: "删除",
                //                     //     size: "sm"
                //                     // }
                //                 ]
                //             }
                //         }
                //     }
                // ]
            }
        },
        {
            type: "group",
            gap: "xs",
            className: "float-right",
            body: [
                {
                    type: "button",
                    label: "取消",
                    "en-US": {
                        label: "Cancel"
                    },
                    onClick: (e: any, props: any) => {
                        console.log("消息通知", e, props)
                        props.setModalVisible(false)
                        // props.formStore.setValues({ name: "amis" })
                    }
                },
                {
                    type: "submit",
                    label: "呼叫容器",
                    "en-US": {
                        label: "Call container"
                    },
                    level: "primary",
                    className: "callBinSubmit", // 用于测试脚本
                    onClick: debounce(
                        async (e: any, props: any) => {
                            console.log("消息通知", e, props)
                            // const { data, onCustomActionDispatch, message } =
                            //     props
                            // const { code } = await onCustomActionDispatch({
                            //     eventCode: CustomActionType.CALL_CONTAINER,
                            //     data: {
                            //         ...data,
                            //         warehouseCode:
                            //             localStorage.getItem("warehouseCode"),
                            //         warehouseArea: "Robot Area" // 客户没有分库区，暂时写死
                            //     }
                            // })

                            // if (code !== "-1") {
                            //     props.setModalVisible(false)
                            //     return
                            // }
                        },
                        DEBOUNCE_TIME,
                        { leading: false }
                    )
                }
            ]
        }
    ]
}

export default schema2component(schema)

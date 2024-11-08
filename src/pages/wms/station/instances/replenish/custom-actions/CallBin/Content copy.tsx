import React from "react"
import { Translation } from "react-i18next"
import { debounce } from "lodash"

import schema2component from "@/utils/schema2component"
import { container_spec } from "@/pages/wms/constants/select_search_api_contant"
import { CustomActionType } from "@/pages/wms/station/instances/replenish/customActionType"
import { DEBOUNCE_TIME } from "@/pages/wms/station/constant"

const schema = {
    type: "page",
    initApi: "/mdm/dictionary/getAll",
    style: {
        width: "360px"
    },
    body: [
        {
            type: "form",
            // api: "post:/wms/replenish/tasks/select/container",
            mode: "horizontal",
            title: "",
            wrapWithPanel: false,
            preventEnterSubmit: true,
            body: [
                // {
                //     name: "containerSpecCode",
                //     label: (
                //         <Translation>
                //             {(t) => t("workLocationArea.containerSpecification")}
                //         </Translation>
                //     ),
                //     type: "select",
                //     source: {
                //         ...container_spec,
                //         url:
                //             container_spec.url +
                //             "&containerType-op=il&containerType=SHELF,CONTAINER"
                //     },
                //     required: true
                // },
                {
                    name: "slotSpecCode",
                    label: (
                        <Translation>
                            {(t) => t("workLocationArea.gridSpecifications")}
                        </Translation>
                    ),
                    type: "select",
                    source: "${CallContainerSlotSpecCode}",
                    required: true
                },
                {
                    name: "emptySlotCount",
                    type: "input-number",
                    displayMode: "enhance",
                    label: (
                        <Translation>
                            {(t) => t("workLocationArea.numberOfEmptySlots")}
                        </Translation>
                    ),
                    // min: 1,
                    validations: {
                        isNumeric: true,
                        maximum: 100,
                        minimum: 1
                    },
                    validateOnChange: true,
                    // max: 100,
                    required: true
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
                            type: "reset",
                            label: "重置",
                            "en-US": {
                                label: "Reset"
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
                                    console.log(
                                        "消息通知",
                                        e,
                                        props,
                                        props.formStore.valid
                                    )
                                    if (!props.formStore.valid) {
                                        return
                                    }
                                    const {
                                        data,
                                        onCustomActionDispatch,
                                        message
                                    } = props
                                    const { code } =
                                        await onCustomActionDispatch({
                                            eventCode:
                                                CustomActionType.CALL_CONTAINER,
                                            data: {
                                                ...data,
                                                warehouseCode:
                                                    localStorage.getItem(
                                                        "warehouseCode"
                                                    ),
                                                warehouseArea: "Robot Area" // 客户没有分库区，暂时写死
                                            }
                                        })

                                    if (code !== "-1") {
                                        props.setModalVisible(false)
                                        return
                                    }
                                },
                                DEBOUNCE_TIME,
                                { leading: false }
                            )
                        }
                    ]
                }
            ]
        }
    ]
}

// function Content(props) {
//     const { resetModal, refs, setConfirmLoading, loading, workStationInfo } =
//         props
//     const [containerSpecCode, setContainerSpecCode] = useState<string>("")
//     const [containerSpecOptions, setContainerSpecOptions] = useState<any[]>([])
//     const [form] = Form.useForm()
//     useImperativeHandle(refs, () => ({ onSave: handleSave }))

//     useEffect(() => {
//         getContainerSpecCodes()
//     }, [])

//     const getContainerSpecCodes = () => {
//         request({
//             method: "get",
//             url: "/wms/containerSpec/queryAllContainerSpec"
//         }).then((res: any) => {
//             if (res.data != null && res.status === 200) {
//                 console.log("getContainerSpecCodes", res.data.data)
//                 const options = res.data.data.map((item) => ({
//                     value: item.containerSpecCode,
//                     label: item.containerSpecName
//                 }))
//                 setContainerSpecOptions(options)
//                 setContainerSpecCode(options[0].value)
//             }
//         })
//     }

//     const handleContainerSpecChange = (e: any) => {
//         setContainerSpecCode(e.target.value)
//     }

//     const onSlotCountChange = (value) => {
//         console.log("onSlotCountChange", value)
//     }

//     const handleSave = () => {
//         request({
//             method: "post",
//             url: "/wms/replenish/tasks/select/container",
//             data: params
//         }).then((res) => {
//             console.log("handleSave", res)
//         })
//     }

//     const handleReset = () => {}

//     // return (
//     //     <Form
//     //         form={form}
//     //         name="validateOnly"
//     //         layout="vertical"
//     //         autoComplete="off"
//     //     >
//     //         <Form.Item
//     //             name="containerSpecCode"
//     //             label="容器规格"
//     //             rules={[{ required: true }]}
//     //         >
//     //             <Radio.Group
//     //                 options={containerSpecOptions}
//     //                 onChange={handleContainerSpecChange}
//     //                 value={containerSpecCode}
//     //             />
//     //         </Form.Item>
//     //         <Form.Item
//     //             name="warehouseArea"
//     //             label="库区"
//     //             rules={[{ required: true }]}
//     //         >
//     //             <Input />
//     //         </Form.Item>
//     //         <Form.Item
//     //             name="emptySlotCount"
//     //             label="空格口数量"
//     //             rules={[{ required: true }]}
//     //         >
//     //             <InputNumber
//     //                 min={1}
//     //                 defaultValue={3}
//     //                 onChange={onSlotCountChange}
//     //             />
//     //         </Form.Item>
//     //         <Form.Item>
//     //             <Space>
//     //                 <Button htmlType="reset">重置</Button>
//     //                 <Button onClick={resetModal}>取消</Button>
//     //                 <Button
//     //                     type="primary"
//     //                     loading={loading}
//     //                     onClick={handleSave}
//     //                 >
//     //                     呼叫容器
//     //                 </Button>
//     //             </Space>
//     //         </Form.Item>
//     //     </Form>
//     // )
// }

export default schema2component(schema)

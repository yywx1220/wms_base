import * as React from "react"
import { Button, Checkbox, Form, Input } from "antd"
import { toast } from "amis"
import { RouteComponentProps } from "react-router-dom"
import Message, { MessageType } from "@/pages/wms/station/widgets/message"

import { IMainStore } from "@/stores"
import { inject, observer } from "mobx-react"
import { withRouter } from "react-router"
import request from "@/utils/requestInterceptor"
import "@/scss/style.scss"
import { withTranslation, Translation } from "react-i18next"
interface LoginProps extends RouteComponentProps<any> {
    store: IMainStore
}

@inject("store")
// @ts-ignore
@withRouter
@observer
class LoginForm extends React.Component<any> {
    state = {
        username: "",
        password: ""
    }

    handleFormSaved = () => {
        const history = this.props.history
        const store = this.props.store
        const { t } = this.props
        // 这里可以进行登陆密码验证
        request({
            method: "post",
            url: "/user/api/auth/signin",
            data: this.state,
            headers: {
                "content-type": "application/json"
            }
        }).then((res: any) => {
            if (res.data != null && res.status === 200) {
                store.user.login(this.state.username, res.data.token)
                Message({
                    type: MessageType.SUCCESS,
                    content: t("toast.loginSuccess")
                })
                // 跳转到dashboard页面
                history.replace(`/dashboard`)
            } else {
                // toast["error"]("登录失败", "消息")
            }
        })
    }

    handleChangeForPassword = (e: any) => {
        this.setState({
            password: e.target.value
        })
    }

    handlePassWordEnter = (e: any) => {
        if (e.keyCode === 13) {
            this.handleFormSaved()
        }
    }

    componentDidMount() {
        const store = this.props.store
        console.log("store.user.name", store.user.name)
        console.log("store.user.isAuthenticated", store.user.isAuthenticated)
    }

    handleChangeForUsername = (e: any) => {
        this.setState({
            username: e.target.value
        })
    }

    render() {
        const { t } = this.props
        return (
            <Form
                name="basic"
                wrapperCol={{ span: 24 }}
                initialValues={{ remember: true }}
                onFinish={this.handleFormSaved}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
                size="large"
                className="bg-white w-full p-4 pt-8"
                // style={{backgroundColor: "#fff", }}
            >
                <Form.Item
                    // label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: "Please input your username!"
                        }
                    ]}
                >
                    <Input
                        placeholder={t("login.username")}
                        style={{ borderRadius: 10 }}
                        value={this.state.username}
                        onChange={this.handleChangeForUsername}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Please input your password!"
                        },
                        { type: "string", min: 6 }
                    ]}
                >
                    <Input.Password
                        placeholder={t("login.password")}
                        style={{ borderRadius: 10 }}
                        value={this.state.password}
                        onChange={this.handleChangeForPassword}
                    />
                </Form.Item>

                <Form.Item wrapperCol={{ span: 16 }}>
                    <Button type="primary" htmlType="submit" shape="round">
                        {t("login.submitText")}
                        <i className="fa-solid fa-arrow-right m-l-xxl"></i>
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}

export default withTranslation()(LoginForm)

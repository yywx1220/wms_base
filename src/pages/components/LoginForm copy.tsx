import schema2component from "@/utils/schema2component";

let user = require("@/icon/icon_login_user.png");

const schema = {
  type: "form",
  title: "",
  // api: "/user/api/auth/signin",
  redirect: "/dashboard",
  background: "bg-transparent",
  wrapWithPanel: false,
  cssVars: {
    "--Panel-bg": "bg-transparent",
  },
  api: {
    url: "post:/user/api/auth/signin",
    requestAdaptor: function (api: { data: any }) {
      return {
        ...api,
        data: {
          ...api.data, // 获取暴露的 api 中的 data 变量
        },
      };
    },
  },
  body: [
    {
      type: "input-text",
      name: "username",
      placeholder: "用户名",
      value: "12345",
      // icon: "user",
      required: true,
      // className: "w-xs",
      addOn: {
        type: "text",
        icon: "fa-solid fa-user",
        position: "left",
        level: "primary",
      },
    },
    {
      type: "input-password",
      name: "password",
      placeholder: "密码",
      value: "123456",
      // icon: "fa-solid fa-user",
      required: true,
      addOn: {
        type: "text",
        icon: "fa-solid fa-unlock-keyhole",
        position: "left",
        level: "primary",
      },
    },
    {
      type: "submit",
      label: "登录",
      size: "lg",
      level: "primary",
      rightIcon: "fa-solid fa-arrow-right",
      rightIconClassName: "m-l-md",
      className: "w-xs",
      addOn: {
        type: "text",
        icon: "fa-solid fa-arrow-right",
        // position: "left",
        level: "primary",
      },
    },
  ],
};

export default schema2component(schema);

import schema2component from "@/utils/schema2component";

const schema = {
    "type": "service",
    // "api": "get:/station/api/getWorkStationVO",
    "ws": {
        "url": "ws://localhost:8090/websocket",
        "requestAdaptor": function (api: { data: any; }) {
            return {
                data: {
                    ...api.data, // 获取暴露的 api 中的 data 变量
                },
                "headers": {
                    "X-WarehouseID": "123",
                    "Authorization": "eJwlTltbgjAY/kX6cIiKy0LBbzV4mDgnd46BbA2FKGX8emddvDfvuTao5UklM4lgN4ObShjhTIIqgmf46hmNULisrUkwcmE+0byLf8VDPBNd+bn8jJBbedRY/qfcWl6tDZ5zF+RNHhh1jklojoz0JcMy06P8UJcBtDNCF7siaRvhxabct1fBUg2q5395Y0/89xhc7JxHFy5gSlcWERJ2U9ebN5mptZcVJy9V+IbnMly+BNFp4mSYvlVD3vOueVLDsDpQn/JgUbb71/4qN/Mi23LnDqp5VUI=",
                    "X-TenantID": new URL(window.location.href).hostname.split('/')[0]
                }
            };
        }

    },
    "onMessage": [
        {
            "type": "request",
            "api": "get:/station/api/getWorkStationVO", // WebSocket 消息处理后的 API 请求
            "target": "dataFromApi"
        }
    ],
    "body": {
        "type": "page",
        "title": "$workStationVO.stationCode",
        "body": "随机数：${random}"
    }
};
export default schema2component(schema);


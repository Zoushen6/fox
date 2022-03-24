import {ADMIN_ROUTE_MASK, ALL_ROUTE_MASK, EXCLUDE_CUSTOMER_ROUTE_MASK, MANAGERS_ROUTE_MASK} from "@config/RouteAuth";

export const AUTH_MENU_LIST = [
    {
        title: "修改密码",
        iconfont: "password"
    },
    {
        title: "退出登录",
        iconfont: "exit"
    },

];

export const SETTINGS_MENU_LIST = [
    {
        authority: ADMIN_ROUTE_MASK,
        path: "userManage",
        title: "账号管理",
        iconfont: "icon-user"
    },
    {
        authority: ADMIN_ROUTE_MASK,
        path: "operateLog",
        title: "操作日志",
        iconfont: "icon-operate"
    },
    {
        authority: MANAGERS_ROUTE_MASK,
        path: "labelManage",
        title: "标签管理",
        iconfont: "icon-label"
    },
    {
        authority: MANAGERS_ROUTE_MASK,
        path: "crowdList",
        title: "人群列表",
        iconfont: "icon-crowd"
    },
    {
        authority: ALL_ROUTE_MASK,
        path: "directionPackage",
        title: "定向包",
        iconfont: "icon-add"
    },
    {
        authority: MANAGERS_ROUTE_MASK,
        path: "userInsight",
        title: "用户洞察",
        iconfont: "icon-insight",
        children: [
            {
                authority: MANAGERS_ROUTE_MASK,
                path: "dataScreen",
                title: "数据总览",
            },{
                authority: MANAGERS_ROUTE_MASK,
                path: "taskManage",
                title: "任务管理",
            },{
                authority: MANAGERS_ROUTE_MASK,
                path: "calculationRules",
                title: "计算规则",
            },
        ]
    },
];

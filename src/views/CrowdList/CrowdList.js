import {ADMIN_ROUTE_MASK, OPERATE_MANAGE_ROUTE_MASK, ALL_ROUTE_MASK} from "@config/RouteAuth";

let header = [
    {
        "prop": "package_name",
        "label": "人群",
        "auth": ALL_ROUTE_MASK
    },
    {
        "prop": "package_num",
        "label": "覆盖人数",
        "sortable": "descending",
        "auth": ALL_ROUTE_MASK
    },
    {
        "prop": "user_name",
        "label": "创建者",
        "auth": ALL_ROUTE_MASK
    },
    {
        "prop": "create_time",
        "label": "创建日期",
        "showTooltip": true,
        "sortable": "descending",
        "auth": ALL_ROUTE_MASK
    },
    {
        "prop": "convert_cost",
        "label": "操作",
        "showSlot": true,
        "slotName": 'button',
        "auth": ALL_ROUTE_MASK,
        "childSlots": [
            {
                "slotName": 'deleteCrowd',
                "buttonName":"删除",
                "auth": ADMIN_ROUTE_MASK
            }, {
                "slotName": 'pushCrowd',
                "buttonName":"生成定向包",
                "auth": OPERATE_MANAGE_ROUTE_MASK
            }, {
                "slotName": 'detail',
                "buttonName":"查看详情",
                "auth": ALL_ROUTE_MASK
            },
        ]
    }

];

export default header;

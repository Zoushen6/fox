import {ADMIN_ROUTE_MASK, OPERATE_MANAGE_ROUTE_MASK, ALL_ROUTE_MASK} from "@config/RouteAuth";

let header = [
    {
        "prop": "name",
        "label": "定向包名称",
        "auth": ALL_ROUTE_MASK
    },
    {
        "prop": "upload_num",
        "label": "上传人数",
        "sortable": "descending",
        "auth": ALL_ROUTE_MASK
    },
    {
        "prop": "cover_num",
        "label": "头条覆盖人数",
        "sortable": "descending",
        "auth": ALL_ROUTE_MASK
    },
    {
        "prop": "account",
        "label": "投放账号",
        "auth": ALL_ROUTE_MASK
    },
    {
        "prop": "create_time",
        "label": "上传时间",
        "showTooltip": true,
        "sortable": "descending",
        "auth": ALL_ROUTE_MASK
    },
    {
        "prop": "status",
        "label": "状态",
        "showSlot": true,
        "slotName": 'status',
        "auth": ALL_ROUTE_MASK
    },
    {
        "prop": "button",
        "label": "操作",
        "showSlot": true,
        "slotName": 'button',
        "buttonName":"推送",
        "auth": OPERATE_MANAGE_ROUTE_MASK,
    }

];

export default header;

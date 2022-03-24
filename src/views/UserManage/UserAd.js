export let advHeader = [
    {
        "prop": "name",
        "width":330,
        "label": "广告主名称",
    },{
        "prop": "channel",
        "showSlot": true,
        "slotName": 'channel',
        "label": "渠道",
    }, {
        "prop": "operation",
        "label": "操作",
        "showSlot": true,
        "slotName": 'switch',
    }

];

export let customerHeader = [
    {
        "prop": "username",
        "label": "客户名称",
        "showTooltip": true
    }, {
        "prop": "operation",
        "width": '160',
        "label": "操作",
        "showSlot": true,
        "slotName": 'switch',
    }

];

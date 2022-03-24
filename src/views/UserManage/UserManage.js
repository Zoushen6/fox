let advDisappear = (row, item) => {
    return (row.role_id !== 2)
};

let customerDisappear = (row) => {
    return (row.role_id !== 3)
};

let header = [
    {
        "prop": "username",
        "label": "账户",
        "showTooltip": true
    },
    {
        "prop": "role_name",
        "label": "角色",
    },
    {
        "prop": "status",
        "label": "状态",
        "showSlot": true,
        "slotName": 'status',
    },
    {
        "prop": "convert_cost",
        "label": "操作",
        "showSlot": true,
        "slotName": 'button',
        "childSlots": [
            {
                "slotName": 'editAccount',
                "buttonName": '编辑',
            },
            {
                "slotName": 'deleteAccount',
                "buttonName": '删除',
            },
            {
                "slotName": 'resetPwd',
                "buttonName": '重置密码',
            },
            {
                "slotName": 'configure',
                "buttonName": '配置广告主',
                "disappear": customerDisappear,
            },
            {
                "slotName": 'configureCustomer',
                "buttonName": '配置客户',
                "disappear": advDisappear,
            },
        ]
    }
];

export default header;

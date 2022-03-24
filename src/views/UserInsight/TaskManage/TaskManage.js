
export let header = [
    {
        "prop": "task_id",
        "label": "任务id",
    },
    {
        "prop": "task_name",
        "label": "任务名称",
        "showTooltip": true
    },
    {
        "prop": "get_type",
        "label": "查询方式",
    },
    {
        "prop": "task_desc",
        "label": "任务备注",
        "showTooltip": true
    },
    {
        "prop": "update_time",
        "label": "最后更新时间",
        "sortable": "descending",
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
            }, {
                "slotName": 'deleteAccount',
                "buttonName": '删除',
            }
        ]
    }
];

export let planList = [
    {
        value: '任务ID',
        id: 'search_task_id'
    },
    {
        value: '任务名称',
        id: 'search_task_name'
    },
    {
        value: '备注',
        id: 'search_task_desc'
    }
];


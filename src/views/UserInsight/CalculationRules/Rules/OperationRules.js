import common from "@tools/common.js";

let date = (row) => {
    return common.getNewDay(Number(row.create_time)*1000);
};

let ruleStatus = (row) => {
    if(row.status === '0') {
        return '未开始'
    }else if(row.status === '1') {
        return  '进行中'
    }else {
        return  '已停止'
    }
};

let ruleType = (row) => {
    return row.type === '1' ? '对比重合度' : '昨日重合度'
};

let type = () => {
    return '每日'
};

let disappearStart = (row) => {
    return row.status === '1';
};

let disappearStop = (row) => {
    return row.status !== '1';
};

let disappearDelete = (row) => {
    return row.status === '1' ? true :false;
};

export let header = [
    {
        "prop": "id",
        "label": "规则ID",
    },
    {
        "prop": "name",
        "label": "规则名称",
        "showTooltip": true
    },
    {
        "prop": "type",
        "label": "规则类型",
        "formatter": ruleType,
    },
    {
        "prop": "status",
        "label": "规则状态",
        "showSlot": true,
        "slotName": "ruleStatus",
    },
    {
        "prop": "mode",
        "label": "计算方式",
        "formatter": type,
    },
    {
        "prop": "create_time",
        "label": "创建日期",
        "sortable": "descending",
        "formatter": date,
    },
    {
        "prop": "convert_cost",
        "label": "操作",
        "showSlot": true,
        "slotName": 'button',
        "childSlots": [
            {
                "slotName": 'start',
                "buttonName": '开始',
                "disappear": disappearStart,
            },
            {
                "slotName": 'stop',
                "buttonName": '停止',
                "disappear": disappearStop,
            },
            {
                "slotName": 'delete',
                "buttonName": '删除',
                "disappear": disappearDelete,
            }
        ]
    }
];
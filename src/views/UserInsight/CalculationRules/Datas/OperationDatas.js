let contactRatio = (row) => {
    return row.contact_ratio + '%';
};

export let header = [
    {
        "prop": "dt",
        "label": "创建日期",
        "align": 'center'
    },
    {
        "prop": "yesterday_num",
        "label": "昨日用户数",
        "align": 'center'
    },
    {
        "prop": "today_num",
        "label": "今日用户数",
        "align": 'center'
    },
    {
        "prop": "unite_num",
        "label": "重合用户数",
        "align": 'center'
    },
    {
        "prop": "contact_ratio",
        "label": "重合度",
        "align": 'center',
        "formatter": contactRatio
    }
];

export let newHeader = [
    {
        "prop": "dt",
        "label": "创建日期",
        "align": 'center'
    },
    {
        "prop": "tag1_total",
        "label": "任务1用户数",
        "align": 'center'
    },
    {
        "prop": "tag2_total",
        "label": "任务2用户数",
        "align": 'center'
    },
    {
        "prop": "unite_num",
        "label": "重合用户数",
        "align": 'center'
    },
    {
        "prop": "contact_ratio",
        "label": "重合度",
        "align": 'center',
        "formatter": contactRatio
    }
];
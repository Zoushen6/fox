let option = {
    tooltip: {
        trigger: 'axis',
        textStyle:{
            fontWeight:'normal',
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        top: '10%',
        bottom: '11%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: [],
        axisTick: {
            show: true,
            inside: true,
            lineStyle: {
                color: '#EBEBEB'
            }
        },
        axisLine: {
            show: false
        }
    },
    yAxis: [
        {
            type: 'value',
            nameLocation:'end',
            axisTick:{
                show: false ,
            },
            splitLine: {
                lineStyle: {
                    color: "#ebebeb"
                }
            }

        }
    ],
    series: [
        {
            name: '目标用户数',
            type: 'line',
            smooth: 0.4,
            symbolSize: 8,
            showSymbol:false,
            itemStyle:{
                color:'#2B4DFF',
                borderColor:'#2B4DFF',
            },
            data: []
        }
    ]
};

let rewriteTotal = function (row) {
    return parseFloat(row.total).toLocaleString()
}

let _header = [
    {
        "prop": "dt",
        "label": "日期",
        "width": "250",
        "align":'center',
    },{
        "prop": "task_id",
        "label": "任务ID",
        "align":'center',
    },{
        "prop": "get_type",
        "label": "查询类型",
        "align":'center',
    },{
        "prop": "task_name",
        "label": "任务名称",
        "align":'center',
    },{
        "prop": "total",
        "label": "目标用户数",
        "align":'center',
        "formatter": rewriteTotal
    },
];

const rangeList = [
    {
        label:"近7日",
        value:7,
        isPlain:true
    },{
        label:"近30日",
        value:30,
        isPlain:true
    },
];
export {
    option,_header,rangeList
}

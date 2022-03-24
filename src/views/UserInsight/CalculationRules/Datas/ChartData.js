export let option = {
    title: {
        top: '-1%',
        text: '重合度趋势图',
        textStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            fontColor: '#333333',
        }
    },
    xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
            interval: 'auto',
        },
        //坐标轴刻度
        axisTick: {
            show: false,
        },
        //坐标轴轴线
        axisLine: {
            show: false,
        },
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value}%'
        },
    },
    grid: {
        left: '4%',
        right: '4%',
        top: '13%',
        bottom: '10%',
        containLabel: true
    },
    tooltip: {
        trigger: 'axis',
        textStyle: {
            fontWeight: 'normal',
        },
        formatter: function (params) {
            let relVal = params[0].name;
            for (let i = 0, l = params.length; i < l; i++) {
                relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value + '%'
            }
            return relVal
        }
    },
    series: {
        name: '重合度',
        data: [],
        type: 'line',
        smooth: 0.4,
        symbolSize: 8,
        showSymbol:false,
        itemStyle: {
            color: '#4063DF',
            borderColor: '#4063DF',
        },
    }
};

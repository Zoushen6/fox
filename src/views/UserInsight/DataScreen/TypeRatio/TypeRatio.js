let option = {
    title: {
        left: 'left',
        textStyle: {
            fontSize:14,
            fontWeight:'normal',
            fontColor:'#333333'
        }
    },
    tooltip: {
        show: true,
        formatter: function (params) {
            //要原点的话 params.marker
            let val ='目标用户数: ' + parseFloat(params.data.num).toLocaleString() + '</br>' + '占比: ' + params.value + '%'
            return val
        },
    },
    legend: {
        top: 'bottom',
        icon:"circle",
        itemWidth:10,
        itemHeight:10,
    },
    series: [
        {
            type: 'pie',
            radius: '50%',
            minAngle: 10,
            //无数据占位圆
            showEmptyCircle:false,
            color:[],
            data: [],
            itemStyle: {
                borderWidth: 8,
                borderColor: '#fff',
            },
            label:{

                fontSize: 14,
                lineHeight: 25,

            },
            labelLine: {
                length:20,
                length2:20,
                lineStyle: {
                    color:'#D9D9D9'
                }
            },
            emphasis: {
                scale:false,
            }
        }
    ]
};

export  {
    option
}

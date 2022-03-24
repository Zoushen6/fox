<template>
    <div>
        <span>{{title}}</span>
        <div ref="chart"  style="height: 330px" :class="isNull ? 'empty-chart' : ''" ></div>
    </div>
</template>

<script>
import UserInsightMixin from "@views/UserInsight/UserInsightMixin.js";
import common from "@tools/common.js";
import * as echarts from 'echarts';
import {option} from "@views/UserInsight/DataScreen/TypeRatio/TypeRatio.js";
import {isArray} from "lodash";
export default {
    name: "PieChart",

    mixins:[UserInsightMixin],

    props: {
        list: [Object,Array],
        colorList:Array,
        title:String
    },

    mounted() {
        //深拷贝option 防止共用一个option覆盖数据  (两个替代品Option分别给两个组件，改option时互相不干扰)
        this.option = this.common.deepCopy(option, this.option);
        this.initChart();
    },

    data() {
        return {
            common,
            showPie: false,
            isNull:false
        }
    },

    methods: {
        searchFn(){
            this.paintChart()
        },

        initChart() {
            this.chart = echarts.init(this.$refs.chart);
            this.resizeChart()
        },

        paintChart() {
            this.optionData(this.list);
            this.chart.clear();
            this.chart.setOption(this.option, true);
        },

        optionData(list){
            this.option.series[0].color = this.colorList;
            //无数据或数据都为0时 后端会返回一个空数组
            if(isArray(this.list)) {
                this.option.series[0].data = [];
                this.isNull = true;
                return ;
            }else {
                this.isNull = false;
            }
            let newList = Object.keys(list).reduce((res,next) => {
                res.push({
                    'name': next,
                    'value': list[next].ratio.toFixed(0),
                    'num': list[next].num.toFixed(0),
                })
                return res
            },[])
            this.option.series[0].data = newList.reverse();
        },
    }
}
</script>

<style scoped lang="scss">

</style>

<template>
    <div class="container" v-loading="loading">
        <el-form class="customized-form flex" :inline="true">
            <span class="form-title">设备类型占比</span>
            <el-form-item prop="dateValue">
                <el-date-picker
                    class="single-time-picker middle-item"
                    v-model="dateValue"
                    type="date"
                    @change="handleDate"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <el-row class="m-t-10">
            <el-col :span="12" :xs="24" >
                <pie-chart ref="Mobile" :list="MobileRatioList" :title="MobileChartTitle" :color-list="MobileColorList" ></pie-chart>
            </el-col>
            <el-col :span="12" :xs="24" >
                <pie-chart ref="Android" :list="AndroidRatioList" :title="AndroidChartTitle" :color-list="AndroidColorList" ></pie-chart>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import UserInsightMixin from "@views/UserInsight/UserInsightMixin";
import common from "@tools/common.js";
import {LastSeveralDays} from "@tools/DateUtils";
import PieChart from "@views/UserInsight/DataScreen/TypeRatio/PieChart.vue";

export default {
    name: "TypeRatio",

    mixins:[UserInsightMixin],

    components: {PieChart},

    mounted() {
        this.listLoad();
    },

    data(){
        return {
            MobileRatioList:{},
            AndroidRatioList:{},
            minDate: Math.ceil((new Date - new Date("2018-1-1")) / (3600 * 24 * 1000)),
            dateValue:new Date()-(3600 * 24 * 1000),
            MobileChartTitle:'移动端设备类型占比',
            AndroidChartTitle:'安卓手机类型占比',
            MobileColorList:['#F1902C','#4CBD42'],
            AndroidColorList:['#F1902C','#4063DF'],
            common,
        }
    },

    methods: {

        handleDate() {
           this.listLoad()
        },

        listLoad(){
            this.loading = true;
            this.axiosList().then((res) => {
                if (res && res.data.code === 200){
                    this.MobileRatioList = res.data.data.list.device;
                    this.AndroidRatioList = res.data.data.list.android;
                }
            }).catch((err) => {
                console.warn(err)
            }).finally(() => {
                this.loading = false;
                this.$refs.Mobile.searchFn()
                this.$refs.Android.searchFn()
            })
        },

        axiosList() {
            return this.$http.get("rta/data/list", {
                params: {
                    start_date: this.dateValue?this.common.getNewDay(this.dateValue):this.common.getNewDay(LastSeveralDays(1,1)[0]),
                    end_date: this.dateValue?this.common.getNewDay(this.dateValue):this.common.getNewDay(LastSeveralDays(1,1)[0]),
                    module: 'type_ratio',
                }
            });
        },
    }
}
</script>

<style scoped lang="scss">
    .single-time-picker {
        /deep/.el-input__prefix {
            color: $font-color-auxiliary;
            opacity: 0.5;
        }
    }
</style>

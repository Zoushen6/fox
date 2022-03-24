<template>
    <div class="data-container">
        <el-form :inline="true" class="customized-form background-white m-t-5 p-l-r-24" :model="optionsForm"
                 :rules="rules"
                 ref="optionsForm">
            <el-form-item class="rule-name">
                <el-select v-model="optionsForm.ruleName" placeholder="选择规则名称">
                    <el-option
                        v-for="item in optionsForm.ruleList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <customized-time-picker
                    class="time-picker long-item"
                    :date.sync="optionsForm.dateValue"
                    :shortcutsSetting="shortcutsSetting"
                    :max-date="1"
                    :min-date="365"
                ></customized-time-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchFn">查询</el-button>
            </el-form-item>
            <el-form-item class="desc" label="规则开始时间："><span>{{optionsForm.startDate ? optionsForm.startDate : today }}</span></el-form-item>
            <el-form-item class="desc" label="规则类型："><span>{{ optionsForm.ruleType === 1 ? '对比重合度' : '昨日重合度' }}</span>
            </el-form-item>
        </el-form>

        <div class="background">
            <table-chart-data
                v-for="(item, index) in dataList" :key="index"
                :isLoading="loading"
                ref="tableChartData"
                :info="item"
                :rule="optionsForm.ruleType"
                @updateTable="tableLoad"
                @exportData="exportData"
            ></table-chart-data>
        </div>
    </div>
</template>

<script>
import common from "@tools/common";
import {LastSeveralDays} from "@tools/DateUtils.js";
import CustomizedTimePicker from "@components/CustomizedTimePicker.vue";
import TableChartData from "@views/UserInsight/CalculationRules/Datas/TableChartData.vue";

export default {
    name: "OperationData",
    components: {CustomizedTimePicker, TableChartData},
    data() {
        return {
            common,
            loading: false,
            dataList: [],
            optionsForm: {
                dateValue: LastSeveralDays(7, 1),
                ruleName: '',
                ruleList: [],
                startDate: "",
                ruleType: "",
                firstData: null
            },
            rules: {
                ruleName: [{required: true, message: "请选择规则名称"}],
            },
            shortcutsSetting: ["yesterday", "lastSeven", "lastThirty", "lastWeek", "lastMonth",],
            today: common.getNewDay(new Date()),
        };
    },
    mounted() {
        this.ruleDataList();
    },
    methods: {

        //后台返回数据为倒叙，这里需要reverse，由于reverse会改变原数组，所以先使用slice拷贝一份
        firstData() {
            this.optionsForm.ruleList.slice().reverse().find(item=>{
                if(item.status !== undefined && item.status === '1') {
                    this.optionsForm.ruleName = item.id;
                }
                return;
            });
        },

        //下拉选择规则类型列表
        ruleDataList() {
            this.$http.get("/rta/rule/list", {
                params: {
                    page_size: 1000,
                    status: 1,
                }
            }).then((res) => {
                if (res.data.code === 200) {
                    this.optionsForm.ruleList = res.data.data.list;
                    this.firstData();
                    this.searchFn();
                }
            });
        },

        //查询
        searchFn() {
            this.$refs.optionsForm.validate((valid) => {
                valid && this.tableLoad();
            })
        },

        //请求table列表参数
        axiosData(is_export = 1, infos) {
            const params = {
                rule_id: this.optionsForm.ruleName,
                start_date: this.common.getNewDay(this.optionsForm.dateValue[0]),
                end_date: this.common.getNewDay(this.optionsForm.dateValue[1]),
                is_export,
            };
            //将对象infos合并进params
            Object.assign(params, infos);
            return this.$http.get("/rta/rule/data", {
                params,
                responseType: is_export ? 'blob' : ''
            });
        },

        //请求table列表数据
        tableLoad(infos = {}) {
            this.loading = true;
            /* 根据infos是否为空判断是否更新全部数据，如果更新全部数据直接：
            this.dataList = res.data.data.list;
            如果infos不为空 根据infos.task_id修改对应的数据  先查找task_id对应的index 然后修改this.dataList[index1] = res.data.list.list[index2];
            **/
            this.axiosData( 0, infos).then((res) => {
                if (res.data.code === 200) {
                    this.optionsForm.startDate = res.data.data.create_time;
                    this.optionsForm.ruleType = res.data.data.rule_type;
                    if(JSON.stringify(infos) === '{}'){
                        this.dataList = res.data.data.list;
                    }else {
                        let index;
                        res.data.data.list.find((ite,idx)=>{
                            if(ite.task_id === infos.task_id) {
                                index = idx;
                            }
                            return;
                        })
                        this.dataList[index] = res.data.data.list[index];
                    }
                }
            }).catch((err) => {
                console.warn(err);
            }).finally(() => {
                this.loading = false;
            });
        },

        //导出表格
        exportData(infos) {
            this.axiosData( 1, infos).then((res) => {
                this.common.downloadFileBlob(res);
            });
        },

    },
};
</script>

<style scoped lang="scss">
.data-container {
    .customized-form {
        /deep/ .el-form-item__label {
            line-height: 32px;
            color: $font-color-base;
        }

        /deep/ .desc {
            .el-form-item__content {
                color: $font-color-base;
                font-size: $font-size-base;
            }
        }

        /deep/ .rule-name {
            .el-input__inner {
                color: $font-color-base;
            }
        }
    }
    .background {
        background-color: $bg-color-grey;
    }
}
</style>

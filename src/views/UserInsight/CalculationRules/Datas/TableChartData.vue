<template>
    <div>
        <div class="table-title overflow-hidden">
            <span v-if="rule === 2">
                <span>淘宝任务ID：</span>
                <span class="pointer" :title="info.task_id"
                      @click="CopyContent(info.task_id)">{{ info.task_id | handleLength(20) }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="pointer" :title="info.task_name"
                      @click="CopyContent(info.task_name)">( {{ info.task_name | handleLength(20) }} )</span>
            </span>
            <span v-else-if="rule === 1" v-for="(ite, idx) in info.task" :key="idx">
                <span>对比任务</span>
                <span class="pointer" :title="ite.task_id" @click="CopyContent(ite.task_id)">{{idx + 1 }}：{{ ite.task_id | handleLength(20) }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="pointer" :title="ite.task_name"
                      @click="CopyContent(ite.task_name)">( {{ ite.task_name | handleLength(20) }} )</span>&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <el-button class="f-r" @click="exportData" type="primary">导出表格</el-button>
        </div>
        <el-row :gutter="4">
            <el-col :span="12" :xs="24" class="col-height">
                <div class="data-padding background-white">
                    <!-- 表格区 -->
                    <customized-table
                        class="white-table mini-table customized-table "
                        :loading="isLoading"
                        :show-column-border="true"
                        :max-height="null"
                        :table-height="240"
                        :Data="info.list"
                        :Header="rule === 1 ? newHeader : header"
                        ref="customizedTable"
                        @size-change="(val) => {pageSizeChange(handleTable, this, val);}"
                        @current-change="(val) => {pageChange(handleTable, this, val);}"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        :page-sizes="pageSizes"
                        :total="total"
                    ></customized-table>
                    <!-- /表格区 -->
                </div>
            </el-col>

            <el-col :span="12" :xs="24" class="col-height background-white">
                <div class="data-padding">
                    <div ref="chart" :class="chartData && chartData.length ? '' : 'empty-chart'" v-loading="isLoading"
                         style="height: 287px"></div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import * as echarts from "echarts";
import {CopyContent} from "@tools/Copy.js";
import PaginationMixin from "@mixins/PaginationMixin.js";
import UserInsightMixin from "@views/UserInsight/UserInsightMixin.js";
import {option} from "@views/UserInsight/CalculationRules/Datas/ChartData.js";
import {header, newHeader} from "@views/UserInsight/CalculationRules/Datas/OperationDatas.js";

export default {
    name: "TableChartData",
    mixins: [PaginationMixin, UserInsightMixin],
    props: {
        info: {
            type: Object,
            default: function () {
                return {
                    pagination: {
                        page_size: 10,
                        current_page: 1,
                        total: 0
                    },
                    list: []
                }
            }
        },
        rule: {
            type: [String, Number],
            default: 1
        },
        isLoading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            pageSizes: [10, 20, 30, 40, 50],
            chartData: [],
            header,
            newHeader,
            option,
        }
    },
    mounted() {
        this.initChart();
    },
    watch: {
        info: {
            handler: function (val) {
                if (val.pagination) {
                    this.pageSize = val.pagination.page_size;
                    this.currentPage = val.pagination.current_page;
                    this.total = val.pagination.total;
                }
                this.tableData = val.list;
                this.chartData = val.list;
                this.$nextTick(()=>{
                    this.setOptions();
                })
            },
            //immediate: true; 让页面首次加载就开始监听
            immediate: true
        }
    },
    methods: {

        CopyContent,

        handleTable() {
            this.$emit('updateTable', this.getCurInfo());
        },

        exportData() {
            this.$emit('exportData', this.getCurInfo());
        },

        getCurInfo() {
            return {
                task_id: this.info.task_id,
                page: this.currentPage,
                page_size: this.pageSize,
            };
        },

        initChart() {
            this.chart = echarts.init(this.$refs.chart);
            this.resizeChart()
        },

        setOptions() {
            this.chart.clear();
            let data = this.chartData.slice().reverse();
            let Option = this.option;
            Option.series.data = data.map((item) => {
                return item.contact_ratio;
            });
            Option.xAxis.data = data.map((item) => {
                return item.dt;
            });
            this.chart.setOption(Option, true);
        },
    }
}
</script>

<style scoped lang="scss">
@import "src/views/UserInsight/white-table";
@import "src/views/UserInsight/UserInsight";

.table-title {
    padding-left: 24px;
    box-sizing: border-box;
    width: 100%;
    height: 64px;
    line-height: 64px;
    background-color: $bg-color-grey;

    /deep/ .el-button {
        height: 32px;
        padding: 8px 16px;
        margin-top: 16px;
    }
}

.customized-table {
    //flex撑不满页面
    display: block;
}

.data-padding {
    padding: 24px 24px;
}

.col-height {
    height: 350px;
}

.background {
    background-color: $bg-color-grey;
}
</style>
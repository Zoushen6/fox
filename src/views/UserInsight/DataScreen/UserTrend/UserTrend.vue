<template>
    <div class="container" v-loading="loading">
        <el-form class="customized-form flex" :inline="true">
            <span class="form-title">目标用户变化趋势</span>
            <el-form-item prop="dateValue">
                <customized-time-picker
                    class="time-picker long-item"
                    :date.sync="optionsForm.dateValue"
                    :max-date="1"
                    :showShortcutsSetting="false"
                    :min-date="minDate"
                    @change="dataChange"
                ></customized-time-picker>
            </el-form-item>
            <el-form-item class="rankRange">
                <el-button v-for="(item,idx) in rangeList" size="small" :key="idx"
                           :class="rankButtonStyle == item.value ? 'button-active':''" @click="getRangList(idx)">
                            {{ item.label }}
                </el-button>
            </el-form-item>

            <el-form-item class="middle-item" v-show="buttonStyle === 'chart'">
                <el-select v-model="optionsForm.type" placeholder="选择查询类型" @change="listLoadCopy" clearable>
                    <el-option v-for="(val,key) in searchWay" :key="key" :label="key"
                               :value="val"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="middle-item" v-show="buttonStyle === 'chart'">
                <el-select v-model="optionsForm.task_id" placeholder="选择任务" @change="listLoad" filterable clearable>
                    <el-option v-for="(item) in taskList" :key="item.id" :label="item.task_name"
                               :value="item.task_id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="middle-item" v-show="buttonStyle === 'chart'">
                <el-select v-model="optionsForm.id_type" placeholder="选择设备号类型" @change="listLoad" filterable clearable>
                    <el-option v-for="(item,key) in typeList" :key="key" :label="key"
                               :value="item"></el-option>
                </el-select>
            </el-form-item>
            <div class="align-right">
                <el-form-item size="mini">
                    <el-button v-for="item in buttonList" :key="item.value"
                               :class="buttonStyle == item.value ? 'button-active' : ''"
                               @click="buttonClick(item.value)">
                        <span class="iconfont" :class="item.iconName"></span>
                    </el-button>
                </el-form-item>
                <el-form-item class="chart-table-button">
                    <el-button v-show="buttonStyle === 'table'" type="primary" class="small-button" size="small"
                               @click="exportTable">导出表格
                    </el-button>
                </el-form-item>
            </div>
        </el-form>

        <div v-show="buttonStyle === 'chart'" ref="chart" :class="list && list.length ? '' : 'empty-chart'"
             style="height: 318px"></div>

        <customized-table
            v-show="buttonStyle === 'table'"
            ref="customizedTable"
            class="customized-table white-table mini-table"
            :max-height="null"
            :table-height="241"
            :show-column-border="true"
            :Data="tableList"
            :Header="header"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @size-change="val=>{pageSizeChange(tableListLoad,this,val)}"
            @current-change="val=>{pageChange(tableListLoad,this,val)}"
        >
        </customized-table>

    </div>
</template>

<script>
import UserInsightMixin from "@views/UserInsight/UserInsightMixin";
import * as echarts from 'echarts';
import {option, _header, rangeList} from "@views/UserInsight/DataScreen/UserTrend/UserTrend.js";
import {LastSeveralDays} from "@tools/DateUtils";
import PaginationMixin from "@mixins/PaginationMixin";
import common from "@tools/common.js";

export default {
    name: "UserTrend",

    mixins: [UserInsightMixin, PaginationMixin],

    created() {
        this.header = _header;
    },

    data() {
        return {
            header: '',
            option,
            common,
            rangeList,
            rankRangeList: {
                7: LastSeveralDays(7, 1),
                30: LastSeveralDays(30, 1),
            },
            rankButtonStyle: 7,
            optionsForm: {
                dateValue: LastSeveralDays(7, 1),
                type: '',
                task_id: '',
                id_type:'',
            },
            searchWay: {
                "实时RTA": '1',
                "离线OSS": '2',
                "实时RTA,离线OSS" : '3',
            },
            typeList: {
                IDFA:'idfamd5',
                IMEI:'imeimd5',
                OAID:'oaidmd5',
            },
            minDate: 365,
            _header,
            list: [],
            tableList: [{
                dt: "2022-01-13",
                get_type: "实时rta",
                task_id: "32896",
                task_name: "淘宝促活定向",
                total: "4035395550",
            }],
            taskList: [],
            buttonList: [
                {
                    iconName: 'icon-chart',
                    value: 'chart',
                }, {
                    iconName: 'icon-table',
                    value: 'table',
                }
            ],
            buttonStyle: 'chart',
        }
    },

    mounted() {
        this.initChart();
        this.axiosTaskList()
        this.buttonClick(this.buttonStyle);
    },

    deactivated() {
        this.reset()
    },

    methods: {

        exportTable() {
            this.$http.get("rta/data/list", {
                params: {
                    start_date: this.common.getNewDay(this.optionsForm.dateValue[0]),
                    end_date: this.common.getNewDay(this.optionsForm.dateValue[1]),
                    is_export: 1,
                    module: 'user_trend_execl',
                },
                responseType: 'blob'
            }).then(res => {
                this.common.downloadFileBlob(res);
            })
        },

        //2个排行
        getRangList(idx) {
            this.rankButtonStyle = this.rangeList[idx].value;
            this.optionsForm.dateValue = this.rankRangeList[this.rangeList[idx].value];
            this.buttonClick(this.buttonStyle);
        },

        dataChange() {
            this.rankButtonStyle = 0;
            this.buttonClick(this.buttonStyle);
        },

        buttonClick(value) {
            if(this.buttonStyle !== value) {
                this.reset();
            }
            this.buttonStyle = value;
            if (this.buttonStyle === "chart") {
                this.listLoad()
            } else {
                this.chart.clear();
                this.tableListLoad(1)
            }
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

        axiosList() {
            return this.$http.get("rta/data/list", {
                params: {
                    start_date: this.common.getNewDay(this.optionsForm.dateValue[0]),
                    end_date: this.common.getNewDay(this.optionsForm.dateValue[1]),
                    api_type: this.optionsForm.type,
                    tb_id: this.optionsForm.task_id,
                    id_type: this.optionsForm.id_type,
                    module: 'user_trend'
                }
            });
        },

        axiosTableList(page = 1) {
            return this.$http.get("rta/data/list", {
                params: {
                    start_date: this.common.getNewDay(this.optionsForm.dateValue[0]),
                    end_date: this.common.getNewDay(this.optionsForm.dateValue[1]),
                    page: page,
                    page_size: this.pageSize,
                    module: 'user_trend_execl',
                },
            });
        },

        axiosTaskList() {
            return this.$http.get("task/list", {
                params: {
                    search_get_type: this.optionsForm.type,
                    get_all: 1,
                }
            }).then(res => {
                this.taskList = res.data.data.list;
            });
        },

        optionData(data) {
            const xAxis = [];
            const series = [];
            data.forEach((item) => {
                xAxis.push(item['dt']);
                series.push(item['total']);
            })
            this.option.xAxis.data = xAxis;
            this.option.series[0].data = series;
        },

        listLoadCopy() {
          this.listLoad();
          this.axiosTaskList()
        },

        listLoad() {
            this.loading = true;
            this.axiosList().then((res) => {
                if (res && res.data.code === 200) {
                    this.list = res.data.data.list;
                }
            }).catch((err) => {
                console.warn(err)
            }).finally(() => {
                this.loading = false;
                this.paintChart();
            })
        },

        tableListLoad(num) {
            this.loading = true;
            this.axiosTableList(num).then((res) => {
                if (res && res.data.code === 200) {
                    this.tableList = res.data.data.list;
                    this.total = Number(res.data.data.pagination.total);
                    this.currentPage = num;
                }
            }).catch((err) => {
                console.warn(err)
            }).finally(() => {
                //表格底部显示不全 留白问题
                this.$nextTick(this.$refs.customizedTable.doLayout);
                this.loading = false;
            })
        },

        reset() {
            this.rankButtonStyle = 7;
            this.optionsForm.dateValue = LastSeveralDays(7, 1),
            this.optionsForm.type = '',
            this.optionsForm.task_id = ''
        }

    }
}
</script>

<style scoped lang="scss">
@import "src/views/UserInsight/white-table";

.customized-table {
    //flex撑不满页面
    display: block;
}

.el-button--mini {
    padding: 6px 0;
    border: 0;
    background-color: $font-color-white;

    .iconfont {
        font-size: 18px;
    }
}

.button-active {
    .icon-chart:before {
        color: $theme-color;
    }

    .icon-table:before {
        color: $theme-color;
    }
}

.icon {
    width: 23px;
    height: 18px;
    display: inline-block;
    transform: translate(5px, 4px);
}

.offset {
    color: white;
    display: inline-block;
    transform: translate(-10px, 3px) scale(0.7);
}

.button-active {
    color: $theme-color;
}

.customized-form {
    flex-wrap: wrap;
    .chart-table-button:last-child {
        margin-right: 0;
    }

    .form-title {
        display: inline-block;
    }

    .small-button {
        font-size: $font-size-base;
        padding: 8px 15px;
    }

    .align-right {
        margin-left: auto;
    }

    .rankRange {
        margin-right: 20px;
        margin-bottom: 0px;

        .el-button {
            font-size: $font-size-addition;
            padding: 7px 11px 0 0;
            border: 0;
            background-color: $font-color-white;
        }

        .el-button--text {
            color: $font-color-base;
        }
    }
}
</style>

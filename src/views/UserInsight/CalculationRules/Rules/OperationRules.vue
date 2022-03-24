<template>
    <div class="flex-vertical overflow-hidden container flex-1">
        <el-form class="customized-form padding-top" :inline="true" :model="rulesForm" ref="rulesForm">
            <el-form-item class="long-item" prop="ruleType">
                <el-select v-model="rulesForm.ruleType" placeholder="选择规则类型" clearable>
                    <el-option v-for="item in rulesForm.ruleTypeList" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="long-item" prop="ruleState">
                <el-select v-model="rulesForm.ruleState" placeholder="选择规则状态" clearable>
                    <el-option v-for="item in rulesForm.ruleStateList" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="searchFn" type="primary">查询</el-button>
            </el-form-item>
            <br/>
            <el-form-item>
                <el-button @click="buildOperation" plain class="iconfont icon-add">新建规则</el-button>
            </el-form-item>
        </el-form>

        <!-- 表格区 -->
        <customized-table
            class="flex-1 overflow-hidden flex-vertical customized-table"
            :loading="loading"
            :Data="tableData"
            :Header="header"
            ref="customizedTable"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @size-change="val=>{pageSizeChange(tableLoad,this,val)}"
            @current-change="val=>{pageChange(tableLoad,this,val)}"
            @sort-change="sortChangeHandle"
            @start="row=>{start(row)}"
            @delete="row=>{deleteRules(row)}"
            @stop="row=>{stop(row)}"
        >
            <template v-slot:ruleStatus="{row}">
                <span style="position: relative" v-show="row.status === '0'" class="not-start">未开始</span>
                <span style="position: relative" v-show="row.status === '1'"><span class="start"></span>进行中</span>
                <span style="position: relative" v-show="row.status === '2'"><span class="stop"></span>已停止</span>
            </template>
        </customized-table>
        <!-- /表格区 -->

        <!-- 新建计算规则弹窗 -->
        <customized-dialog
            :width="600"
            class="customized-dialog build-rule"
            title="新建计算规则"
            :visible="buildOperationRules"
            :show-footer="true"
            @cancel="resetDialog"
            @submit="submitBuild('buildRuleForm')"
            @close="resetDialog"
        >
            <el-form :inline="true" class="customized-form" :model="buildRuleForm" :rules="buildRules"
                     ref="buildRuleForm">
                <el-form-item label="规则名称：" class="long-item" prop="ruleName">
                    <el-input v-model="buildRuleForm.ruleName" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="规则类型：" class="long-item" prop="contactRatio">
                    <el-select v-model="buildRuleForm.contactRatio" placeholder="请选择" @change="change">
                        <el-option v-for="item in buildRuleForm.contactRatioList" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <div v-if="buildRuleForm.contactRatio === 2">
                    <el-form-item
                        v-for="(ite,idx) in taskList"
                        :key="idx"
                        :label="'任务'+`${idx+1}`"
                        class="long-item"
                        label-width="90px"
                    >
                        <el-select :class="validAccess ? 'task' : ''" v-model="ite.name" placeholder="请选择任务"
                                   @visible-change="handleChange">
                            <el-option v-for="item in ite.list" :key="item.id"
                                       :label="item.task_name"
                                       :value="item.id"></el-option>
                        </el-select>
                        <div class="valid" v-show="validAccess">
                            <span>请选择任务！</span>
                        </div>
                    </el-form-item>
                </div>
                <div v-else-if="buildRuleForm.contactRatio === 1">
                    <el-form-item
                        v-for="(ite,idx) in comparisonTaskList"
                        :key="idx"
                        :label="'对比任务'+`${idx+1}`"
                        class="long-item"
                        label-width="90px"
                    >
                        <el-select :class="validAccess ? 'task' : ''" v-model="ite.name" placeholder="请选择任务"
                                   @visible-change="handleChange">
                            <el-option v-for="item in ite.list" :key="item.id"
                                       :label="item.task_name"
                                       :value="item.id"></el-option>
                        </el-select>
                        <div class="valid" v-show="validAccess">
                            <span>请选择任务！</span>
                        </div>
                    </el-form-item>
                </div>
                <el-form-item style="width: 100%" label="计算方式： 每日" label-width="130px"></el-form-item>
            </el-form>
        </customized-dialog>
        <!-- /新建计算规则弹窗 -->

        <!-- 开始、停止、删除弹窗 -->
        <text-dialog
            ref="start_stop"
            :show-footer="true"
            :is-reverse="true"
            :title="info.title"
            :text="info.text"
            :textClass="info.class"
            @success="operationRules"
        ></text-dialog>
        <!-- /开始、停止、删除弹窗 -->
    </div>
</template>

<script>
import {header} from "@views/UserInsight/CalculationRules/Rules/OperationRules.js";
import PaginationMixin from "@mixins/PaginationMixin.js";
import CustomizedDialog from "@components/CustomizedDialog.vue";
import TextDialog from "@components/dialog/TextDialog.vue";
import DialogMixin from "@mixins/DialogMixin.js";

export default {
    name: "OperationRule",
    components: {CustomizedDialog, TextDialog},
    mixins: [PaginationMixin, DialogMixin],
    data() {
        return {
            rulesForm: {
                ruleType: '',
                ruleTypeList: [],
                ruleState: '',
                ruleStateList: []
            },
            buildRuleForm: {
                ruleName: '',
                contactRatio: '',
                contactRatioList: [],
            },
            buildRules: {
                ruleName: [
                    {required: true, message: '请输入规则名称'},
                ],
                contactRatio: [
                    {required: true, message: '请选择规则类型'}
                ],
            },
            validAccess: false,
            loading: false,
            tableData: [],
            buildOperationRules: false,
            sort: null,
            order: null,
            info: {
                title: '提示',
                text: '',
                class: 'iconfont icon-warning',
                name: '',
                url: '',
                id: ''
            },
            taskList: [
                {name: '', list: null},
                {name: '', list: null},
                {name: '', list: null}
            ],
            comparisonTaskList: [
                {name: '', list: null},
                {name: '', list: null}
            ],
            taskID: [],
        }
    },
    created() {
        this.header = header;
    },

    mounted() {
        this.ruleStatus();
        this.ruleType();
        this.tableLoad();
    },

    deactivated() {
        this.$refs.rulesForm.resetFields();
    },

    methods: {

        //规则状态列表
        ruleStatus() {
            this.$http.get('/rta/rule/status-list').then(res => {
                if (res.data.code === 200) {
                    this.rulesForm.ruleStateList = res.data.data.list;
                }
            })
        },

        //规则类型列表
        ruleType() {
            this.$http.get('/rta/rule/type-list').then(res => {
                if (res.data.code === 200) {
                    this.rulesForm.ruleTypeList = res.data.data.list;
                    this.buildRuleForm.contactRatioList = res.data.data.list;
                }
            })
        },

        //排序
        sortChangeHandle(data) {
            if (data.order) {
                this.order = data.prop;
                this.sort = data.order === 'descending' ? 'desc' : 'asc';
            } else {
                this.order = null;
                this.sort = null;
            }
            this.tableLoad();
        },

        //table列表请求参数
        axiosParams(page = 1) {
            return this.$http.get('/rta/rule/list', {
                params: {
                    type: this.rulesForm.ruleType,
                    status: this.rulesForm.ruleState,
                    order: this.order,
                    sort: this.sort,
                    page: page,
                    page_size: this.pageSize,
                }
            })
        },

        //table列表数据
        tableLoad(num) {
            this.loading = true;
            this.axiosParams(num).then(res => {
                if (res.data.code === 200) {
                    this.tableData = res.data.data.list;
                    this.total = Number(res.data.data.pagination.total);
                    this.currentPage = num;
                }
            }).catch((err) => {
                console.warn(err)
            }).finally(() => {
                this.loading = false;
            })
        },

        openDialog(dialog) {
            if (this.$refs[dialog]) this.$refs[dialog].openDialog();
        },

        closeDialog(dialog) {
            if (this.$refs[dialog]) this.$refs[dialog].closeDialog();
        },

        searchFn() {
            this.tableLoad();
        },

        buildOperation() {
            this.buildOperationRules = true;
        },

        resetDialog() {
            this.$refs.buildRuleForm.resetFields();
            this.buildOperationRules = false;
            this.validAccess = false;
        },

        //新建规则请求参数
        axiosBuild() {
            return this.$http.post('/rta/rule/create', {
                name: this.buildRuleForm.ruleName,
                type: this.buildRuleForm.contactRatio,
                status: 0,
                task: JSON.stringify(this.taskID),
            })
        },

        change() {
            this.taskID = [];
            this.restTaskList();
        },

        //下拉选择索要创建的任务
        handleChange() {
            let list = [];
            let taskLists = this.buildRuleForm.contactRatio === 2 ? this.taskList : this.comparisonTaskList;
            taskLists.forEach(item => {
                if (item.name) {
                    list.push(item.name);
                }
            })
            if (this.buildRuleForm.contactRatio === 1) {
                this.validAccess = list.length === 2 ? false : true;
            } else {
                this.validAccess = list.length === 0 ? true : false;
            }
            this.taskID = list;
            this.$http.get('/task/search', {
                params: {
                    id: list.join(',')
                }
            }).then(res => {
                if (res.data.code === 200) {
                    //后台返回数据为倒序，这里需要reverse，由于reverse会改变原数组，所以先使用slice拷贝一份
                    taskLists.forEach(item => {
                        item.list = res.data.data.list.slice().reverse();
                    })
                }
            })
        },

        restTaskList() {
            let taskLists = this.buildRuleForm.contactRatio === 2 ? this.taskList : this.comparisonTaskList;
            taskLists.forEach(item => {
                if (item.name) item.name = '';
            })
        },

        //新建规则请求
        submitBuild(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid && (this.buildRuleForm.contactRatio === 1 ? this.taskID.length == 2 : this.taskID.length >= 1)) {
                    this.validAccess = false;
                    this.axiosBuild().then(res => {
                        if (res.data.code === 200) {
                            this.$message.success('新建规则成功！');
                            this.tableLoad();
                            this.restTaskList();
                            this.$refs.buildRuleForm.resetFields();
                            this.buildOperationRules = false;
                            this.taskID = [];
                        } else {
                            this.validAccess = false;
                            this.buildOperationRules = true;
                        }
                    }).catch(err => {
                        console.warn(err)
                    }).finally(() => {
                    })
                } else {
                    if (this.buildRuleForm.contactRatio === 1 ? this.taskID.length == 2 : this.taskID.length >= 1) {
                        this.validAccess = false;
                    } else {
                        this.validAccess = true;
                    }
                }
            })
        },

        //确定删除
        deleteRules(row) {
            this.openDialog('start_stop');
            this.info.text = '确认删除计算规则吗？';
            this.info.name = 'delete';
            this.info.url = '/rta/rule/delete';
            this.info.id = row.id;
        },

        //开始计算规则
        start(row) {
            this.openDialog('start_stop');
            this.info.text = '确认开始此计算规则吗？';
            this.info.name = 'start';
            this.info.url = '/rta/rule/start';
            this.info.id = row.id;
        },

        //停止计算规则
        stop(row) {
            this.openDialog('start_stop');
            this.info.text = '确认停止此计算规则吗？';
            this.info.name = 'stop';
            this.info.url = '/rta/rule/stop';
            this.info.id = row.id;
        },

        //点击删除、开始及停止请求
        itemInfo() {
            this.$http.post(this.info.url, {
                id: this.info.id,
            }).then(res => {
                if (res.data.code == 200) {
                    if (this.info.name === 'delete') {
                        this.$message.success('删除成功！')
                    } else {
                        this.$message.success('操作成功！')
                    }
                }
            }).catch(err => {
                console.warn(err)
            }).finally(() => {
                this.tableLoad();
            })
        },

        //确定开始或者停止计算规则
        operationRules() {
            this.itemInfo();
            this.closeDialog('start_stop');
        },
    }
}
</script>

<style scoped lang="scss">
.customized-dialog {
    .customized-form {
        /deep/ .el-form-item__label {
            line-height: 32px;
        }
    }
    /deep/.el-dialog__body {
        padding-left: 120px;
    }
}

.container {

    .customized-form {
        padding-top: 5px;
        .icon-add {
            border-color: $theme-color;
            color: $theme-color;
        }
    }

    .customized-table {
        /deep/ .el-table__body-wrapper {
            min-height: 500px;
            max-height: 560px;
        }

        /deep/ .el-table tr {
            height: 54px;
        }

        .start, .stop {
            display: inline-block;
            border: 3px solid transparent;
            border-radius: 50%;
            margin-right: 5px;
            position: absolute;
            left: -10px;
            top: 7px;
        }

        .start {
            border-color: #66C23A;
        }

        .stop {
            border-color: #F45858;
        }
    }

    .task {
        /deep/ .el-input__inner {
            border-color: #FF7775;
        }
    }

    .valid {
        position: relative;
    }

    .valid span {
        display: block;
        position: absolute;
        top: 4px;
        left: 0;
        color: #FF7775;
        font-size: 12px;
        line-height: 1;
    }
}

</style>

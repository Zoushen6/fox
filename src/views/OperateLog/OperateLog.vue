<template>
    <div class="setting-box flex-1 overflow-hidden flex-vertical">
        <el-form :model="searchForm"  ref="searchForm" :inline="true" class="customized-form padding-top flex">
            <el-form-item prop="log_time">
                <customized-time-picker
                    class="date-range-without-close-icon time-picker long-item"
                    :date.sync="searchForm.value"
                    :shortcutsSetting="shortcutsSetting"
                    :max-date="0"
                ></customized-time-picker>
            </el-form-item>
            <el-form-item prop="role_id">
                <el-select v-model="searchForm.role_id" placeholder="角色" clearable class="middle-item">
                    <el-option v-for="(item,idx) in memberList" :key="idx" :label="item.role_name" :value="item.role_id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="user_id">
                <el-select v-model="searchForm.user_id" placeholder="用户名称" clearable filterable class="middle-item">
                    <el-option v-for="(item,idx) in userList" :key="item.user_id" :label="item.username" :value="item.user_id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="result">
                <el-select v-model="searchForm.result" placeholder="操作结果" clearable class="middle-item">
                    <el-option v-for="(item,idx) in opResultList" :key="idx" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="operate_content">
                <el-input prefix-icon="el-icon-search" placeholder="请输入操作内容" v-model="searchForm.operate_content" class="middle-item" clearable>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchFn">查询</el-button>
            </el-form-item>
            <el-form-item >
                <el-button @click="resetForm('searchForm')">重置</el-button>
            </el-form-item>
            <el-form-item class="blue-button-style">
                <el-button type="primary" @click="downloadReport">下载日志报表</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格区 -->
        <customized-table
            class="flex-1 overflow-hidden flex-vertical customized-table"
            :loading="loading"
            :Data="logList"
            :Header="header"
            ref="customizedTable"
            :total="total"
            :row-style="{height: '80px'}"
            :page-size="pageSize"
            :current-page="currentPage"
            @size-change="val=>{pageSizeChange(tableLoad,this,val)}"
            @current-change="val=>{pageChange(tableLoad,this,val)}"
        >
            <template v-slot:opResult="{row}">
                <svg-icon :icon-name="row.status?'opsuccess':'opfail'"></svg-icon>
            </template>
        </customized-table>
        <!-- /表格区 -->
    </div>
</template>

<script>

    import PaginationMixin from "@mixins/PaginationMixin";
    import HEADER from "@views/OperateLog/OperateLog.js"
    import InfoFormMixin from "@mixins/InfoFormMixin";
    import common from "@tools/common";
    import TimePickerMixin from "@mixins/TimePickerMixin";
    import {LastSeveralDays} from "@tools/DateUtils";

    export default {
        name: "OperateLog",
        mixins: [PaginationMixin,InfoFormMixin,TimePickerMixin],
        created(){
            this.header = HEADER;
        },
        mounted() {
            this.tableLoad(1); //初次加载table
            this.handleUserList();
        },
        data() {
            return {
                common,
                logList:[],
                searchForm: {
                    value: LastSeveralDays(7,0),
                    role_id:'',
                    user_id:'',
                    result:'',
                    operate_content:''
                },
                opResultList:[
                    {
                        label:'操作成功',
                        value:1
                    },{
                        label:'操作失败',
                        value:0
                    },
                ],
                userList:[]

            }
        },
        methods:{
            axiosTable(page) {
                return this.$http.get("tool/log/index", {
                    params: {
                        stat_start_time: this.searchForm.value.length !== 0 ? this.common.getNewDay(this.searchForm.value[0]) : '',
                        stat_end_time: this.searchForm.value.length !== 0 ? this.common.getNewDay(this.searchForm.value[1]) : '',
                        status:this.searchForm.result,
                        role_id:this.searchForm.role_id,
                        user_id:this.searchForm.user_id,
                        title:this.searchForm.operate_content,
                        page: page,
                        page_size: this.pageSize,
                    }
                });
            },
            //表格初次加载或reload
            tableLoad(numb) {
                this.loading = true;
                this.axiosTable(numb).then((res) => {
                    if (res && res.data.code === 200) {
                        this.total = Number(res.data.data.pagination.total);
                        this.logList = res.data.data.list;
                        this.currentPage = numb
                    }
                }).catch((error) => {
                    console.warn(error);
                }).finally(() => {
                    this.loading = false;
                });
            },

            searchFn(){
                this.tableLoad(1);
            },

            resetForm(formName){
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                    this.searchForm.value = LastSeveralDays(7,0)
                })
            },

            downloadReport(){
                this.$http.get("tool/log/index", {
                    params: {
                        stat_start_time: this.searchForm.value.length !== 0 ? this.common.getNewDay(this.searchForm.value[0]) : '',
                        stat_end_time: this.searchForm.value.length !== 0 ? this.common.getNewDay(this.searchForm.value[1]) : '',
                        status:this.searchForm.result,
                        role_id:this.searchForm.role_id,
                        user_id:this.searchForm.user_id,
                        title:this.searchForm.operate_content,
                        page_size: this.pageSize,
                        is_export: 1,
                    },
                    responseType: 'blob'
                }).then(res => {
                    this.common.downloadFileBlob(res);
                })
            },

            //全部用户
            handleUserList(){
                this.$http.get("user/list").then(res=>{
                    if(res.data.code === 200){
                        this.userList = res.data.data.list;
                    }
                })
            }

        }
    }
</script>

<style scoped lang="scss">

    /deep/.customized-form {
        flex-wrap: wrap;
        .blue-button-style {
            margin-left: auto;
            margin-right: 0;
        }
    }

    /deep/.blue-button-style {
        .el-button--primary {
            background-color: #4063DF;
            border-color: #4063DF;
        }

        .el-button--primary:hover {
            background-color: #6682e5;
            border-color: #6682e5;
        }
    }
</style>

<template>
    <div class="setting-box flex-1 overflow-hidden flex-vertical">
        <!-- 筛选区 -->
        <el-form :inline="true" :model="optionsForm"  ref="optionsForm" class="clear-float customized-form padding-top">
            <el-form-item prop="package_name">
                <el-input prefix-icon="el-icon-search" placeholder="搜索人群" v-model="optionsForm.package_name" class="middle-item" clearable>
                </el-input>
            </el-form-item>
            <el-form-item prop="user_id" class="middle-item">
                <el-select v-model="optionsForm.user_id" placeholder="选择创建者" clearable popper-class="create">
                    <el-option v-for="item in creatorList" :key="item.id" :label="item.username"
                               :value="item.id">
<!--                        字数过长 tooltip显示-->
<!--                            <el-tooltip effect="dark" placement="right" v-if="item.username.length > 20">-->
<!--                                <div slot="content" >{{item.username}}</div>-->
<!--                                <span>{{item.username | handleLength(20)}}</span>-->
<!--                            </el-tooltip>-->
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="dateValue">
                <customized-time-picker
                    class="time-picker long-item"
                    :date.sync="optionsForm.dateValue"
                    :max-date="0"
                    :min-date="minDate"
                ></customized-time-picker>
            </el-form-item>
            <el-form-item>
                <el-button class="short-button" type="primary" @click="searchFn">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button class="short-button" @click="resetForm('optionsForm')">重置</el-button>
            </el-form-item>
            <div v-if="showOperations">
                <el-form-item>
                    <el-button plain @click="createCrowd" class="iconfont icon-add">新建人群</el-button>
                </el-form-item>
                <el-form-item >
                    <el-dropdown  trigger="click" @command="operations">
                        <el-button  :disabled="!isMultiOp" class="push-style iconfont icon-push" plain>批量操作</el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="push" v-if="userTypeRoute&OPERATE_MANAGE_ROUTE_MASK">推送</el-dropdown-item>
                            <el-dropdown-item command="delete" v-if="userTypeRoute&ADMIN_ROUTE_MASK">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
            </div>
        </el-form>
        <!-- 筛选区 -->

        <!-- 表格区 -->
        <customized-table
            class="flex-1 overflow-hidden flex-vertical customized-table"
            :loading="loading"
            :Data="tableData"
            :Header="header"
            :Selection="showOperations"
            ref="customizedTable"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @size-change="val=>{pageSizeChange(tableLoad,this,val)}"
            @current-change="val=>{pageChange(tableLoad,this,val)}"
            @selectionChange="handleSelectionChange"
            @deleteCrowd="deleteCrowd"
            @pushCrowd="pushCrowd"
            @detail="detailCrowd"
            @sort-change="sortChangeHandle"
        >
        </customized-table>
        <!-- /表格区 -->

        <delete-dialog ref="delete" :crowd-id="crowdId" :delete-text="deleteText" :delete-dialog-title="deleteDialogTitle" @success="deleteSuccess" @dialogClose="resetSingleOp"></delete-dialog>

        <push-dialog ref="push" :crowd-id="crowdId" :push-dialog-title="pushDialogTitle"  @success="pushSuccess" @dialogClose="resetSingleOp"></push-dialog>

        <crowd-detail-info ref="detailInfo" :info="crowdInfo" @dialogClose="resetSingleOp"></crowd-detail-info>
    </div>
</template>

<script>

import {mapState} from 'vuex';
import PaginationMixin from "@mixins/PaginationMixin";
import TableMixin from "@mixins/TableMixin";
import InfoFormMixin from "@mixins/InfoFormMixin";
import common from "@tools/common";
import ThrottleMixin from "@mixins/ThrottleMixin";
import _header from "./CrowdList.js"
import {RouteAuthMixin} from "@mixins/ConfigMixin";
import {SETTINGS_MENU_LIST} from "@config/AuthMenu";
import { showOperations } from "./CrowdAuth.js";
import DeleteDialog from "@views/CrowdList/DeleteDialog.vue";
import PushDialog from "@views/CrowdList/PushDialog.vue";
import CrowdDetailInfo from "@views/CrowdList/CrowdDetailInfo.vue";
import {LastSeveralDays} from "@tools/DateUtils";

export default {
    name: "CrowdList",

    mixins: [PaginationMixin,TableMixin,InfoFormMixin, RouteAuthMixin,ThrottleMixin],

    components:{DeleteDialog,PushDialog,CrowdDetailInfo},

    // 数据格式化,
    computed: {
        ...mapState({
            userTypeRoute: state => state.global.userTypeRoute,
        }),

        isMultiOp() {
            return Boolean(this.selectList.length);
        },

        crowdId() {
            if (this.currentRow.id) {
                return [this.currentRow.id];
            }
            return this.selectList;
        },

        showOperations,
    },

    // 生命周期-准备创建dom
    created() {
        // 放在created中,beforeCreate时header等data数据还未创建
        let headerCopy =  [];
        headerCopy = this.common.deepCopy(_header,headerCopy);
        this.header = this.getTitle(headerCopy);
    },

    activated() {
        this.tableLoad(1);
    },

    data() {
        return {
            SETTINGS_MENU_LIST,
            optionsForm: {
                user_id:'',
                package_name:'',
                dateValue: LastSeveralDays(30,0)
            },
            common,
            minDate:365,
            tableData: [],
            selectList:[],
            deleteText:'',
            deleteDialogTitle:'',
            pushDialogTitle:'',
            currentRow:{
                name:'',
            },
            sort:null,
            order:null,
            crowdInfo:[],
        };
    },

    methods: {
        getTitle(titles){
            let arr = [];
            titles.forEach(item=>{
                if(item.auth & this.userTypeRoute){
                    if(item.childSlots){
                        item.childSlots = this.getTitle(item.childSlots);
                    }
                    arr.push(item)
                }
            })
            return arr;
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

        handleSelectionChange(val){
            let arr = val.map(item => item.id)
            this.selectList = arr;
        },

        searchFn() {
            this.tableLoad(1)
        },

        createCrowd() {
            this.$router.push({name:'labelManage'})
        },

        operations(val) {
            this.deleteText = "确定删除所选中人群？";
            this.deleteDialogTitle = "批量删除";
            this.pushDialogTitle = "批量生成定向包";
            this.openDialog(val)
        },

        tableLoad(numb) {
            this.loading = true;
            this.axiosTable(numb).then((res) => {
                if (res && res.data.code === 200) {
                    this.total = Number(res.data.data.pagination.total);
                    this.tableData = res.data.data.list;
                    this.currentPage = numb
                }
            }).catch((error) => {
                console.warn(error);
            }).finally(() => {
                this.loading = false;
            });
        },

        deleteCrowd(row) {
            this.currentRow = row;
            this.deleteText = "确定删除【" + row.package_name + "】?";
            this.deleteDialogTitle = "提示";
            this.openDialog('delete')
        },

        deleteSuccess() {
            this.clearCheck();
            this.resetSingleOp();
            this.tableLoad();
        },

        pushCrowd(row) {
            this.currentRow = row;
            this.pushDialogTitle = '生成定向包';
            this.openDialog('push')
        },

        pushSuccess() {
            this.resetSingleOp();
            this.clearCheck();
        },

        detailCrowd(row) {
            this.openDialog('detailInfo')
            this.$refs.detailInfo.loading = true;
            this.axiosInfo(row.id).then(res => {
                this.crowdInfo = res.data.data.list;
            }).catch(err => {
                console.warn(err);
            }).finally(() => {
                this.$refs.detailInfo.loading = false;
            });
        },

        clearCheck() {
            this.$refs.customizedTable.clearCheck();
        },

        openDialog(op) {
            if (this.$refs[op]) this.$refs[op].openDialog();
        },

        resetSingleOp() {
            this.currentRow = {};
        },

        resetForm(formName) {
                this.$refs[formName].resetFields();
            this.resetSingleOp();
            this.clearCheck();
        },

        axiosTable(page = 1) {
            return this.$http.get("crowd/list", {
                params: {
                    start_date: this.common.getNewDay(this.optionsForm.dateValue[0]),
                    end_date: this.common.getNewDay(this.optionsForm.dateValue[1]),
                    package_name: this.optionsForm.package_name.trim(),
                    user_id: this.optionsForm.user_id,
                    sort: this.sort,
                    order: this.order,
                    page: page,
                    page_size: this.pageSize,
                }
            });
        },

        axiosInfo(id) {
            return this.$http.get("crowd/detail", {params: {id}});
        },
    }
}
</script>

<style scoped lang="scss">
    .iconfont {
        margin-right: 3px;
    }

    /deep/.customized-table {
        .el-table th.el-table__cell {
            padding: 10px 0;
        }
    }

    .create {
        max-width: 100px;
    }

</style>

<template>
    <div class="setting-box flex-1 overflow-hidden flex-vertical">
        <!-- 筛选区 -->
        <el-form :inline="true" :model="optionsForm"  ref="optionsForm" class="clear-float customized-form padding-top">
            <el-form-item prop="package_name">
                <el-input prefix-icon="el-icon-search" placeholder="按定向包名称搜索" v-model="optionsForm.package_name" class="middle-item" clearable>
                </el-input>

            </el-form-item>
            <el-form-item prop="account_name">
                <el-input prefix-icon="el-icon-search" placeholder="按投放账号搜索" v-model="optionsForm.account_name" class="middle-item" clearable>
                </el-input>
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
        </el-form>
        <!-- 筛选区 -->

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
        >
            <template v-slot:status="{row}">
               <span v-if="getStatus(row.status)" :class="getStatus(row.status).style">{{getStatus(row.status).text}}</span>
            </template>
            <template v-slot:button="{row}">
                <el-dropdown  trigger="click" @command="operations" placement="bottom-start">
                    <span class="push" >推送</span>
                    <el-dropdown-menu slot="dropdown" >
                        <el-dropdown-item :command="composeValue('push',row)" >推送到本账户</el-dropdown-item>
                        <el-dropdown-item :command="composeValue('pushOther',row)" >推送到其他账户</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </template>
        </customized-table>
        <!-- /表格区 -->

        <push-dialog ref="push" :package="currentRow" :push-dialog-title="pushDialogTitle"  @success="pushSuccess" @dialogClose="resetSingleOp"></push-dialog>

    </div>
</template>

<script>

import {mapState} from 'vuex';
import PaginationMixin from "@mixins/PaginationMixin";
import TableMixin from "@mixins/TableMixin";
import InfoFormMixin from "@mixins/InfoFormMixin";
import common from "@tools/common";
import ThrottleMixin from "@mixins/ThrottleMixin";
import _header from "./DirectionPackage.js"
import {RouteAuthMixin} from "@mixins/ConfigMixin";
import {SETTINGS_MENU_LIST} from "@config/AuthMenu";
import PushDialog from "@views/DirectionPackage/PushDialog.vue";
import {LastSeveralDays} from "@tools/DateUtils";

export default {
    name: "DirectionPackage",

    mixins: [PaginationMixin,TableMixin,InfoFormMixin, RouteAuthMixin,ThrottleMixin],

    components:{PushDialog},

    // 数据格式化,
    computed: {
        ...mapState({
            userTypeRoute: state => state.global.userTypeRoute,
        }),
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
                account_name:'',
                package_name:'',
                dateValue: LastSeveralDays(30,0)
            },
            common,
            minDate:365,
            tableData: [],
            statusList: {
                '-1': {
                    text: '未推送',
                    style: ''
                },
                '1': {
                    text: '推送中',
                    style: 'color-grey'
                },
                '2': {
                    text: '已推送',
                    style: 'color-green'
                },
                '3': {
                    text: '推送失败',
                    style: 'color-red'
                },
                '4': {
                    text: '已删除',
                    style: ''
                }
            },
            notPushList:['-1'],
            pushingList:['0','1','5','6','8','12','13','14','16','17','18','19','20','21','23','24','25','26','27','28','29','30'],
            pushedList:['2','10','15'],
            pushFailedList:['3','4','7','9','11'],
            pushDialogTitle:'',
            currentRow:{},
            sort:null,
            order:null,
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

        getStatus(status){
            //未推送
            if(this.notPushList.includes(status)){
                return this.statusList["-1"]
            };
            //推送中
            if(this.pushingList.includes(status)){
                return this.statusList['1']
            };
            //已推送
            if(this.pushedList.includes(status)){
                return this.statusList['2']
            };
            //推送失败
            if(this.pushFailedList.includes(status)){
                return this.statusList['3']
            };
            //删除
            if(status === '22'){
                return this.statusList['4']
            };

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

        operations(val) {
            this.currentRow = Object.assign({},val.row);
            if(val.val==='push') {
                this.pushDialogTitle = "推送到本账户";
            }else {
                this.pushDialogTitle = "推送到其他账户";
                this.currentRow.account_id = []
            }
            this.openDialog('push')
        },

        composeValue(val,row){
            return {
                val,
                row
            }
        },

        searchFn() {
            this.tableLoad(1)
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

        pushSuccess() {
            this.resetSingleOp();
        },

        openDialog(op) {
            if (this.$refs[op]) this.$refs[op].openDialog();
        },

        resetSingleOp() {
            this.currentRow = Object.assign({},{account_id:[]});
        },

        resetForm(formName) {
                this.$refs[formName].resetFields();
            this.resetSingleOp();
        },

        axiosTable(page = 1) {
            return this.$http.get("crowd/audience-list", {
                params: {
                    start_date: this.common.getNewDay(this.optionsForm.dateValue[0]),
                    end_date: this.common.getNewDay(this.optionsForm.dateValue[1]),
                    name: this.optionsForm.package_name.trim(),
                    advertiser_id: this.optionsForm.account_name.trim(),
                    sort: this.sort,
                    order: this.order,
                    page: page,
                    page_size: this.pageSize,
                }
            });
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

    .color-grey {
        color: $font-color-auxiliary;
    }

    .color-green {
        color: #40D2C4;;
    }

    .color-red {
        color: #FF7775;
    }

    .push {
        color: $theme-color;
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }

</style>

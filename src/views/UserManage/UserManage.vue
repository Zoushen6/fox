<template>
    <div class="setting-box flex-1 overflow-hidden flex-vertical">

        <!-- 筛选区 -->
        <el-form :inline="true" class="clear-float customized-form padding-top">
            <el-form-item class="middle-item">
                <el-input v-model="account" placeholder="请输入账户名"></el-input>
            </el-form-item>
            <el-form-item class="middle-item">
                <el-select v-model="memberValue" placeholder="角色">
                    <el-option v-for="item in memberList" :key="item.role_id" :label="item.role_name"
                               :value="item.role_id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="middle-item">
                <el-select v-model="statusValue" placeholder="状态">
                    <el-option v-for="item in status" :key="item.id" :label="item.value"
                               :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button class="short-button" type="primary" @click="searchFn">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button class="short-button" @click="resetForm">重置</el-button>
            </el-form-item>
            <el-form-item class="f-r">
                <el-button @click="addNew" plain class="iconfont icon-add">新增账号</el-button>
            </el-form-item>
        </el-form>

        <!-- 筛选区 -->

        <!-- 表格区 -->
        <customized-table
            class="flex-1 overflow-hidden flex-vertical customized-table no-border"
            :loading="loading"
            :Data="tableData"
            :Header="header"
            ref="customizedTable"
            :total="total"
            :has-stripe="true"
            :page-size="pageSize"
            :current-page="currentPage"
            @size-change="val=>{pageSizeChange(tableLoad,this,val)}"
            @current-change="val=>{pageChange(tableLoad,this,val)}"
            @editAccount="editAccount"
            @deleteAccount="deleteAccount"
            @resetPwd="resetPwd"
            @configure="configure"
            @configureCustomer="configureCustomer"
        >
            <template v-slot:status="{row}">
                <el-switch
                    v-model="row.status"
                    inactive-text=""
                    :active-value="0"
                    :inactive-value="1"
                    @change="val=>switchTheRoleStatus(val,row)"
                >
                </el-switch>
            </template>
        </customized-table>
        <!-- /表格区 -->


        <!-- 新增账号弹框 -->
        <customized-dialog
            class="add-new"
            :title="dialogTitle"
            :visible="dialogVisible"
            :show-footer="true"
            :width="600"
            @cancel="resetDialog('addForm')"
            @submit="submitAdd('addForm')"
            @close="resetDialog('addForm')"
        >
            <el-form v-loading="dialogLoading" element-loading-background="transparent" ref="addForm" :model="addForm"
                     :rules="addRules" label-width="100px" label-position="right"
                     class="dialog-body">
                <el-form-item label="账号名称" prop="email">
                    <el-input v-model="addForm.email" :disabled="isEdit" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="用户姓名" prop="username">
                    <el-input v-model="addForm.username" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="用户角色" prop="type">
                    <el-select v-model="addForm.type">
                        <el-option v-for="item in memberList" :key="item.role_id" :label="item.role_name" :value="item.role_id"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </customized-dialog>
        <!-- /新增账号弹框 -->

        <!-- 重置密码成功弹窗-->
        <div class="resetSuccess">
            <customized-dialog
                :title="resetDialogTitleCopy"
                :visible="resetDialogVisibleCopy"
                :width="600"
                @cancel="resetPwdDialogCopy()"
                @close="resetPwdDialogCopy()"
            >
                <el-form :model="resetPwdForm" label-width="80px" label-position="left"
                         class="dialog-body">
                    <el-form-item label="账号名称" prop="username">
                        <el-input v-model="resetPwdForm.username" readonly="readonly"></el-input>
                    </el-form-item>
                    <el-form-item label="账号密码" prop="password">
                        <el-input v-model="resetPwdForm.password" readonly="readonly"></el-input>
                    </el-form-item>
                    <el-form-item label="用户角色" prop="role_name">
                        <el-input v-model="resetPwdForm.role_name" disabled></el-input>
                    </el-form-item>
                </el-form>
            </customized-dialog>
        </div>
        <!-- /重置密码成功弹窗-->

        <!-- 配置广告主 -->
        <div class="advertiser-dialog">
            <customized-dialog
                :title="configureTitle"
                :visible="advertiserDialogVisible"
                :width="800"
                :height="522"
                @cancel="resetAdvertiserDialog"
                @close="resetAdvertiserDialog"
            >
                <div class="advertiser-dialog-header font-16">
                    <span>账号：{{ currentRow.username }}</span>
                    <span class="main-gutter"></span>
                    <span>角色：{{ currentRow.role_name }}</span>
                    <el-input
                        class="search-account"
                        placeholder="请输入搜索的账户名称"
                        prefix-icon="el-icon-search"
                        v-model="advertiserKeyword"
                        @input="handleSearchChange"
                        clearable>
                    </el-input>
                </div>

                <!-- 表格区 -->
                <customized-table
                    class="customized-table"
                    :loading="loadingCopy"
                    :Data="tableDataCopy"
                    :Header="headerCopy"
                    :total="totalCopy"
                    :max-height="null"
                    table-height="522"
                    :page-size="pageSizeCopy"
                    :current-page="currentPageCopy"
                    pagination-layout="total, prev, pager, next, jumper"
                    @current-change="val=>{pageChangeCopy(tableAdLoad,this,val)}"
                >
                    <template v-slot:switch="{row}">
                        <el-switch
                            v-model="row.status"
                            inactive-text="关联"
                            :active-value="1"
                            :inactive-value="0"
                            @change="val=>switchTheStatus(val,row)"
                        >
                        </el-switch>
                    </template>
                    <template v-slot:channel="{row}">
                        <span>{{ channel[row.channel] }}</span>
                    </template>
                </customized-table>
                <!-- /表格区 -->

            </customized-dialog>
        </div>
        <!-- /配置广告主 -->

        <!-- 删除弹窗 -->
        <text-dialog
            ref="deleteAccount"
            :textClass="textDialog.classes"
            :text="textDialog.deleteText"
            :show-footer="true"
            :is-reverse="true"
            @success="subDeleteAccount"
        ></text-dialog>
        <!-- /删除弹窗 -->

        <!-- 重置密码弹窗 -->
        <text-dialog
            ref="resetPwd"
            :textClass="textDialog.classes"
            :text="textDialog.resetPwd"
            :show-footer="true"
            :is-reverse="true"
            @success="subResetAccount"
        ></text-dialog>
        <!-- /重置密码弹窗 -->
    </div>
</template>

<script>
import PaginationMixin from "@mixins/PaginationMixin.js";
import DialogMixin from "@mixins/DialogMixin.js";
import TableMixin from "@mixins/TableMixin.js";
import ThrottleMixin from "@mixins/ThrottleMixin.js";
import InfoFormMixin from "@mixins/InfoFormMixin.js";
import _header from "@views/UserManage/UserManage.js"
import {advHeader, customerHeader} from "@views/UserManage/UserAd.js"
import {RouteAuthMixin} from "@mixins/ConfigMixin.js";
import TextDialog from "@/components/dialog/TextDialog.vue";

export default {
    mixins: [PaginationMixin, DialogMixin, TableMixin, ThrottleMixin, InfoFormMixin, RouteAuthMixin],

    components: {TextDialog},

    // 初始化数据
    data() {
        let checkEmail = (rule, value, callback) => {
            const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
            if (!value) {
                return callback(new Error('邮箱不能为空'))
            }
            if (mailReg.test(value)) {
                callback()
            } else {
                callback(new Error('请输入正确的邮箱格式'))
            }
        };

        return {
            textDialog: {
                deleteText: '',
                resetPwd: '确定要重置该用户密码吗？',
                classes: ''
            },
            configureTitle: '',
            account: '',
            memberValue: "",
            memberList: [
                {
                    role_id: 1,
                    role_name: '管理员'
                },
                {
                    role_id: 2,
                    role_name: '运营'
                },
                {
                    role_id: 3,
                    role_name: '客户'
                }
            ],
            statusValue: "",
            status: [
                {
                    value: "已启用",
                    id: 0,
                },
                {
                    value: "已禁用",
                    id: 1,
                }
            ],
            isEdit: false,
            dialogLoading: false,
            resetDialogTitleCopy: '重置密码成功',
            resetDialogVisibleCopy: false,
            advertiserDialogVisible: false,
            advertiserKeyword: '',
            //新增弹框form数据
            addForm: {
                username: '',
                email: '',
                type: '',
                role_id: '',
            },
            channel: {
                1: "头条",
                2: "快手"
            },
            //新增弹框form条件规则
            addRules: {
                email: [
                    {required: true, validator: checkEmail},
                ],
                username: [
                    {required: true, message: "姓名不能为空"},
                ],
                type: [
                    {required: true, message: "请选择角色"}
                ]
            },
            //新增弹窗角色下拉框
            currentRow: {
                username: '',
                // email: '',
                role_name: '',
                type: '',
                role_id: '',
                user_id: ''
            },
            resetPwdForm: {
                username: '',
                password: '',
                role_name: ''
            },
        }

    },

    deactivated() {
        this.advertiserKeyword = '';
    },

    // 方法集合
    methods: {

        //打开弹窗
        openDialog(dialog) {
            if (this.$refs[dialog]) this.$refs[dialog].openDialog();
        },

        //关闭弹窗
        closeDialog(dialog) {
            if (this.$refs[dialog]) this.$refs[dialog].closeDialog();
        },


        //查询
        searchFn() {
            this.tableLoad(1);
        },

        //重置
        resetForm() {
            this.account = '';
            this.memberValue = "";
            this.statusValue = "";
        },

        //点击编辑
        editAccount(row) {
            this.dialogTitle = '编辑';
            this.isEdit = true;
            this.addForm.user_id = row.user_id;
            this.dialogVisible = true;
            this.dialogLoading = true;
            // 请求用户信息
            this.axiosUserInfo(row.user_id).then((res) => {
                if (res && res.data.code === 200) {
                    this.addForm.email = res.data.data.email;
                    this.addForm.type = res.data.data.role_id;
                    this.addForm.role_id = res.data.data.role_id;
                    this.addForm.username = res.data.data.username;
                }
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                this.dialogLoading = false;
            })
        },

        //点击删除
        deleteAccount(row) {
            this.currentRow = row;
            this.textDialog.deleteText = '确定删除账号【' + `${row.username}` + '】吗？'
            this.textDialog.classes = 'iconfont icon-warning';
            this.openDialog('deleteAccount')
        },

        //确认删除
        subDeleteAccount() {
            this.axiosDelete(this.currentRow.user_id).then((res) => {
                if (res.data.code === 200) {
                    this.$message({
                        message: "删除账号成功",
                        type: "success"
                    })
                }
            }).catch((error) => {
                console.warn(error);
            }).finally(() => {
                Object.keys(this.currentRow).forEach(key => {
                    this.currentRow[key] = ''
                })
                this.closeDialog('deleteAccount');
                this.tableLoad(1);//重新加载表格
            })
        },

        //点击重置密码
        resetPwd(row) {
            this.currentRow = row;
            this.textDialog.classes = 'iconfont icon-warning';
            this.openDialog('resetPwd')
        },

        subResetAccount() {
            this.axiosReset(this.currentRow.user_id).then((res) => {
                if (res.data.code === 200) {
                    this.resetPwdForm = res.data.data;
                }
            }).catch((error) => {
                console.warn(error);
            }).finally(() => {
            })
            this.resetDialogVisibleCopy = true
        },

        //点击配置广告主
        configure(row) {
            this.headerCopy = advHeader;
            this.configureTitle = '配置广告主';
            this.advertiserDialogVisible = true;
            this.currentRow = row;
            this.tableAdLoad(1);
        },

        //点击配置客户
        configureCustomer(row) {
            this.headerCopy = customerHeader;
            this.configureTitle = '配置客户';
            this.advertiserDialogVisible = true;
            this.currentRow = row;
            this.tableAdLoad(1);
        },

        //关联
        switchTheStatus(val, row) {
            let id = this.configureTitle === '配置客户' ? row.customer_id : row.advertiser_id;
            let status = row.status ? 1 : 0;
            this.axiosSwitchStatus(id, row.channel, status).then(res => {
                if (res.data.code === 200) {
                    row.status === 1 ? this.$message.success('关联成功！') : this.$message.error('取消关联！');
                }
            }).catch((error) => {
                console.log(error)
            }).finally(()=>{})
        },

        switchTheRoleStatus(val, row) {
            let status = row.status;
            this.axiosSwitchRoleStatus(row.user_id, status).then(res => {
                if (res.data.code === 200) {
                    if (status === 1) {
                        this.$message({message: '账号：' + row.username + ' 已禁用', type: 'error'});
                    } else {
                        this.$message({message: '账号：' + row.username + ' 已启用', type: 'success'});
                    }
                }
            }).catch((error) => {
                console.log(error)
            })
        },

        //配置广告主搜索节流
        handleSearchChange() {
            this.throttle(this.tableAdLoad, this, 500, this.currentPageCopy);
        },

        //表格数据请求参数
        /**
         *
         * @param page
         * @returns {Promise<AxiosResponse<any>>}
         */
        axiosTable(page) {
            return this.$http.get("user/list", {
                params: {
                    page: page,
                    page_size: this.pageSize,
                    role_id: this.memberValue,
                    status: this.statusValue,
                    username: this.account.trim(),
                }
            });
        },

        //点击编辑请求用户信息
        axiosUserInfo(id) {
            return this.$http.get("user/info", {
                params: {
                    user_id: id,
                }
            });
        },

        //添加用户
        axiosAdd() {
            return this.$http.post("user/register", {
                email: this.addForm.email.trim(),
                username: this.addForm.username.trim(),
                type: this.addForm.role_id,
                role_id: this.addForm.role_id,
            });
        },

        //编辑用户
        axiosEdit() {
            return this.$http.post("user/edit", {
                username: this.addForm.username,
                user_id: this.addForm.user_id,
                role_id: this.addForm.type,
            });
        },

        //删除用户
        axiosDelete(id) {
            return this.$http.post("user/delete", {
                user_id: id,
            });
        },

        axiosReset(id) {
            return this.$http.post("user/reset-passwd-by-admin", {
                user_id: id,
            });
        },

        //广告主列表
        axiosAdTable(page) {
            let httpUrl = this.configureTitle === '配置客户' ? 'user/customer/list':'user/advertiser/list';
            return this.$http.get(httpUrl, {
                    params: {
                        page_size: this.pageSizeCopy,
                        user_id: this.currentRow.user_id,
                        bind: 1,
                        page: page,
                        search: this.advertiserKeyword
                    }
                }
            );
        },

        //关联
        axiosSwitchStatus(id, channel, status) {
            let bindUrl = this.configureTitle === '配置客户' ? 'user/customer/bind' : 'user/company/bind';
            return this.$http.post(bindUrl, {
                user_id: this.currentRow.user_id,
                company_id: id,
                customer_id: id,
                channel,
                action: status
            });
        },

        //禁用
        axiosSwitchRoleStatus(user_id, status) {
            return this.$http.post("user/state", {
                user_id: user_id,
                status: status
            });
        },

        //表格初次加载或reload
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

        //配置广告主表格初次加载或reload
        tableAdLoad(numb) {
            this.loadingCopy = true;
            this.axiosAdTable(numb).then((res) => {
                if (res && res.data.code === 200) {
                    this.totalCopy = Number(res.data.data.pagination.total);
                    this.tableDataCopy = res.data.data.list;
                    this.currentPageCopy = numb;
                }
            }).catch((error) => {
                console.warn(error);
            }).finally(() => {
                this.loadingCopy = false;
            });
        },

        //打开新增弹框
        addNew() {
            this.dialogVisible = true;
            this.dialogTitle = '新增账号';
        },

        submitFormAdd() {
            this.axiosAdd().then((res) => {
                if (res.data.code === 200) {
                    this.$message({
                        message: "已成功添加账号,密码已发送邮箱",
                        type: "success"
                    })
                }
            }).catch(res => {
                console.warn(res);
            }).finally(() => {
                this.resetDialog('addForm')
                this.tableLoad(1);//重新加载表格
            });
        },

        submitFormEdit() {
            this.axiosEdit().then((res) => {
                if (res.data.code === 200) {
                    this.$message({
                        message: "编辑账号成功",
                        type: "success"
                    })
                }
            }).catch((error) => {
                console.warn(error);
            }).finally(() => {
                this.resetDialog('addForm')
                this.isEdit = false;
                this.tableLoad(1);//重新加载表格
            })
        },

        //添加账号提交
        submitAdd(formName) {
            //role_id的值与type[0]相同
            this.addForm.role_id = this.addForm.type;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.dialogVisible = false;
                    if (this.dialogTitle == "新增账号")
                        this.submitFormAdd();
                    else
                        this.submitFormEdit();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        //关闭弹框后，删除验证
        resetDialog(formName) {
            if (this.$refs[formName]) this.$refs[formName].resetFields();
            this.dialogVisible = false;
            this.isEdit = false;
            Object.keys(this.addForm).forEach(key => {
                this.addForm[key] = ''
            })
        },

        resetPwdDialogCopy() {
            this.resetDialogVisibleCopy = false;
            this.closeDialog('resetPwd')
        },

        resetAdvertiserDialog() {
            this.advertiserKeyword = '';
            this.advertiserDialogVisible = false
        },
    },

    // 生命周期-准备创建dom
    created() {
        // 放在created中,beforeCreate时header等data数据还未创建
        this.header = _header;
    },

    // 生命周期-dom创建之后
    activated() {
        //初次加载table
        this.tableLoad(1);
    },
}
</script>

<style lang="scss" scoped>

/deep/ .customized-table {
    .el-switch.is-checked .el-switch__core {
        border-color: #4CBD42;
        background-color: #4CBD42;
    }
    .el-table th.el-table__cell {
        padding: 15px 0;
    }
}

/deep/ .customized-form {

}


/deep/ .el-form-item__label {
    line-height: 32px;
}

/deep/ .dialog-body .el-form-item__label {
    font-size: $font-size-base;
}

/deep/ .el-dialog__body {
    padding: 33px 109px 0 85px
}

.resetSuccess {
    /deep/ .el-dialog__body {
        padding: 33px 109px 32px 101px
    }
}

.advertiser-dialog {
    /deep/ .el-dialog__body {
        padding: 17px 24px 17px 24px
    }
}

.advertiser-dialog-header {
    box-sizing: border-box;
    margin-bottom: 17px;

    /deep/ .el-input__inner {
        width: 225px;
        height: 32px;
    }

    .search-account {
        width: auto;
        float: right;
        font-size: $font-size-addition;
        margin-top: -4px;
    }

    /deep/ .el-input__icon {
        line-height: 34px;
    }
}

/deep/ .el-switch {
    left: -4.5px;
}

/deep/ .el-switch__label.is-active {
    color: #333333;
}

/deep/ .el-pagination .el-select .el-input .el-input__inner {
    width: 100px;
    height: 28px;
}

/deep/ .el-pagination__editor.el-input .el-input__inner {
    width: 47px;
}

/deep/ .el-pager li {
    font-weight: $font-weight-base;
}

/*新增弹窗formItem宽度没有百分百*/
/deep/ .add-new {
    .el-cascader, .el-select {
        display: block;
    }
}
</style>

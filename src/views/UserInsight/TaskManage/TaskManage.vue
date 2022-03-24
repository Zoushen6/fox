<template>
    <div class="setting-box flex-1 flex-vertical">

        <!-- 筛选区 -->
        <el-form :inline="true" :model="searchForm"  ref="searchForm" class="clear-float customized-form padding-top">
            <el-form-item prop="inputValue" :required="false" class="search-content">
                <el-input placeholder="请输入所要查询的内容" v-model="searchForm.inputValue"
                          class="long-item input-with-select">
                    <el-select v-model="searchForm.selectValue" slot="prepend" placeholder="选择类型" clearable>
                        <el-option v-for="item in selectType" :key="item.id" :label="item.value"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-input>
            </el-form-item>
            <el-form-item prop="search_get_type" class="middle-item">
                <el-select v-model="searchForm.search_get_type" placeholder="查询方式">
                    <el-option v-for="(val,key) in searchWay" :key="key" :label="key"
                               :value="val"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button class="short-button" type="primary" @click="searchFn">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button class="short-button" @click="resetForm('searchForm')">重置</el-button>
            </el-form-item>
            <div>
                <el-form-item >
                    <el-button @click="addNew" plain class="iconfont icon-add" >新建任务</el-button>
                </el-form-item>
            </div>
        </el-form>

        <!-- 筛选区 -->

        <!-- 表格区 -->
        <customized-table
            class="flex-1 customized-table"
            :loading="loading"
            :Data="tableData"
            :Header="header"
            ref="customizedTable"
            :total="total"
            :scroll-in-table="false"
            :page-size="pageSize"
            :current-page="currentPage"
            @size-change="val=>{pageSizeChange(tableLoad,this,val)}"
            @current-change="val=>{pageChange(tableLoad,this,val)}"
            @editAccount="editAccount"
            @deleteAccount="deleteAccount"
            @sort-change="sortChangeHandle"
        >
        </customized-table>
        <!-- /表格区 -->


        <!-- 新增弹框 -->
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
                <el-form-item label="任务ID" prop="task_id">
                    <el-input v-model="addForm.task_id" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="任务名称" prop="task_name" >
                    <el-input v-model="addForm.task_name" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="查询方式" prop="get_type" class="search-way">
                    <el-checkbox-group v-model="addForm.get_type">
                        <el-checkbox label="1" >{{'实时RTA'}}</el-checkbox>
                        <el-checkbox label="2" @change="handleCheck">{{'离线OSS'}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item prop="oss_id" v-if="showOss">
                    <el-input v-model="addForm.oss_id" placeholder="填写OSS ID" maxlength="15"></el-input>
                </el-form-item>
                <el-form-item label="任务备注" prop="task_desc">
                    <el-input v-model="addForm.task_desc" maxlength="50"></el-input>
                </el-form-item>
            </el-form>
        </customized-dialog>
        <!-- /新增弹框 -->

        <!-- 删除弹窗 -->
        <text-dialog
            ref="deleteAccount"
            :text-class="textDialog.classes"
            :text="textDialog.deleteText"
            :show-footer="true"
            :is-reverse="true"
            @success="subDeleteAccount"
            @dialogClose='closeDialog'
        ></text-dialog>
        <!-- /删除弹窗 -->

    </div>
</template>

<script>
import DialogMixin from "@mixins/DialogMixin";
import InfoFormMixin from "@mixins/InfoFormMixin";
import {header,planList} from "./TaskManage.js"
import {RouteAuthMixin} from "@mixins/ConfigMixin";

import TextDialog from "@/components/dialog/TextDialog";
import PaginationMixin from "@mixins/PaginationMixin";
import {LastSeveralDays} from "@tools/DateUtils";

export default {
    mixins: [DialogMixin,InfoFormMixin, PaginationMixin,RouteAuthMixin],

    components: {TextDialog},

    // 初始化数据
    data() {

        let checkOss = (rule, value, callback) => {
            const mailReg = /^[0-9]+?[0-9]*$/;
            if (!value) {
                return callback(new Error('请输入OSS ID'))
            }
            if (value == 0) {
                return callback(new Error('OSS ID不能为0'))
            }
            if (mailReg.test(value)) {
                callback()
            } else {
                callback(new Error('OSS ID必须为数字'))
            }
        };

        let checkId = (rule, value, callback) => {
            const mailReg = /^[0-9]+?[0-9]*$/;
            if (!value) {
                return callback(new Error('请输入任务ID'))
            }
            if (value == 0) {
                return callback(new Error('任务ID不能为0'))
            }
            if (mailReg.test(value)) {
                callback()
            } else {
                callback(new Error('任务ID必须为数字'))
            }
        };

        return {
            searchForm: {
                inputValue:'',
                selectValue:'search_task_id',
                search_get_type:''
            },
            selectType:planList,
            textDialog: {
                deleteText: '',
                classes:''
            },
            searchWay: {
                "实时RTA" : '1',
                "离线OSS" : '2',
                "RTA,OSS" : '3',
            },
            isEdit: false,
            dialogLoading: false,
            resetDialogTitleCopy: '重置密码成功',
            resetDialogVisibleCopy: false,
            advertiserDialogVisible: false,
            advertiserKeyword: '',
            //新增弹框form数据
            addForm: {
                task_id:'',
                task_name:'',
                get_type:[],
                oss_id:'',
                task_desc:'',
                id:''
            },
            showOss:false,
            //新增弹框form条件规则
            addRules: {
                task_id: [
                    {required: true,validator: checkId}
                ],
                task_name: [
                    {required: true, message: "任务名不能为空"}
                ],
                get_type: [
                    {required: true, message: "请选择查询方式"}
                ],
                oss_id: [
                    {required: true, validator: checkOss}
                ]
            },
            //新增弹窗角色下拉框
            addOptions: [],
            currentRow: {
                id:''
            },
            order: null,
            sort: null,
        }
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

        handleCheck(val) {
            this.showOss = val
            if(!val) {
                this.addForm.oss_id = ''
            }
        },

        sortChangeHandle(data){
            if (data.order) {
                this.order = data.prop;
                this.sort = data.order === 'descending' ? 'desc' : 'asc';
            } else {
                this.order = null;
                this.sort = null;
            }
            this.tableLoad();
        },

        //查询
        searchFn() {
            this.tableLoad(1);
        },

        //重置
        resetForm(formName) {
            this.$nextTick(() => {
                if (this.$refs[formName]) this.$refs[formName].resetFields();
                this.searchForm.selectValue = 'search_task_id';
            })
            // this.searchForm.inputValue = '';
            // this.searchForm.search_get_type = '';
        },

        //点击编辑
        editAccount(row) {
            this.dialogTitle = '编辑';
            this.isEdit = true;
            this.dialogVisible = true;
            this.dialogLoading = true;
            this.addForm.id = row.id;
            // 请求用户信息
            this.axiosUserInfo(row.id).then((res) => {
                if (res && res.data.code === 200) {
                    this.addForm.task_id = res.data.data.list.task_id;
                    this.addForm.task_name = res.data.data.list.task_name;
                    if(res.data.data.list.get_type === 3) {
                        this.addForm.get_type = ['1','2'];
                    }else {
                        this.addForm.get_type = String(res.data.data.list.get_type).split('');
                    }
                    if(res.data.data.list.oss_id) {
                        this.showOss = true;
                    }
                    this.addForm.oss_id = res.data.data.list.oss_id?res.data.data.list.oss_id:'';
                    this.addForm.task_desc = res.data.data.list.task_desc;
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
            this.textDialog.deleteText = '确定删除任务【'+`${row.task_id}` + '  ' + `${row.task_name}`+'】吗？'
            this.textDialog.classes = 'iconfont icon-warning';
            this.openDialog('deleteAccount')
        },

        //确认删除
        subDeleteAccount() {
            this.axiosDelete(this.currentRow.id).then((res) => {
                if (res.data.code === 200) {
                    this.$message({
                        message: "删除账号成功",
                        type: "success"
                    })
                }
            }).catch((error) => {
                console.warn(error);
            }).finally(() => {
                this.closeDialog('deleteAccount')
                Object.keys(this.currentRow).forEach(key => {
                    this.currentRow[key] = ''
                })
                this.tableLoad(1);//重新加载表格
            })
        },

        //表格数据请求参数
        /**
         *
         * @param page
         * @returns {Promise<AxiosResponse<any>>}
         */
        axiosTable(page) {
            return this.$http.get("task/list", {
                params: {
                    [this.searchForm.selectValue]:this.searchForm.inputValue,
                    search_get_type:this.searchForm.search_get_type,
                    sort: this.sort,
                    order: this.order,
                    page: page,
                    page_size: this.pageSize,
                }
            });
        },

        //添加用户
        axiosAdd() {
            return this.$http.post("task/create", {
                task_id: this.addForm.task_id,
                task_name: this.addForm.task_name,
                get_type: this.addForm.get_type.length ==2 ? 3 : this.addForm.get_type.join(','),
                task_desc: this.addForm.task_desc,
                oss_id: this.addForm.oss_id,
            });
        },

        //点击编辑请求用户信息
        axiosUserInfo(id) {
            return this.$http.get("task/detail", {
                params: {
                    id: id,
                }
            });
        },

        //编辑用户
        axiosEdit() {
            return this.$http.post("task/update", {
                task_id: this.addForm.task_id,
                task_name: this.addForm.task_name,
                get_type: this.addForm.get_type.length ==2 ? 3 : this.addForm.get_type.join(','),
                task_desc: this.addForm.task_desc,
                oss_id: this.addForm.oss_id,
                id: this.addForm.id
            });
        },

        //删除用户
        axiosDelete(id) {
            return this.$http.post("task/delete", {
                id: id,
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


        //打开新增弹框
        addNew() {
            this.dialogVisible = true;
            this.dialogTitle = '新建任务';
        },

        submitFormAdd() {
            this.axiosAdd().then((res) => {
                if (res.data.code === 200) {
                    this.$message({
                        message: "已成功新建任务",
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
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.dialogVisible = false;
                    if (this.dialogTitle == "新建任务")
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
            this.showOss = false;
        },
    },

    // 生命周期-准备创建dom
    created() {
        // 放在created中,beforeCreate时header等data数据还未创建
        this.header = header;
    },

    // 生命周期-dom创建之后
    activated() {
        //初次加载table
        this.tableLoad(1);
    },

    deactivated() {
        this.resetForm();
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
        padding: 10px 0;
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
    .search-way {
        .el-checkbox {
            display: block;
            &:not(:last-child) {
                margin-bottom: 6px;
            }
        }
        .el-form-item__content {
            line-height: 33px;
        }
        margin-bottom: 15px;
    }

    .oss-input {

    }
}
</style>

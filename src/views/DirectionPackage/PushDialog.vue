<template>
    <!--推送弹窗-->
    <customized-dialog
        :title="pushDialogTitle"
        class="customized-dialog"
        :visible="dialogVisible"
        :width="600"
        :showFooter="true"
        :showCancel="false"
        :confirm-text="'确认加入账户'"
        @cancel="closeDialogHandler"
        @submit="subSend('addForm')"
        @close="closeDialogHandler"
    >
        <el-form element-loading-background="transparent" ref="addForm" :model="addForm" :rules="addRules"
                 label-width="120px" label-position="right"
                 class="dialog-form">
            <el-form-item label="定向包名称:" prop="name">
                <span>{{addForm.name}}</span>
            </el-form-item>
            <el-form-item label="定向包所属账户:" prop="account">
                <span>{{addForm.account}}</span>
            </el-form-item>
            <el-form-item v-if="pushDialogTitle==='推送到本账户'" label="推送至:" prop="account">
                <span>{{addForm.account}}</span>
            </el-form-item>
            <el-form-item v-else label="推送至:" prop="account_id">
                <el-select
                    v-model="addForm.account_id"
                    filterable
                    remote
                    multiple
                    :popper-append-to-body="false"
                    :remote-method="headLineSearch"
                    @visible-change="headLineSearch('')"
                    v-loadmore="headLineScroll"
                    placeholder="选择账户ID">
                    <el-option
                        v-for="(item,index) in optionsHeadlineAccount"
                        :key="item.account_id"
                        :label="item.account_name"
                        :value="item.account_id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </customized-dialog>
    <!--/推送弹窗-->
</template>

<script>
import DialogMixin from "@mixins/DialogMixin";
import {isArray} from "lodash";

export default {
    name: "PushDialog",

    mixins:[DialogMixin],

    props: {
        package: {
            type:Object,
            default: function () {
                return {
                    id:'',
                    account_id:[],
                    status:'',
                }
            }
        },
        pushDialogTitle:String
    },

    watch: {
        package: {
            handler: function (val) {
                this.addForm.account_id = isArray(val.account_id)?val.account_id:[val.account_id];
                this.addForm.account = val.account;
                this.addForm.name = val.name;
                this.addForm.custom_audience_id = val.custom_audience_id;
            },
        },
    },

    data() {
        return {
            addForm: {
                name:'',
                account:'',
                account_id: [],
                custom_audience_id:''
            },
            addRules: {
                account_id: [
                    {required: true, message: "投放账户不能为空"}
                ],
            },
            optionsHeadlineAccount: [],
            advertiserKey: "",
            curAdvertiserPage: 0,
            totalAdvertiser: 0
        }
    },

    methods: {
        headLineSearch(val) {
            this.optionsHeadlineAccount = [];
            this.advertiserKey = val;
            this.headLineChange(val);
        },

        //选择账户下拉
        headLineChange(key = '', page = 1) {
            this.$http.get("/crowd/account-list", {
                params: {
                    page: page,
                    page_size: 10,
                    search: key,
                    channel: 1,
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.curAdvertiserPage = res.data.data.pagination.current_page;
                    this.totalAdvertiser = res.data.data.pagination.page_count;
                    this.optionsHeadlineAccount.push(...res.data.data.list);
                }
            })
        },

        headLineScroll() {
            if (this.totalAdvertiser < (this.curAdvertiserPage + 1)) return;
            this.headLineChange(this.advertiserKey, this.curAdvertiserPage + 1);
        },

        //确认推送
        subSend(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.axiosSend(this.addForm.custom_audience_id).then((res) => {
                        if (res.data.code === 200) {
                            this.$message({
                                message: "推送成功",
                                type: "success"
                            });
                            this.$emit("success");
                            this.$refs[formName].resetFields();
                            this.closeDialog();
                        }
                    }).catch((error) => {
                        console.warn(error);
                    }).finally(() => {
                    })
                }
            })
        },

        axiosSend(custom_audience_id) {
            return this.$http.post("crowd/audience-push",
                {
                    account_id: this.addForm.account_id.join(","),
                    channel: 1,
                    custom_audience_id
                })
        },

        closeDialogHandler() {
            this.$refs.addForm.resetFields();
            this.closeDialog();
        }
    }
}
</script>

<style scoped lang="scss">
   /deep/.dialog-form {
       .el-form-item {
           margin-bottom: 12px;
       }
   }
</style>

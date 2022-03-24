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
                 label-width="100px" label-position="right"
                 class="dialog-form">
            <el-form-item label="渠道" prop="channel">
                <el-select v-model="addForm.channel" placeholder="请选择">
                    <el-option
                        v-for="item in channels"
                        :key="item.item"
                        :label="item.item"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="账户" prop="account_id" v-show="addForm.channel">
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
                        :key="index"
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

export default {
    name: "PushDialog",

    mixins:[DialogMixin],

    props: {
        crowdId: Array,
        pushDialogTitle:String
    },

    data() {
        return {
            addForm: {
                channel: '',
                account_id: [],
            },
            addRules: {
                channel: [
                    {required: true, message: "渠道不能为空"}
                ],
                account_id: [
                    {required: true, message: "投放账户不能为空"}
                ],
            },
            optionsHeadlineAccount: [],
            channels: [
                {
                    item: "头条数据",
                    id: 1
                },
                // {
                //     item: "快手数据",
                //     id: 2
                // },
                // {
                //     item: "广点通",
                //     id: 3
                // },
                // {
                //     item: "DSP",
                //     id: 4
                // },
            ],
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
                    channel: this.addForm.channel,
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
                    this.axiosSend(this.crowdId.join(",")).then((res) => {
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
                    })
                }
            })
        },

        axiosSend(id) {
            return this.$http.post("crowd/push",
                {
                    account_id: this.addForm.account_id.join(","),
                    channel: this.addForm.channel,
                    id
                })
        },

        closeDialogHandler() {
            this.$refs.addForm.resetFields();
            this.closeDialog();
        }
    }
}
</script>

<style scoped>

</style>

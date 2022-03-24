<template>
    <!-- 删除弹窗-->
    <customized-dialog
        class="customized-dialog"
        :title="deleteDialogTitle"
        :visible="dialogVisible"
        :show-footer="true"
        :is-reverse="true"
        :append-to-body="true"
        :width="507"
        @cancel="closeDialog"
        @close="closeDialog"
        @submit="subDelete"
    >
        <p class="iconfont icon-warning">{{deleteText}}</p>
    </customized-dialog>
    <!-- /删除弹窗-->
</template>

<script>
import DialogMixin from "@mixins/DialogMixin";
export default {
    name: "DeleteDialog",

    mixins:[DialogMixin],

    props: {
        crowdId: Array,
        deleteText:String,
        deleteDialogTitle:String
    },

    methods: {
        subDelete() {
            this.axiosDelete(this.crowdId.join(",")).then((res) => {
                if (res.data.code === 200) {
                    this.$message({
                        message: "删除成功",
                        type: "success"
                    });
                    this.closeDialog();
                    this.$emit('success');
                }
            }).catch((error) => {
                console.warn(error);
            }).finally(() => {
            });
        },

        axiosDelete(id) {
            return this.$http.post("crowd/delete", {id});
        },
    }
}
</script>

<style scoped>

</style>

<template>
    <customized-dialog
        :visible="dialogVisible"
        class="text-dialog"
        :title="title"
        :show-footer="showFooter"
        :is-reverse="isReverse"
        :width="500"
        @cancel="closeDialog"
        @submit="$emit('success')"
        @close="closeDialog"
    >
        <p class="text-desc" :class="textClass">{{text}}</p>
    </customized-dialog>
</template>

<script>
    import DialogMixin from "@mixins/DialogMixin";
    export default {
        name: "TextDialog",

        mixins: [DialogMixin],

        props: {
            showFooter: {
                type: Boolean,
                default: false
            },
            showCancel:{
                type: Boolean,
                default: false
            },
            isReverse: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: "提示"
            },
            textClass: {
                type: String,
                default: ""
            },
            text: {
                type: String,
                default: ""
            }
        }
    }
</script>

<style scoped lang="scss">
.text-dialog {
    /deep/ .el-dialog__body {
        padding: 33px 25px 30px 25px;
    }
}
</style>

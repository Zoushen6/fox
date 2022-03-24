<template>
    <!-- 新增编辑用户弹框 -->
    <el-dialog :title="title"
               :visible.sync="visibility"
               :width="width+'px'"
               @open="$emit('open')"
               :center="center"
               :custom-class="customClass"
               :append-to-body="appendToBody"
               :modal="modal"
               :close-on-click-modal="clickModal"
               :class="headerClass"
               @opened="()=>{$emit('opened')}"
               :before-close="done=>{$emit('close');done();}"
               @closed="()=>{$emit('after-close')}">
        <slot name="title" slot="title"></slot>
        <slot></slot>
        <div v-if="showFooter" name="footer" slot="footer" class="dialog-footer text-right" >
            <el-button v-if="showSubmit" type="primary" @click="$emit('submit')" size="small" :class="isReverse ? 'reverse' : ''">{{confirmText}}</el-button>
            <el-button v-if="showCancel" @click="cancel" size="small">取 消</el-button>
        </div>
    </el-dialog>
    <!-- /新增编辑用户弹框 -->
</template>

<script>
    export default {
        name: "CustomizedDialog",
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            center: {
                type: Boolean,
                default: false
            },
            showFooter:{
                type: Boolean,
                default: false
            },
            showSubmit:{
                type: Boolean,
                default: true
            },
            showCancel:{
                type: Boolean,
                default: true
            },
            appendToBody: {
                type: Boolean,
                default: false
            },
            isReverse: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: '提示'
            },
            confirmText : {
                type: String,
                default: '确 认'
            },
            customClass: {
                type: String,
            },
            width: {
                type:Number,
                default:420
            },
            modal: {
                type: Boolean,
                default: true
            },
            clickModal: {
                type: Boolean,
                default: true
            },
        },
        watch:{
            visibility:function (val) {
                this.$emit('update:visible', val);
            },
            visible:function (val) {
                this.visibility = val;
            }
        },
        computed: {
            headerClass(){
                return this.title ? "dialog-header-border" : "";
            }
        },
        data(){
            return {
                visibility: false
            }
        },
        methods:{
            cancel(){
                this.visibility = false;
                this.$emit('cancel')
            }
        }
    }
</script>

<style scoped lang="scss">


/deep/ .el-dialog__header {
    padding: 24px 16px 16px 24px;

    .el-dialog__title {
        letter-spacing: 1px;
        font-weight: bold;
        font-size: $font-size-headings;
    }
}

.reverse {
    float: right;
    margin-left: 10px;
}

/deep/.el-dialog__footer {
    padding: 0 24px 24px 24px;
    .el-button--small {
        font-size: $font-size-base;
    }
}

/deep/ .el-dialog__body {
    color: $font-color-base;
    padding: 24px ;
}

</style>

<template>
    <div class="foo">
        <el-popover
            v-if="isHover"
            placement="top"
            width="60"
            trigger="hover"
        >
            <el-button
                type="text"
                icon="el-icon-document-copy"
                @click="copy"
            >
                复制
            </el-button>
            <slot slot="reference"><span :class="'ell-'+row">{{context}}</span></slot>
        </el-popover>
        <span v-else @click="copy" class="copy" :class="'ell-'+row">{{context}}</span>
    </div>
</template>

<script>
    export default {
        name: "CustomizedClipboard",
        props: {
            context: {
                type: [String,Array]
            },
            row: {
                type: Number,
                default: 1,
                validator: function (value) {
                    return value > 0 && value < 5;
                }
            },
            isHover: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            copy() {
                this.$copyText(this.context).then(e => {
                    this.$message("复制成功！");
                }, e => {
                    this.$message("复制失败...");
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .copy {
        cursor: pointer;
    }
</style>
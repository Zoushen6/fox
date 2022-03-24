<template>
    <div class="padding-top m-l-r-16 container flex background-white">
        <el-tabs class="flex-vertical flex-1 overflow-hidden" v-model="activeName">
            <el-tab-pane label="计算数据" name="data">
                <operation-data ref="operationDate"></operation-data>
            </el-tab-pane>
            <el-tab-pane label="计算规则" name="rules">
                <operation-rule class="p-l-r-24"></operation-rule>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import OperationData from "@views/UserInsight/CalculationRules/Datas/OperationDatas.vue";
import OperationRule from "@views/UserInsight/CalculationRules/Rules/OperationRules.vue";

export default {
    name: "CalculationRules",
    components: {OperationRule, OperationData},
    data() {
        return {
            activeName: 'data',
            calculationList: [
                {
                    label: '计算数据',
                    name: 'data'
                },
                {
                    label: '计算规则',
                    name: 'rules'
                },
            ]
        };
    },
    deactivated() {
        this.activeName = 'data';
    }
}
</script>

<style scoped lang="scss">
.container {
    box-sizing: border-box;
    margin-bottom: 16px;
    /deep/ .el-tabs__header {
        background-color: #FFFFFF;
        .el-tabs__nav-scroll {
            padding: 0 24px;
        }
        .el-tabs__nav-wrap::after {
            height: 1px;
            background-color: $bg-color-divider;
        }
        .el-tabs__item {
            height: 48px;
            line-height: 52px;
        }
    }
}
</style>

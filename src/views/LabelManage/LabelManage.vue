<template>
    <div class="container flex m-b-16 h-100">
        <select-label @getLabel="getLabel" :amount="amount" :status="state" class="m-l-16"></select-label>
        <operation-pool @operationAmount="operationAmount" @resetLabelData="resetLabelData" :info="labelInfo" :operationID="operationItem" class="m-l-r-16"></operation-pool>
    </div>
</template>

<script>
import SelectLabel from "@views/LabelManage/SelectLabel.vue";
import OperationPool from "@views/LabelManage/OperationPool.vue";

export default {
    name: "LabelManage",
    components: {SelectLabel,OperationPool},
    data() {
        return {
            labelInfo: null,
            amount: 1,
            operationItem: 0,
            state: true
        }
    },
    deactivated() {
        this.amount = 1;
    },
    methods: {
        getLabel(info,val) {
            this.labelInfo = info;
            this.operationItem = val;
        },
        operationAmount(num) {
            this.amount = num;
        },
        resetLabelData(status) {
            this.state = status;
        }
    }
}
</script>

<style scoped lang="scss">
.container {
    width: 100%;
}
</style>

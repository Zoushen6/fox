<template>
    <div class="flex-1 flex-vertical m-l-r-16">

        <div class="home-padding background-white m-b-16">
            <data-board></data-board>
        </div>

        <div class="user-trend home-padding background-white m-b-16">
            <user-trend></user-trend>
        </div>

        <div class="home-padding background-white m-b-16">
            <type-ratio></type-ratio>
        </div>

    </div>
</template>

<script>
import DataBoard from "@views/UserInsight/DataScreen/DataBoard/DataBoard.vue";
import UserTrend from "@views/UserInsight/DataScreen/UserTrend/UserTrend.vue";
import TypeRatio from "@views/UserInsight/DataScreen/TypeRatio/TypeRatio.vue";
import UserInsightMixin from "@views/UserInsight/UserInsightMixin";

export default {
    name: "DataScreen",

    mixins:[UserInsightMixin],

    components: {DataBoard,UserTrend,TypeRatio},

    data(){
        return{
        }
    },


    methods: {

    }
}
</script>

<style scoped lang="scss">
.home-padding {
    padding: 16px 24px;
}
</style>
<style lang="scss">
@import "src/views/UserInsight/UserInsight";
</style>

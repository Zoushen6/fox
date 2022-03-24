<template>
    <div class="data-list m-t-10">
        <div class="flex">
            <span class="list-item inline-block" v-for="(item,key) in data" :key="key" v-loading="item.loading">
                <p class="item-top">
                    {{headListReduce[key]}}
                </p>
<!--                <p class="item-middle">{{parseFloat(item.data.now).toLocaleString().replaceAll("，",",").trim()}}</p>-->
                <p class="item-middle">{{parseFloat(item.data.now).toLocaleString()}}</p>
                <p class="item-bottom flex-space-between" v-if="item.data.last">
                    <span class="date-item">日环比
                        <i :class="item.data.uad?'red-color':'green-color'">{{Number(item.data.circleRatio).toFixed(0) + '%' }}</i>
                    </span>
                    <span >命中率<i>{{' ' + Number(item.data.hit).toFixed(1) + '%'}}</i></span>
                </p>
            </span>
        </div>
    </div>
</template>

<script>
import {headList, data} from "@views/UserInsight/DataScreen/DataBoard/DataBoard.js";

export default {
    name: "DataBoard",

    props: {
    },

    computed: {
        headList: function () {
            return headList
        },

        headListReduce: function () {
            return Object.keys(headList).reduce((prev, next) => {
                const obj = headList[next];
                return Object.keys(obj).reduce((pre, nxt) => {
                    pre[nxt] = obj[nxt];
                    return pre;
                }, prev)
            }, {})
        }
    },

    mounted(){
        this.selectDate()
    },

    data(){
        return{
            date:'yesterday',
            data,
        }
    },

    methods: {
        selectDate(){
            Object.keys(headList).forEach(key => {

                const obj = headList[key];
                Object.keys(obj).forEach(k => this.data[k].loading = true)

                this.axiosList(key).then((res) => {
                    if (res && res.data.code === 200){

                        const obj = headList[key];
                        Object.keys(obj).forEach(k => this.data[k].data = res.data.data.list[k])

                    }
                }).catch((err) => {
                    console.warn(err)
                }).finally(() => {
                    const obj = headList[key];
                    Object.keys(obj).forEach(k => this.data[k].loading = false)
                })
            });
        },

        axiosList(module) {
            return this.$http.get("rta/data/list", {
                params: {
                    date_type: this.date,
                    module: module
                }
            });
        },
    }
}
</script>

<style scoped lang="scss">

    .list-item {

        width: 19%;
        position: relative;
        padding-left: 3.4vw;
        box-sizing: border-box;

        &:first-of-type {
            padding-left: 2vw;
        }

        &:after {
            content: '';
            position: absolute;
            right: 0;
            top: 10px;
            height: 80%;
            border-right: 1px solid $bg-color-divider;
        }

        &:last-of-type:after {
            border-right: initial;
        }

        .item-top {
            color: $font-color-secondary;
            margin-bottom: 15px;
        }

        .item-middle {
            color: $font-color-base;
            margin-bottom: 16px;
            font-weight: 600;
            font-size: 1.5vw;
            margin-left: -2px;
            font-family: $font-family-alternate;
        }

        .date-item {
            margin-right: 1.3vw;
        }

        .item-bottom {
            justify-content: flex-start;
            flex-wrap:wrap;
            color: $font-color-auxiliary;
            margin-bottom: 10px;
            font-size: $font-size-addition;
            .red-color {
                color: #F45858;
            }
            .green-color {
                color: #66C23A;
            }
        }
    }

</style>

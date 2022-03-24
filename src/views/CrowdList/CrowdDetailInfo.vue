<template>
    <!--抽屉-->
    <el-drawer
        title="人群详情"
        :visible.sync="dialogVisible"
        @closed="closeDialog"
        direction="rtl">
        <div class="info" v-loading="loading">
            <div class="info-overflow" v-for="(item,key) in videoItem">{{item + '：' + info[key] }}</div>
            <div class="info-overflow">设备类型: {{typeList[device_num_type]}}</div>
            <div class="operation-pool">
                <div class="m-b-16 container" v-for="(item,index) in poolList" :key="index">
                    <div class="head-title flex">
                        <div class="title">运算池{{index+1}}：</div>
                        <div class="all">
                            <el-button class="and" :class="Number(item.in_condition) === 1 ? 'now-status' : ''" disabled>池内取并集</el-button>
                            <el-button class="or" :class="Number(item.in_condition) === 2 ? 'now-status' : ''" disabled>池内取交集</el-button>
                        </div>
                    </div>
                    <div class="operation-box">
                        <div class="operation-item" v-for="(ite,idx) in item.label" :key="idx">
                            <p>{{ite[0].label}}</p>
                            <p> {{ showLabel(ite) }}</p>
                        </div>
                    </div>
                    <div class="gather flex" v-if="poolList.length>1">
                        <div class="left m-t-25">
                            <div class="point"></div>
                            <div class="mid"></div>
                            <div class="point"></div>
                        </div>
                        <div class="right flex-vertical">
                            <el-form class="customized-form">
                                <el-form-item class="short-item m-t-30">
                                    <span class="relation-text">{{gatherList[item.out_condition]}}</span>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="m-b-16" >覆盖人数: {{parseFloat(package_num).toLocaleString()}}</div>
        </div>
    </el-drawer>
    <!--/抽屉-->
</template>

<script>
import DialogMixin from "@mixins/DialogMixin";

export default {
    name: "CrowdDetailInfo",

    mixins: [DialogMixin],

    mounted() {
    },

    data() {
        return {
            videoItem: {
                "package_name": "人群名称",
                "create_time": "创建时间",
                "user_name": "创建人",
            },
            poolList:[],
            gather: 'and',
            loading:false,
            gatherList: {
                '1': '并集',
                '2': '交集',
                '3': '排除',
            },
            typeList: {
                '1': 'imei',
                '2': 'oaid',
                '3': 'idfa',
            },
            package_num:'',
            device_num_type:''
        }
    },

    computed: {
    },

    watch: {
        info: {
            handler: function (val) {
                this.poolList = val.pool;
                this.package_num = val.package_num?val.package_num:0;
                this.device_num_type = val.device_num_type;
            },
        }
    },

    props: {
        info: {
            type: [Object,Array],
            default: function () {
                return {
                };
            }
        },
    },

    methods: {
        showLabel(val) {
            let text = val.map(item => item.label_value)
            return text.join(',')
        },
    }

}
</script>

<style scoped lang="scss">
/deep/.el-drawer__body {
    overflow-x: hidden;
}

/deep/.el-drawer {
    width: 23% !important;
}

/deep/ .el-drawer__header {
    margin-bottom: 16px;
    padding: 19px 24px 0;
}

/deep/ .el-drawer__header > :first-child {
    font-size: 16px;
    color: $font-color-base;
    font-weight: 600;
}

.info {
    border-top: 1px solid $bg-color-divider;
    padding: 21px 24px 24px;
    font-size: $font-size-base;
    overflow-y: auto;

    .info-overflow {
        color: $font-color-base;
        margin-bottom: 17px;
        word-break: break-all;
    }
    .operation-pool {
        .head-title {
            justify-content: space-between;
            .title {
                font-size: $font-size-headings;
                color: $font-color-base;
                font-weight: $font-weight-bold;
            }
            .all {
                height: 28px;
                .and, .or {
                    cursor: pointer;
                    font-size: $font-size-addition;
                    padding: 8px;
                    border-color: $font-color-auxiliary;
                    color: $font-color-auxiliary;
                }
                .and {
                    border-radius: 4px 0 0 4px;
                }

                .or {
                    border-radius: 0px 4px 4px 0;
                    margin-left: -1px;
                }

                .now-status {
                    color: $theme-color;
                    border: 1px solid $theme-color;
                    border-color: $theme-color;
                    background-color: #fef4ea;
                }
                .now-status:first-child {
                    position: relative;
                }
            }
        }
        .operation-box {
            min-height: 174px;
            border: 1px dashed $font-color-disabled;
            border-radius: 8px;
            padding: 12px;
            box-sizing: border-box;
            margin-top: $font-size-headings;
            .operation-item {
                position: relative;
                display: inline-block;
                min-width: 130px;
                background: $bg-color-grey;
                border-radius: 4px;
                padding: 8px 16px;
                margin-bottom: 12px;
                margin-right: 12px;
                &:last-child {
                    margin-bottom: 0px;
                    margin-right: 0px;
                }
                p {
                    text-align: center;
                    line-height: 20px;
                    font-size: $font-size-addition;
                    color: $font-color-secondary;
                }
            }
        }
        .gather {
            .left {
                .point {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: $theme-color;
                }
                .mid {
                    width: 2px;
                    min-height: 30px;
                    margin-left: 3px;
                    background-color: $theme-color;
                }
            }
            .right {
                .customized-form {
                    .short-item {
                        .relation-text {
                            font-size: $font-size-base;
                            margin-left: 5px;
                        }
                        /deep/ .el-input__inner {
                            max-width: 75px;
                            min-width: 75px;
                            border: none;
                        }
                    }
                }
            }
        }
        .container:last-child{
            .gather {
                display: none;
            }
        }
    }
}
</style>

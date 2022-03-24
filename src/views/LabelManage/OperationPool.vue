<template>
    <div class="operation-pool">
        <div class="m-b-16 container" v-for="(ite,idx) in operation" :key="idx">

            <div class="head-title flex">
                <div class="title">运算池{{ idx + 1 }}：</div>
                <div class="all">
                    <span v-if="operation.length>1" @click="deleteOperation(idx)" class="iconfont icon-delete"></span>
                    <el-button-group class="all">
                        <el-button @click="operationAnd(ite.in_condition = 1)" class="and"
                                   :class="ite.in_condition === 1 ? 'btn' : ''">池内取并集
                        </el-button>
                        <el-button @click="operationOr(ite.in_condition = 2)" class="or"
                                   :class="ite.in_condition === 2 ? 'btn' : ''">池内取交集
                        </el-button>
                    </el-button-group>
                </div>
            </div>

            <!-- 每一个标签 -->
            <div class="operation-box">
                <div class="operation-item" v-for="(item,index) in ite.operationLabel" :key="index">
                    <span v-if="item.label !== '时间范围'" @click="deleteLabel(idx,index)"
                          class="iconfont icon-close"></span>
                    <p>{{ item.label }}</p>
                    <p>{{ item.list.label }}</p>
                </div>
            </div>
            <!-- /每一个标签 -->

            <!-- 每一个运算池之间的关系 -->
            <div class="gather flex" v-if="ite.gather !== ''">
                <div class="left m-t-25">
                    <div class="point"></div>
                    <div class="mid"></div>
                    <div class="point"></div>
                </div>
                <div class="right flex-vertical">
                    <el-form class="customized-form">
                        <el-form-item class="short-item m-t-30">
                            <el-select v-model="ite.out_condition" placeholder="请选择">
                                <el-option v-for="item in gatherList" :key="item.value" :label="item.name"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <!-- /每一个运算池之间的关系 -->

            <div class="add-operation" v-if="ite.gather === ''">
                <el-button v-if="!ite.addItem" @click="addOperation(idx)" plain class="iconfont icon-add">添加运算池
                </el-button>
                <div v-else class="add-item">
                    <span>选择运算池间的关系：</span>
                    <el-radio @change="handleChange(it.value,idx)" v-for="(it,id) in gatherList" :key="id"
                              v-model="radio" :label="id">
                        {{ it.name }}
                    </el-radio>
                </div>
            </div>

        </div>

        <div class="device-type">
            <div class="device">匹配类型：</div>
            <el-form class="customized-form" :model="deviceForm" :rules="deviceRule" ref="deviceForm">
                <el-form-item class="long-item" prop="device">
                    <el-select v-model="deviceForm.device" placeholder="请选择">
                        <el-option v-for="item in deviceType" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>

        <div class="start-estimate">
            <el-button @click="startOperation">开始预估人群</el-button>
        </div>

        <!-- 保存人群弹窗 -->
        <customized-dialog
            class="operation-dialog"
            :width="660"
            title="保存人群"
            :visible="visibleOperation"
            @close="closeDialog"
            @cancel="closeDialog"
        >
            <el-form class="customized-form overflow-hidden" :rules="operationRules" :model="operationForm"
                     ref="operationForm" v-loading="loading">
                <el-form-item label="预计覆盖人数：" class="item-title">
                    <span>{{ packageStatus === 1 ? packageNum : 0 }}</span>
                </el-form-item>
                <el-form-item prop="crowdName" class="long-item" label="人群名称" label-width="80px">
                    <el-input v-model="operationForm.crowdName"></el-input>
                </el-form-item>
                <el-form-item class="f-r">
                    <el-button type="primary" @click="submitOperation">确定</el-button>
                </el-form-item>
            </el-form>
        </customized-dialog>
        <!-- /保存人群弹窗 -->

        <text-dialog
            ref="delete"
            class="text-dialog"
            :text="textDialog.text"
            :textClass="textDialog.class"
            :show-footer="textDialog.showFooter"
            @success="submitDelete"
            @dialogClose="closeTextDialog"
        ></text-dialog>
    </div>
</template>

<script>
import axios from "axios";
import common from "@tools/common.js";
import {LastSeveralDays} from "@tools/DateUtils.js";
import TextDialog from "@components/dialog/TextDialog.vue";
import CustomizedDialog from "@components/CustomizedDialog.vue";

export default {
    name: "OperationPool",
    components: {CustomizedDialog, TextDialog},
    props: {
        info: {
            type: Object
        },
        //每个运算池的id
        operationID: {
            type: Number
        }
    },
    watch: {
        info: {
            handler: function (val) {
                this.operation.forEach((ite, idx) => {
                    if (idx + 1 === this.operationID) {
                        let temp = ite.operationLabel.find(it => {
                            return it.label === val.label;
                        });
                        temp ? Object.assign(temp, val) : ite.operationLabel.push(val);
                    }
                })
            },
            immediate: true,
        }
    },
    data() {
        return {
            textDialog: {
                text: '',
                class: '',
                showFooter: true
            },
            operationLabelCopy: null,
            operation: [
                {
                    operationLabel: [
                        {
                            'label': '时间范围',
                            'list': {
                                //当增加标签类型时label_id会改变，这里需要改，目前写死了
                                label_id: '1',
                                def_id: '0',
                                label: [common.getNewDay(LastSeveralDays(7, 0)[0]), common.getNewDay(LastSeveralDays(7, 0)[1])].join(','),
                                value: [common.getNewDay(LastSeveralDays(7, 0)[0]), common.getNewDay(LastSeveralDays(7, 0)[1])].join(',')
                            }
                        }
                    ],
                    gather: '',
                    addItem: false,
                    in_condition: 1,
                    out_condition: 0,
                },
            ],
            gather: '',
            gatherList: [
                {
                    name: '交集',
                    value: 2
                },
                {
                    name: '并集',
                    value: 1
                },
                {
                    name: '排除',
                    value: 3
                }
            ],
            radio: '',
            operationIndex: 0,
            visibleOperation: false,
            operationForm: {
                crowdName: ''
            },
            operationRules: {
                crowdName: [
                    {required: true, message: '请输入人群名称'}
                ]
            },
            deviceForm: {
                device: '',
            },
            deviceRule: {
                device: [
                    {required: true, message: '请选择设备号类型！'}
                ]
            },
            deviceType: [
                {
                    label: 'imei',
                    value: 1
                },
                {
                    label: 'oaid',
                    value: 2
                },
                {
                    label: 'idfa',
                    value: 3
                }
            ],
            packageID: '',
            packageStatus: '',
            packageNum: '',
            cancel: '',
            timer: '',
            loading: false,
        }
    },
    created() {
        this.operationLabelCopy = common.deepCopy(this.operation[0].operationLabel[0], {});
    },
    deactivated() {
        this.resetData();
    },

    methods: {

        //关闭计算中弹窗时取消请求
        closeTextDialog(){
            if(typeof this.cancel === "function") {
                this.cancel();
                if(this.timer) {
                    clearInterval(this.timer)
                }
            }
        },

        //重置页面数据
        resetData() {
            this.operation = [
                {
                    operationLabel: [this.operationLabelCopy],
                    gather: '',
                    addItem: false,
                    in_condition: 1,
                    out_condition: 0,
                },
            ];
            this.$refs.deviceForm.resetFields();
        },

        //添加运算池
        addOperation(idx) {
            this.radio = '';
            this.operation[idx].addItem = true;
        },

        //确认添加运算池
        handleChange(val, idx) {
            if (this.operation.length < 3) {
                this.operation[idx].gather = val;
                this.operation[idx].out_condition = val;
                this.operation.push(
                    {
                        operationLabel: [this.operationLabelCopy],
                        gather: '',
                        addItem: false,
                        in_condition: 1,
                        out_condition: val
                    }
                );
                this.operation[idx].addItem = false;
                this.$emit('operationAmount', this.operation.length);
            } else {
                this.$message.warning('运算池最多可以添加三个!');
                this.operation[idx].addItem = false;
            }
        },

        //删除运算池
        deleteOperation(index) {
            this.textDialog.showFooter = true;
            this.textDialog.class = 'iconfont icon-warning';
            this.textDialog.text = '删除运算池会删除池中全部条件，确定删除？';
            this.operationIndex = index;
            this.$refs.delete.openDialog();
        },

        //确定删除运算池
        submitDelete() {
            this.operation.splice(this.operationIndex, 1);
            this.operation[this.operation.length - 1].gather = '';
            this.$refs.delete.closeDialog();
            this.$emit('operationAmount', this.operation.length);
        },

        //删除运算池内标签
        deleteLabel(Index, idx) {
            this.operation.forEach((item, index) => {
                if (Index === index) {
                    item.operationLabel.splice(idx, 1);
                }
            })
        },

        //池内取并集
        operationAnd(val) {
            this.in_condition = val;
        },

        //池内取交集
        operationOr(val) {
            this.out_condition = val;
        },

        //请求参数
        axiosData(params) {
            let _this = this;
            return this.$http.post('label/commit',
                {...params,},
                {
                    cancelToken: new axios.CancelToken(function executor(c) {
                        // executor 函数接收一个 cancel 函数作为参数
                        _this.cancel = c;
                    })
                }
            );
        },

        //人群包状态
        axiosPackageStatus() {
            let _this = this;
            return this.$http.get('/crowd/package-status', {
                params: {
                    package_id: this.packageID,
                },
                cancelToken: new axios.CancelToken(function executor(c) {
                    // executor 函数接收一个 cancel 函数作为参数
                    _this.cancel = c;
                })
            })
        },

        //保存人群包关闭窗口
        closeDialog() {
            this.visibleOperation = false;
            this.$refs.operationForm.resetFields();
        },

        //开始预估人群
        startOperation() {
            let arr = [];
            this.operation.forEach(ite => {
                let labelLists = ite.operationLabel.map(item => {
                    return [item.list];
                });
                arr.push({
                    in_condition: ite.in_condition,
                    out_condition: ite.out_condition,
                    label: labelLists,
                });
            });
            let params = {'device_num_type': this.deviceForm.device, 'pool': JSON.stringify(arr)};
            this.$refs.deviceForm.validate((valid) => {
                if (valid) {
                    this.textDialog.showFooter = false;
                    this.textDialog.class = '';
                    this.textDialog.text = '计算中，请耐心等待…';
                    this.$refs.delete.openDialog();
                    this.axiosData(params).then(res => {
                        if (res.data.code === 200) {
                            this.packageID = res.data.data.result.package_id;
                        }
                        //计算的人群数据不一定马上就能返回，需要定时调用，当人数出来之后再停止
                        if(this.packageID) {
                            this.timer = setInterval(() => {
                                this.axiosPackageStatus().then(result => {
                                    if (result.data.code === 200) {
                                        this.packageStatus = result.data.data.result.package_status;
                                        this.packageNum = result.data.data.result.package_num;
                                    }
                                    if (this.packageStatus === 1) {
                                        clearInterval(this.timer);
                                        this.$refs.delete.closeDialog();
                                        this.visibleOperation = true;
                                    }
                                }).catch(err => {
                                    console.warn(err);
                                }).finally(() => {
                                })
                            }, 2000);
                        }
                    }).catch(err => {
                        console.warn(err);
                    }).finally(() => {
                    });
                }
            })
        },

        //确认创建人群包
        submitOperation() {
            this.$refs.operationForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    let params = {package_id: this.packageID, package_name: this.operationForm.crowdName};
                    this.axiosData(params).then(res => {
                        if (res.data.code === 200) {
                            //异步 需要状态变为2才成功
                            let timer = setInterval(() => {
                                this.axiosPackageStatus().then(result => {
                                    if (result.data.code === 200) {
                                        this.packageStatus = result.data.data.result.package_status;
                                    }
                                }).catch(err => {
                                    console.warn(err);
                                }).finally(() => {
                                    if (this.packageStatus === 2) {
                                        clearInterval(timer);
                                        this.loading = false;
                                        this.$message.success('保存人群成功！');
                                        this.resetData();
                                        this.$refs.operationForm.resetFields();
                                        this.visibleOperation = false;
                                        this.$emit('resetLabelData',this.visibleOperation);
                                    }
                                    // else {
                                    //     this.$message.error('保存人群失败！');
                                    //     this.visibleOperation = true;
                                    // }
                                })
                            }, 2000);
                        }
                    });
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.operation-pool {
    overflow-y: auto;
    width: 832px;
    height: 899px;
    padding: 32px 24px;
    box-sizing: border-box;
    background-color: $bg-color-white;

    .head-title {
        justify-content: space-between;

        .title {
            font-size: $font-size-headings;
            color: $font-color-base;
            font-weight: $font-weight-bold;
        }

        .all {
            height: 32px;

            .icon-delete {
                cursor: pointer;
                margin-right: 16px;
            }

            .and, .or {
                color: $font-color-auxiliary;
                border-color: $font-color-auxiliary;
                cursor: pointer;
                font-size: $font-size-addition;
                padding: 8px;
            }

            .and {
                border-radius: 4px 0 0 4px;
            }

            .or {
                border-radius: 0px 4px 4px 0;
                margin-left: 0px;
            }

            .el-button:hover {
                color: $theme-color;
                border-color: $theme-color;
            }

            .btn:not(:last-child) {
                z-index: 1000;
                color: $theme-color;
                border: 1px solid $theme-color;
                background-color: #fef4ea;
            }

            .btn:last-child {
                color: $theme-color;
                border: 1px solid $theme-color;
                background-color: #fef4ea;
            }
        }
    }

    .operation-box {
        min-height: 174px;
        min-width: 300px;
        border: 1px dashed $font-color-disabled;
        border-radius: 8px;
        margin-top: $font-size-headings;
        padding-bottom: $font-size-headings;

        .operation-item {
            position: relative;
            display: inline-table;
            min-width: 130px;
            max-width: 245px;
            min-height: 52px;
            background: $bg-color-grey;
            border-radius: 4px;
            margin: 16px 16px 0 16px;
            padding: 8px 16px;
            box-sizing: border-box;

            p {
                text-align: center;
                line-height: 20px;
                font-size: $font-size-addition;
                color: $font-color-secondary;
            }
        }
    }

    .add-operation {
        /deep/ .el-button, .add-item {
            height: 56px;
            width: 100%;
            border-radius: 8px;
            border: 1px dashed $theme-color;
            color: $theme-color;
            margin-top: 24px;
        }

        .add-item {
            padding: 18px 0 18px 16px;
            box-sizing: border-box;
            color: $font-color-secondary;

            /deep/ .el-radio__inner {
                width: 10px;
                height: 10px;
            }
        }
    }

    .device-type {
        .device {
            font-size: $font-size-headings;
            color: $font-color-base;
            font-weight: $font-weight-bold;
            margin: 40px 0 24px 0;
        }

        .customized-form {
            .long-item {
                /deep/ .el-input__inner {
                    height: 36px;
                    width: 314px;
                    max-width: 314px;
                    color: $font-color-base;
                }
            }
        }
    }

    .start-estimate {
        margin-top: 98px;

        /deep/ .el-button {
            width: 116px;
            height: 32px;
            background: $theme-color;
            border-radius: 4px;
            color: $bg-color-white;
            padding: 6px 16px;
            box-sizing: border-box;
            border: none;
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
                    /deep/ .el-input__inner {
                        max-width: 75px;
                        min-width: 75px;
                        border: none;
                    }
                }
            }
        }
    }

    .operation-dialog {
        /deep/ .el-dialog__body {
            padding: 24px 24px 0 24px;
            box-sizing: border-box;

            .customized-form {
                padding-left: 120px;
                .el-form-item__label {
                    color: $font-color-base;
                }

                .item-title {
                    span {
                        color: $font-color-base;
                        font-size: $font-size-base;
                        line-height: 40px;
                    }
                }

                .el-form-item__content {
                    line-height: 37px;
                }

                .f-r {
                    .el-button {
                        width: 88px;
                        height: 32px;
                        background: #F1902C;
                        border-radius: 4px;
                    }
                }
            }
        }
    }
}
</style>

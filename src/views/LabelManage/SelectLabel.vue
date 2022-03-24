<template>
    <div class="select-label">
        <div class="title">选择标签：</div>
        <div class="select-type">
            <el-button :class="label === item.en_label ? 'btn' : ''" @click="selectLabel(item.en_label)" v-for="(item,index) in labelList" :key="index">
                {{ item.label }}
            </el-button>
        </div>

        <!-- 时间范围选择 -->
        <div class="time time-title" v-if="label==='time'">
            <div class="title">选择时间范围：</div>
            <customized-time-picker
                class="time-picker long-item m-t-25"
                :date.sync="dateValue"
                :shortcutsSetting="shortcutsSetting"
                :max-date="1"
                :min-date="minDate"
                @change="handleChange"
            ></customized-time-picker>
        </div>
        <!-- /时间范围选择 -->

        <!-- 选择活动ID -->
        <div class="equipment time-title" v-if="label==='activity_id'">
            <div class="title">选择活动名称：</div>
            <el-form class="customized-form">
                <el-form-item class="long-item m-t-25">
                    <el-select v-model="activeID" placeholder="请选择" multiple clearable filterable @change="handleChange">
                        <el-option v-for="item in allList.activity_id" :key="item.def_id" :label="item.label_name"
                                   :value="item.def_id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <!-- /选择活动ID -->

        <!-- 播放进度 -->
        <div class="equipment time-title" v-if="label==='play_progress'">
            <div class="title">播放进度：</div>
            <el-form class="customized-form">
                <el-form-item class="long-item m-t-25">
                    <el-select v-model="playbackProgress" multiple placeholder="请选择(可多选)" @change="handleChange">
                        <el-option v-for="item in allList.play_progress" :key="item.def_id" :label="item.label"
                                   :value="item.def_id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <!-- /播放进度 -->

        <el-button v-if="label && operationAmount === 1" class="add-button iconfont icon-add" size="small" @click="addLabel(1)">添加</el-button>

        <el-dropdown v-if="label && operationAmount !== 1" trigger="click" @command="addLabel">
            <el-button plain class="add-button iconfont icon-add" size="small">添加</el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="ite" v-for="ite in operationAmount" :key="ite">运算池{{ ite }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

    </div>
</template>

<script>
import common from "@tools/common.js";
import CustomizedTimePicker from "@components/CustomizedTimePicker.vue";

export default {
    name: "SelectLabel",
    components: {CustomizedTimePicker},
    props: {
        amount: {
            type: Number
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        amount: {
            handler: function (val) {
                this.operationAmount = val;
            },
            immediate: true
        },
        status: {
            handler: function (val) {
                if(!val) {
                    this.operationAmount = 1;
                    this.label = '';
                    this.reset();
                }
            },
            immediate: true
        }
    },
    data() {
        return {
            common,
            label: '',
            labelList: [],
            dateValue: [],
            shortcutsSetting: ['lastSeven', 'lastThirty', 'lastNinety', 'curWeek', 'lastWeek', 'curMonth', 'lastMonth'],
            minDate: Math.ceil((new Date - new Date("2018-1-1")) / (3600 * 24 * 1000)),
            equipment: [],
            equipmentList: [],
            activeID: [],
            activeIdList: [],
            playbackProgress: [],
            playbackProgressList: [],
            operationAmount: 1,
            allList: {
                activity_id:[],
                play_progress:[]
            },
            labelInfo: {
                activity_id: {
                    'label': '活动名称',
                    'list': {
                        label_id: '',
                        def_id: [],
                        label: '',
                        value: ''
                    }
                },
                play_progress: {
                    'label': '播放进度',
                    'list': {
                        label_id: '',
                        def_id: [],
                        label: '',
                        value: ''
                    }
                },
                time: {
                    'label': '时间范围',
                    'list': {
                        label_id: '',
                        def_id: '0',
                        label: '',
                        value: ''
                    }
                }
            }
        }
    },
    activated() {
        this.getLabelList();
        this.getLabelType();
    },
    deactivated() {
        this.operationAmount = 1;
        this.label = '';
        this.reset();
    },
    methods: {

        //标签列表
        getLabelList() {
            this.$http.get('label/type').then(res => {
                if (res.data.code === 200) {
                    this.labelList = res.data.data.list;
                }
            })
        },

        handleChange(val){
            if(val) {
                this.labelInfo[this.label].list.label_id = this.labelList.map(item => {
                    let label_id = '';
                    this.allList[this.label].forEach(ite => {
                        if(ite.label_id == item.label_id) {
                            label_id = ite.label_id;
                        }
                    })
                    return label_id
                }).join('');
            }
            if(this.label !== 'time') {
                this.labelInfo[this.label].list.def_id = val.join(',');
                this.labelInfo[this.label].list.label = val.map(item => {
                    let label = '';
                    this.allList[this.label].forEach(ite => {
                        if(ite.def_id === item) {
                            label = ite.label_name;
                        }
                    })
                    return label
                }).join(',');
            }else {
                let date = [this.common.getNewDay(this.dateValue[0]),this.common.getNewDay(this.dateValue[1])].join(',');
                this.labelInfo[this.label].list.label = date;
                this.labelInfo[this.label].list.value = date;
            }
        },

        //每个标签下拉列表
        getLabelType() {
            this.$http.get('/label/list').then(res => {
                if (res.data.code === 200) {
                    this.allList = res.data.data.list;
                }
            })
        },

        selectLabel(val) {
            this.label = val;
        },

        reset() {
            this.dateValue = [];
            this.equipment = [];
            this.activeID = [];
            this.playbackProgress = [];
        },

        //添加标签
        addLabel(val) {
            const itemLabel = this.common.deepCopy(this.labelInfo[this.label],{});
            //当下拉框被清空时不允许添加
            if(this.labelInfo[this.label].list.label) {
                this.$emit('getLabel', itemLabel, val);
                //当下拉框被清空时把list.label清除不允许添加
                this.labelInfo[this.label].list.label = '';
                this.reset();
            }
        },
    },
}
</script>

<style scoped lang="scss">
.select-label {
    width: 832px;
    height: 899px;
    padding: 32px 24px;
    box-sizing: border-box;
    background-color: $bg-color-white;

    .title {
        font-size: $font-size-headings;
        color: $font-color-base;
        font-weight: $font-weight-bold;
    }

    .select-type {
        .btn {
            color: $theme-color !important;
            border: 1px solid $theme-color;
            background-color: #fef4ea !important;
        }
        /deep/ .el-button {
            height: 32px;
            width: 308px;
            padding: 6px 111px;
            border-radius: 16px;
            margin: 24px 64px 0 0;
            background-color: $bg-color-grey;
            color: $font-color-secondary;
        }

        /deep/ .el-button:hover {
            background-color: #FFFAF4;
            border-color: $theme-color;
        }
    }

    .time-title {
        margin-top: 56px;
    }

    .time {
        .time-picker {
            height: 36px;
            width: 314px;
            ::-webkit-input-placeholder {
                color: #CCCCCC;
            }
        }
    }

    .equipment {
        .customized-form {
            .long-item {
                /deep/ .el-input__inner {
                    height: 36px;
                    width: 314px;
                    max-width: 314px;
                }
            }

            /deep/ input::-webkit-input-placeholder {
                color: $font-color-auxiliary;
                opacity: 0.5;
            }
        }
    }

    /deep/ .add-button {
        font-size: $font-size-base;
        height: 32px;
        width: 88px;
        margin-top: 172px;
        padding: 6px 21px;
        box-sizing: border-box;
        color: $theme-color;
        border-color: $theme-color;
    }
}
</style>

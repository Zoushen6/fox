<template>
    <el-date-picker
            v-model="dateLocal"
            type="daterange"
            :align="align"
            @change="val=>{$emit('change',[new Date(val[0]).getTime(),new Date(val[1]).getTime()])}"
            unlink-panels
            :clearable='clearable'
            :size="size"
            :range-separator="rangeSeparator"
            :start-placeholder="startPlaceholder"
            :end-placeholder="endPlaceholder"
            :value-format="valueFormat"
            :picker-options="pickerOptions">
    </el-date-picker>
</template>

<script>
import {CurWeek, LastSeveralDays, LastWeek, CurMonth, LastMonth} from "@tools/DateUtils";

    export default {
        name: "CustomizedTimePicker",
        props: {
            date: {
                type: Array
            },
            clearable: {
                type: Boolean,
                default: false
            },
            align: {
                type: String,
                default: 'left'
            },
            size: {
                type: String
            },
            rangeSeparator: {
                type: String,
                default: '至'
            },
            startPlaceholder: {
                type: String,
                default: '开始日期'
            },
            endPlaceholder: {
                type: String,
                default: '结束日期'
            },
            valueFormat: {
                type: String,
                default: 'yyyy-MM-dd'
            },
            minDate: {
                type: Number,
                default: null
            },
            maxDate: {
                type: Number,
                default: null
            },
            showShortcutsSetting: {
                type: Boolean,
                default: true
            },
            shortcutsSetting: {
                type: Array,
                default: () => {
                    return ['lastSeven', 'lastFifteen', 'lastThirty']
                }
            }
        },
        computed: {
            dateLocal: {
                get: function () {
                    if(this.date.length)//没有默认值显示placeholder
                    return [this.getNewDay(this.date[0]), this.getNewDay(this.date[1])];
                },
                set: function (val) {
                    this.$emit('update:date', [new Date(val[0]).getTime(), new Date(val[1]).getTime()]);
                }
            },
            pickerOptions() {
                const computedShortcuts = this.getShortcuts(this.shortcutsSetting);
                const minDate = this.minDate;
                const maxDate = this.maxDate;
                return {
                    disabledDate(time) {
                        return (minDate !== null && time.getTime() < new Date() - 3600 * 1000 * 24 * minDate) || (maxDate !== null && time.getTime() > new Date() - 3600 * 1000 * 24 * maxDate);
                    },
                    shortcuts: this.showShortcutsSetting ? computedShortcuts : null,
                };
            }
        },
        data() {
            const _this = this;
            return {
                shortcuts: {
                    today: {
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', LastSeveralDays(1,0));
                        }
                    },
                    yesterday: {
                        text: '昨天',
                        onClick(picker) {
                            picker.$emit('pick', LastSeveralDays(1,1));
                        }
                    },
                    lastSeven: {
                        text: '最近7天',
                        onClick(picker) {
                            picker.$emit('pick', LastSeveralDays(7,_this.maxDate));
                        }
                    },
                    lastFifteen: {
                        text: '最近15天',
                        onClick(picker) {
                            picker.$emit('pick', LastSeveralDays(15,_this.maxDate));
                        }
                    },
                    lastThirty: {
                        text: '最近30天',
                        onClick(picker) {
                            picker.$emit('pick', LastSeveralDays(30,_this.maxDate));
                        }
                    },
                    lastNinety: {
                        text: '最近90天',
                        onClick(picker) {
                            picker.$emit('pick', LastSeveralDays(90,_this.maxDate));
                        }
                    },
                    curWeek: {
                        text: '本周',
                        onClick(picker) {
                            picker.$emit('pick', CurWeek());
                        }
                    },
                    lastWeek: {
                        text: '上周',
                        onClick(picker) {
                            picker.$emit('pick', LastWeek());
                        }
                    },
                    curMonth: {
                        text: '本月',
                        onClick(picker) {
                            picker.$emit('pick', CurMonth());
                        }
                    },
                    lastMonth: {
                        text: '上月',
                        onClick(picker) {
                            picker.$emit('pick', LastMonth());
                        }
                    }
                }
            }
        },
        methods: {
            getNewDay(nS) {
                const newDate = nS ? new Date(nS) : new Date();
                let sMonth = newDate.getMonth() + 1;
                let sDate = newDate.getDate();
                let addZero = (number) => {
                    return number < 10 ? '0' + number : number;
                };
                return newDate.getFullYear() + '-' + addZero(sMonth) + '-' + addZero(sDate);
            },
            getShortcuts(shortcuts) {
                const res = [];
                shortcuts.forEach(item => {
                    res.push(this.shortcuts[item]);
                });
                return res;
            }
        }
    }
</script>

<style scoped>

</style>

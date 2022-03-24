<template>
    <div :class="Data && Data.length ? '' : 'flex-vertical'">
        <!-- 表格区 -->
        <el-table ref="customizedTable" v-loading="loading" :data="Data" style="width: 100%" class="table" :class="Data && Data.length ? '' : 'empty-data'"
                  :show-summary="Data && Data.length? showSummary : false"
                  :summary-method="summaryMethod"
                  @selection-change="val => {$emit('selectionChange', val)}"
                  @sort-change="((sortMessage)=>{$emit('sort-change',sortMessage)})"
                  @cell-click="(row,column,cell,event)=>{$emit('cell-click',{row,column,cell,event})}"
                  :cell-class-name="cellClassName"
                  :stripe="hasStripe"
                  :border="showColumnBorder"
                  :max-height="maxHeight"
                  :height="Data && Data.length && !scrollInTable ? null : tableHeight"
        >
            <el-table-column v-if="Selection" type="selection" width="55" @selectable="(val) => {$emit('select-table', val)}">
            </el-table-column>
            <el-table-column v-if="Index" type="index" :index="IndexContent.method" :label="IndexContent.label"
                             :width="IndexContent.width">
            </el-table-column>
            <template v-for="(it,idx) in Header">
                <el-table-column v-if="it.showSlot"  :key="idx" :align="it.align||'left'" :prop="it.prop" :width="it.width||'auto'" :min-width="it.minWidth"
                                  :label="it.label" :sortable="it.sortable||false" :show-overflow-tooltip="it.showTooltip"
                                  :fixed="it.fixed||false" :formatter="it.formatter||null" :class-name="it.className">
<!--                    //todo: row?-->
                    <template v-slot:default="{row}" >
                        <slot :name="it.slotName" :row="row">
                            <div v-if="it.childSlots&&it.childSlots.length>0">
                                <span class="usable" v-for="(item,index) in it.childSlots" :key="index">
                                    <slot :name="item.slotName" :row="row">
                                        <el-button v-if="(!item.disappear)||(item.disappear&&!item.disappear(row,item))" :type="item.type||'text'"
                                                   :disabled="item.disabled&&item.disabled(row,item)" :class="item.cellClass"
                                                   :size="item.size"  @click="$emit(item.slotName,row)">{{item.buttonName}}
                                        </el-button>
                                    </slot>
                                </span>
                            </div>
                            <el-button v-else-if="(!it.disappear)||(it.disappear&&it.disappear(row,it))" :type="it.type||'text'"
                                       :disabled="it.disabled&&it.disabled(row,it)"
                                       :size="it.size||'mini'"  @click="$emit(it.slotName,row)">{{it.buttonName}}
                            </el-button>
                        </slot>
                    </template>
                </el-table-column>
                <el-table-column v-else  :key="idx" :align="it.align" :prop="it.prop" :width="it.width" :min-width="it.minWidth"
                                  :label="it.label" :sortable="it.sortable" :show-overflow-tooltip="it.showTooltip"
                                  :fixed="it.fixed" :formatter="it.formatter" :class-name="it.className">
                </el-table-column>
            </template>
        </el-table>
        <!-- /表格区 -->
        <!-- 分页 -->
        <el-pagination
                v-if="showPagination"
                background
                :layout="paginationLayout"
                @size-change="val=>{$emit('size-change',val)}"
                @current-change="val=>{$emit('current-change',val)}"
                :page-size="pageSize"
                :page-sizes="pageSizes"
                :current-page="currentPage"
                :total="total" class="m-t-30 text-center">
        </el-pagination>
        <!-- /分页 -->
    </div>
</template>

<script>
    export default {
        name: "CustomizedTable",
        props: {
            Index: {
                type: Boolean,
                default: false
            },
            Selection: {
                type: Boolean,
                default: false
            },
            showColumnBorder: {
                type: Boolean,
                default: false
            },
            hasStripe: {
                type: Boolean,
                default: false
            },
            IndexContent: {
                type: Object,
                default: function () {
                    return {
                        method: null,
                        label: '序号',
                        width: 'auto'
                    }
                }
            },
            // el-table设置高度或max-height时会触发表格的滚动
            // 数据为空时将高度设置成auto,这样el-table__body_wrapper会计算高度
            // 配合overflow-hidden加上高度继承和flex布局让el-table拿到正确的表格高度来计算el-table__body_wrapper高度
            tableHeight: {
                type: [Number, String],
                default: "auto"
            },
            maxHeight: {
                type: [Number, String],
                default: null
            },
            // false + 表格不为空 = tableHeight是null, 此时有数据时页面会随着变化
            scrollInTable: {
                type: Boolean,
                default: true
            },
            Header: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            Data: {
                type: Array,
                default: null
            },
            cellClassName: {
                type: [String,Function],
                default: ""
            },
            loading: {
                type: Boolean,
                default: false
            },
            showPagination: {
                type: Boolean,
                default: true
            },
            showTooltip: {
                type: Boolean,
                default: false
            },
            paginationLayout: {
                type: String,
                default: 'total, sizes, prev, pager, next, jumper'
            },
            showSummary: Boolean, // 总计为true + tableHeight为null时会触发表格无限加长的bug
            summaryMethod: Function,
            pageSize: Number,
            currentPage: Number,
            total: Number,
            pageSizes: {
                type: Array,
                default:function () {
                    return [10,20,30,40,50,100]
                }
            }
        },
        watch: {
            Data:{
                handler(val) {
                    this.$nextTick(()=>{
                        // 给所有class中有flex-1的祖先加上该属性，只是一种临时解决办法，且只用于空表格样式
                        let parent = this.$el;
                        while (parent && parent.classList.contains('flex-1')) {
                            parent.setAttribute('table', val && val.length ? 'table-wrapper': 'empty-table-wrapper');
                            parent = parent.parentElement;
                        }
                    })
                },
                immediate: true
            }
        },
        methods: {
            clearSort(){
                this.$refs['customizedTable'].clearSort();
            },
            clearCheck(){
                this.$refs['customizedTable'].clearSelection();
            },
            doLayout(){
                this.$refs['customizedTable'].doLayout();
            },
            updateColumnsWidth(){
                this.$refs['customizedTable'].layout.updateColumnsWidth();
            }
        }
    }
</script>

<style scoped lang="scss">

    .usable .el-button{
        //todo: 竖线
        &:hover{
            text-decoration: underline;
        }
    }

</style>

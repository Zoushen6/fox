export default {
    data() {
        return {
            pageSize: 10,
            total: 0,
            currentPage: 1,
            header: null,
            tableData: [],//表格数据
            loading: false,
        }
    },
    mounted() {
    },
    methods: {
        //页面变化事件
        pageChange(method, context, page, ...args) {
            this.currentPage = page;
            method.call(context, page, ...args);
        },

        //pageSize改变回调
        pageSizeChange(method, context, size, ...args) {
            this.pageSize = size;
            this.pageChange(method, context, 1, ...args);
        },

    }
}

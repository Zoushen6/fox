export default {
    data() {
        return {
            pageSizeCopy: 10,
            totalCopy: 0,
            currentPageCopy: 1,
            headerCopy: null,
            tableDataCopy: [
                {
                    "name" : "aaaa"
                }
            ],//表格数据
            loadingCopy: false,
        }
    },
    methods: {
        //页面变化事件
        pageChangeCopy(method, context, page) {
            this.currentPageCopy = page;
            method.call(context, page);
        },

        //pageSize改变回调
        pageSizeChangeCopy(method, context, size) {
            this.pageSizeCopy = size;
            this.pageChangeCopy(method, context, 1);
        }
    }
}
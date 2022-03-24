export default {
    data() {
        return {
            dialogVisible: false,
            dialogTitle: '',
        }
    },
    methods:{
        openDialog() {
            this.dialogVisible = true;
        },

        closeDialog() {
            this.dialogVisible = false;
            this.$emit('dialogClose');
        }
    }
}

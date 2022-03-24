export default {

    data() {
        return {
            memberList: [
                {
                    role_id: 1,
                    role_name: '管理员'
                },
                {
                    role_id: 2,
                    role_name: '运营'
                },
                {
                    role_id: 3,
                    role_name: '客户'
                }
            ],
            creatorList:[],
        }
    },

    mounted() {
        this.handleCreatorList();
    },

    methods: {

        //全部任务创建者
        handleCreatorList(){
            this.$http.get("user/creator-list").then(res=>{
                if(res.data.code === 200){
                    this.creatorList = res.data.data.list;
                }
            })
        },

    },

}

<!-- 顶通组件 -->
<template>
    <div class="top-bar" >
        <div class="f-r top-menu">
            <!-- 用户信息 -->
            <el-popover placement="top-end" width="96" trigger="hover" popper-class="disable-popper-padding" v-if="username">

                <el-button v-for="(item,idx) in authMenu" :key="idx" @click="chooseStrategy(item)">
                    <svg-icon :icon-name="item.iconfont" class="menu-icon"></svg-icon>{{item.title}}
                </el-button>

                <div slot="reference" class="username vertical-align-top" :title="name?name:username">
                    <span class="icon-user-head">
                        <img src="@images/icon-user.png" alt="">{{name?name:username}}
                    </span>
                </div>

            </el-popover>
            <!-- 用户信息 -->

        </div>

        <!-- 修改密码弹窗-->
        <customized-dialog
            class="customized-dialog"
            :title="pwdDialogTitle"
            :visible="pwdDialogVisible"
            :show-footer="true"
            :append-to-body="true"
            :width="600"
            @cancel="resetDialog('pwdForm')"
            @submit="submitModify('pwdForm')"
            @close="resetDialog('pwdForm')"
        >
            <el-form ref="pwdForm" :model="pwdForm" :rules="pwdRules" label-width="95px" label-position="right"
                     class="dialog-form">
                <el-form-item label="当前密码" prop="now_passwd">
                    <el-input v-model="pwdForm.now_passwd"  show-password></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="passwd" >
                    <el-input v-model="pwdForm.passwd"  show-password></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="passwd_repeat">
                    <el-input v-model="pwdForm.passwd_repeat"  show-password></el-input>
                </el-form-item>
            </el-form>
        </customized-dialog>
        <!-- /修改密码弹窗-->


        <!-- 退出登陆弹窗-->
            <customized-dialog
            class="customized-dialog"
            title="退出登录"
            :visible="logoutDialogVisible"
            :show-footer="true"
            :append-to-body="true"
            :width="507"
            @cancel="resetDialog"
            @submit="subLogout"
            @close="resetDialog"
        >
            <p>确定退出登录？</p>
        </customized-dialog>
        <!-- /退出登陆弹窗-->
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import {AUTH_MENU_LIST} from "@config/AuthMenu";
    import DialogMixin from "@mixins/DialogMixin";
    import {RouteAuthMixin} from "@mixins/ConfigMixin";

    export default {
        //输出名称
        name: 'topBar',
        mixins: [DialogMixin, RouteAuthMixin],

        // 初始化数据
        data() {
            let checkTel = (rule, value, callback) => {
                const isPhone = /^1[34578]\d{9}$/;//手机号码
                if (isPhone.test(value)||value =="") {
                    callback()
                } else {
                    callback(new Error('请输入正确的手机号'))
                }
            };
            let checkNowPwd = (rule, value, callback) => {
                const nowPwd = /^\S{8,}$/;
                if (nowPwd.test(value)) {
                    callback()
                } else {
                    callback(new Error('密码不少于8位'))
                }
            };
            let checkNowPwdRepeated = (rule, value, callback) => {
                if(this.pwdForm.passwd == value){
                    callback()
                }else{
                    callback(new Error('两次输入密码不一致'))
                }
            };
            return {
                logoutDialogVisible:false,
                pwdDialogVisible: false,
                pwdDialogTitle: '',
                //修改密码弹框form数据
                pwdForm:{
                    now_passwd:'',
                    passwd:'',
                    passwd_repeat:''
                },
                //弹框form条件规则
                profileRules: {
                    tel: [{required: false, validator: checkTel}]
                },
                pwdRules: {
                    now_passwd:[{required: true,message:"请输入当前密码"}],
                    passwd:[{required: true,validator:checkNowPwd}],
                    passwd_repeat:[{required: true,validator:checkNowPwdRepeated}]
                },
                authMenu: null,
                messageList: [],
                currentPage: 1,
                total: 0,
                strategy: {
                    'password': this.modifyPassword,
                    'exit': this.logout,
                    'download-center': this.routeToDownloadCenter,
                },
                notificationCnt: 0,
                notificationTimer: null,
            }
        },

        created() {
            this.authMenu = AUTH_MENU_LIST;
        },

        // 数据格式化
        computed: {
            ...mapState({
                username: state => state.global.username,
                name: state => state.global.name,
                userTypeRoute: state => state.global.userTypeRoute,
                token: state => state.global.token,
            })
        },

        mounted() {
            this.parent = this.$parent.$parent.$el;
            window.addEventListener('scroll', this.handleScroll, true);
        },

        beforeDestroy() {
            this.cancleNotificationsPolling();
            // 离开该页面需要移除这个监听的事件，不然会报错
            window.removeEventListener('scroll', this.handleScroll);
        },

        // 方法集合
        methods: {

            chooseStrategy(item) {
                this.strategy[item.iconfont](item);
            },

            //消息列表请求
            axiosNotificationDeatil() {
                return this.$http.get("/notification/list", {
                    params: {
                        page: this.currentPage,
                        page_size: 15
                    }
                });
            },

            //阅读消息请求
            axiosReadNotification(id) {
                return this.$http.post("notification/read", {
                    notification_id: JSON.stringify([id])
                });
            },

            cancleNotificationsPolling() {
                clearInterval(this.notificationTimer);
            },

            //关闭弹框后，删除验证
            resetDialog(formName) {
                if (this.$refs[formName]) this.$refs[formName].resetFields();
                this.dialogVisible = false;
                this.pwdDialogVisible = false;
                this.logoutDialogVisible = false;
            },

            //点击修改密码
            modifyPassword(){
                this.pwdDialogVisible = true;
                this.pwdDialogTitle = '修改密码';
            },

            //修改密码点击确定
            submitModify(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.pwdDialogVisible = false;
                        this.axiosModify().then((res) => {
                            if (res.data.code === 200) {
                                this.$message({
                                    message:"已成功修改密码",
                                    type:"success"
                                })
                            }
                            this.pwdDialogVisible = false;
                        }).catch(res => {
                            console.warn(res);
                        }).finally(() => {
                            //清空pwdForm
                            Object.keys(this.pwdForm).forEach(key=>{this.pwdForm[key]=''})
                        });
                    }else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },

            //修改密码
            axiosModify(){
                return this.$http.post("user/reset-passwd", {
                    now_passwd: this.pwdForm.now_passwd,
                    passwd: this.pwdForm.passwd,
                    passwd_repeat: this.pwdForm.passwd_repeat,
                });
            },

            //点击退出登录
            logout(){
                this.logoutDialogVisible = true;
                this.cancleNotificationsPolling();
            },

            //点击下载中心
            routeToDownloadCenter(){
                this.$router.push("/downloadCenter");
            },

            //退出登录弹窗点击确定
            subLogout() {
                localStorage.removeItem('smartAdPlatformId');//清除ls用户数据
                localStorage.removeItem('FinanceCenterHeader');//退出时清除财务中心表头
                this.$store.commit('removeUser');//清除vuex用户数据
                this.$store.commit('removeRoutes');//清除vuex中的路由数据
                this.$router.push("/login");
            },

            getNotificationDetail: async function () {
                const res = await this.axiosNotificationDeatil();
                if (res.data.code === 200) {
                    this.messageList = res.data.data.list;
                    this.total = res.data.data.pagination.total;
                }
            },

            resetNotification(){
                this.currentPage = 1;
            },

            currentChange() {
                this.getNotificationDetail();
            },

            readNotification: async function (item) {
                window.open("/#/idea"+item.url,"_blank");
                let res = await this.axiosReadNotification(item.notification_id);
                if (res.data.code === 200){
                    this.getNotificationDetail();
                }
            },

            handleHeaderChange(name){
                this.$router.push({name});
            }
        }
    }
</script>

<style lang="scss" scoped>

    .top-bar {
        height: 48px;
        margin-bottom: 16px;
        width: auto;
        //菜单合并时topbar的uibug
        //z-index: 4;
        background: $font-color-white;
    }

    .username {
        height: 30px;
        margin: 0 10px 0 0;
        display: inline-block;
        cursor: pointer;
    }

    .menu-icon{
        margin: 0 $font-size-addition 0 0;
    }

    .icon-user-head {
        img {
            width: 24px;
            margin-right: 8px;
            vertical-align: middle;
        }
    }
    .f-r {
        margin-right: 30px;
    }
    .top-menu {
        height: 48px;
        line-height: 48px;
    }
    /deep/ .f-r .el-popover {
        cursor: pointer;
    }
    .item .icon {
        vertical-align: -0.35em;
    }

    /deep/.el-button--text{
        color:#999999;
        font-size: 12px;
    }

    .profile {
        padding: 0!important;
    }

    .vertical-align-top .item{
        vertical-align: initial;
    }
</style>

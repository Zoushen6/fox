<template>
    <div class="login-container" v-loading="loading">
        <div class="login-box flex flex-1">
            <div class="login-wrapper flex-vertical" v-on:keyup.enter="onSubmit('loginForm')">
                <div class="login-logo">
                </div>
                <el-form ref="loginForm" :model="loginForm" :rules="rules" label-width="0px">
                    <div class="m-b-30">
                        <el-form-item prop="email">
                            <el-input v-model="loginForm.email" maxlength="100" placeholder="账户" clearable
                                      prefix-icon="el-icon-user"></el-input>
                        </el-form-item>
                    </div>
                    <div class="m-b-50">
                        <el-form-item prop="passwordInput">
                            <el-input placeholder="密码" maxlength="100" v-model="loginForm.passwordInput" show-password
                                      prefix-icon="el-icon-lock"></el-input>
                        </el-form-item>
                    </div>
                    <div class="valid" v-show="validAccess">
                           <span>账号名或密码有误！</span>
                    </div>
                    <el-button type="primary" @click="onSubmit('loginForm')">登 录</el-button>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>

    import commonjs from '@tools/common.js';
    export default {
        data() {
            return {
                commonjs,
                loginForm: {
                    email: '',
                    passwordInput: ''
                },
                rules: {
                    email: [
                        {required: true, message: '请输入账户名称'}
                    ],
                    passwordInput: [
                        {required: true, message: '请输入密码'}
                    ]
                },
                loading: false,
                validAccess:false,
            }
        },

        // 方法集合
        methods: {
            //登录数据请求
            axiosLogin() {
                return this.$http.post("user/login", {
                    email: this.loginForm.email,
                    password: this.loginForm.passwordInput
                });
            },

            //提交登录
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.axiosLogin().then((res) => {
                            if (res.data.code === 200) {
                                this.$store.commit('setToken', res.data.data.token);
                                //储存用户信息到local
                                let userDate = JSON.stringify({
                                    token: res.data.data.token,
                                });
                                this.commonjs.setLocalStorage('smartAdPlatformId', userDate);
                                this.$router.push("/");
                            }
                        }).finally(() => {
                            this.loading = false;
                        });
                    } else {
                        return false;
                    }
                })
            }
        }
    }
</script>

<style lang="scss" >

    .login-container {
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        display: flex;
        background: url('~@/images/login_bg.png') no-repeat #FFFFFF;
        background-size: cover;
        background-position: center;
    }

    .login-box {
        background: transparent;
        justify-content: flex-end;
        align-items: center;
    }

    .login-wrapper {
        color: #000000;
        overflow: hidden;
        align-items: center;
        margin-right: 16.41vw;
        margin-bottom: 3.9vw;
        .login-logo {
            width: 5.4vw;
            height: 7.45vw;
            min-width: 80px;
            min-height: 100px;
            background: url("~@/images/logo_wisefox.png") no-repeat 0;
            background-size: contain;
        }

        .el-form-item__content {
            width: 18.5vw;
            height: 2.5vw;
            min-width: 200px;
            min-height: 30px;
        }

        .el-form-item__error {
            left: 0.7vw;
            margin-top: 4px;
        }

        .m-b-30 {
            margin-bottom: 1.5vw;
        }

        .m-b-50 {
            margin-bottom: 2vw;
        }

        form {
            padding-top: 1.9vw;
             & > button {
                width: 18.5vw;
                font-size: $font-size-headlines;
                height: 2.5vw;
                line-height: 0px;
                min-width: 200px;
                min-height: 30px;
                font-weight: $font-weight-base;
                background-color: $theme-color;
                border: 0;
            }

            input::-webkit-input-placeholder {
                /* WebKit browsers */
                color: #ccc;
                opacity: 0.3;
            }

            input:-moz-placeholder {
                /* Mozilla Firefox 4 to 18 */
                color: #ccc;
                opacity: 0.3;
            }
            input::-moz-placeholder {
                /* Mozilla Firefox 19+ */
                color: #ccc;
                opacity: 0.3;
            }
            input:-ms-input-placeholder {
                /* Internet Explorer 10+ */
                color: #ccc;
                opacity: 0.3;
            }

            .el-button:hover, .el-button:focus {
                //background-color: rgba(47, 52, 81, 1);
                //border: 1px solid #7DD5FF;
            }

            .el-input__icon {
                line-height: 2.6vw;
                color: #ffffff;
                padding-left: 8px;
            }

            .el-input__inner {
                color: #FFFFFF;
                height: 2.5vw;
                min-height: 28px;
                padding-left: 40px;
                font-size: $font-size-base;
                background-color: #0B0C0D;
                border: 1px solid rgba(148, 148, 148, 0.8);
            }

            .el-input__prefix, .el-input__suffix {
                color: #46A8FF;
                font-size: 1vw;
            }

            .el-form-item.is-error .el-input__inner,
            .el-form-item.is-error .el-input__inner:focus,
            .el-form-item.is-error .el-textarea__inner,
            .el-form-item.is-error .el-textarea__inner:focus {
                border-color: rgba(148, 148, 148, 0.8);
            }

            input:-webkit-autofill {
                //里一层shadow  外一层shadow
                box-shadow: 0 0 0px 1000px #0B0C0D inset;
            }

            input:-internal-autofill-previewed,
            input:-internal-autofill-selected {
                -webkit-text-fill-color: #FFFFFF !important;
                border: 1px solid rgba(148, 148, 148, 1) !important;
                background: #0B0C0D!important;
            }

            @media screen and (max-width:1440px){
                .el-input__inner {
                    font-size: $font-size-addition;
                    padding-left: 32px
                }
                & > button {
                    font-size: $font-size-base;
                }
                .el-input__icon {
                    padding-left: 3px;
                    line-height: 3.3vw;
                }
            }
        }
    }

    .valid {
        position: relative;
    }
    .valid span {
        display: block;
        position: absolute;
        top: -29px;
        left: 33%;
        color: #FF7775;
        font-size: 14px;
        line-height: 1;
    }
</style>

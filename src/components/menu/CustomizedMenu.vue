<template>
    <div class="menu h-100" :class="isCollapse? 'collapse-menu': ''">
        <div class="h-100 menu-container">
            <el-menu class="h-100 el-menu"
                 :default-active="activeIndex"
                 @select="handleHeaderChange"
                 :collapse="isCollapse"
            >
                <!-- logo -->
                <router-link :class="isCollapse ? 'fox-logo' : 'logo'" to="/" alt="北极狐" title="北极狐"></router-link>
                <!-- /logo -->
                <template v-for="(item ,idx) in menu">
                    <el-submenu v-if="item.children&&item.children.length && item.authority & userTypeRoute"
                                :index="item.path">
                        <template slot="title">
                            <i class="iconfont" :class="item.iconfont"></i>
                            <span slot="title">{{item.title}}</span>
                        </template>
                        <template v-for="(it ,id) in item.children">
                            <el-menu-item v-if="it.authority & userTypeRoute" :key="id" :index="it.path"
                                          class="header-menu-item">
                                {{it.title}}
                            </el-menu-item>
                        </template>

                    </el-submenu>

                    <el-menu-item v-else-if="item.authority & userTypeRoute" :index="item.path" class="header-menu-item">
                        <i class="iconfont" :class="item.iconfont"></i>
                        <span slot="title">{{item.title}}</span>
                    </el-menu-item>
                </template>
            </el-menu>
            <div class="bottom">
<!--                todo:小屏挡住菜单-->
                <span @click="isMenuCollapse" class="iconfont collapse pointer" :class="isCollapse? 'is-collapse' : ''">&#xe66f;</span>
            </div>
        </div>
        <div class="content-container flex-vertical h-100 overflow-auto-y">
            <top-bar></top-bar>
            <div v-if="breadcrumb&&hasParent&&noTitle" class="breadcrumb m-l-16 m-r-16 background-white" v-html="breadcrumbHtml"></div>
            <transition  name="fade-transform" mode="out-in">
                <slot></slot>
            </transition>
        </div>
    </div>
</template>

<script>

    import {mapState} from "vuex"
    import topBar from '@/components/Topbar.vue';

    export default {
        name: "CustomizedMenu",

        components: {topBar},
        computed: {
            activeIndex() {
                let len = this.$store.state.menu.activeHeaderIndex.length;
                return this.$store.state.menu.activeHeaderIndex[len - 1];
            },

            breadcrumbHtml() {
                if (!this.breadcrumb) return;
                let key = this.$route.name, res = `<span class="breadcrumb-item">${this.breadcrumbMap[key].title}</span>`;
                while (this.breadcrumbMap[key].parent) {
                    key = this.breadcrumbMap[key].parent;
                    res = `<span class="breadcrumb-item">${this.breadcrumbMap[key].title}</span><span class="breadcrumb-separate">/</span>` + res;
                }
                return res;
            },

            ...mapState({
                userTypeRoute: state => state.global.userTypeRoute,
            }),

            hasParent() {
                return Boolean(this.breadcrumbMap[this.$route.name].parent);
            },

            noTitle() {
                return (this.$route.name !== 'calculationRules');
            }
        },

        watch: {
            menu: {
                handler(val) {
                    const map = {};
                    const dfs = function (map, menu, parent = "") {
                        menu.forEach(item => {
                            map[item.path] = {
                                parent,
                                title: item.title
                            };
                            if (item.children) {
                                dfs(map, item.children, item.path);
                            }
                        })
                    };
                    dfs(map, val);
                    this.breadcrumbMap = map;
                },
                immediate: true
            }
        },

        props: {
            menu: {
                type: Array,
                required: true
            },
            breadcrumb: {
                type: Boolean,
                default: true
            }
        },

        data() {
            return {
                isCollapse: false,
                breadcrumbMap: {},
            };
        },

        methods: {

            isMenuCollapse() {
                this.isCollapse = !this.isCollapse;
            },

            handleHeaderChange(name) {
                this.$router.push({name});
            }
        }
    }
</script>

<style scoped lang="scss">

    .logo {
        display: block;
        background: url("~@/images/logo.png") no-repeat center;
        background-size: contain;
        height: 26px;
        width: 100%;
        margin: 32px auto;
    }

    .fox-logo {
        display: block;
        background: url("~@/images/favicon.png") no-repeat center;
        background-size: contain;
        height: 26px;
        width: 100%;
        margin: 32px auto;
    }

    .menu-container {
        position: fixed;
        left: 0;
        transition: width;
    }

    /deep/ .el-menu {
        border-right: 0;
        background-color: #383534;
    }

    /deep/ .el-menu:not(.el-menu--collapse) {
        width: 208px;
    }

    /deep/.el-menu-item {
        background-color: transparent;
        color: rgba(255, 255, 255, .6);
        i {
            color: rgba(255, 255, 255, .6);
        }
    }

    /deep/.el-submenu__title {
        color: rgba(255, 255, 255, .6);
    }

    /deep/.el-submenu__title:hover {
        background-color: transparent;
    }

    /deep/.el-menu-item.is-active {
        box-shadow: inset 3px 0 $theme-color;
        background-color: rgba(35, 33, 31, 1);
        color: rgba(255, 255, 255, 1);
        i {
            color: inherit;
        }
    }

    .collapse-menu {

        /deep/ .el-menu-item.is-active {
            box-shadow: inset 3px 0 $theme-color;
            background-color: transparent;
        }

        /deep/ .el-menu-item.is-active {
            box-shadow: none;
        }

        .content-container {
            margin-left: 64px;
        }
    }

    .header-menu-item {
        min-width: initial;
    }

    .iconfont {
        margin-right: 8px;
        font-family: 'iconfont';
        font-size: 14px;
    }

    .collapse {
        font-size: 18px;
        float: right;
        color: $font-color-auxiliary;
        margin-top: 9px;
        margin-right: 23px;
        transition: transform 300ms;
    }

    .is-collapse {
        transform: rotateZ(180deg);
    }

    .content-container {
        margin-left: 208px;
        transition: margin-left 350ms;
    }

    /deep/ .el-submenu .el-menu-item {
        padding-left: 41px !important;
    }

    .bottom {
        position: absolute;
        bottom: 0;
        height: 40px;
        width: 100%;
    }
</style>

<style lang="scss">
    .breadcrumb {
        height: $line-height-large;
        line-height: $line-height-large;
        font-size: $font-size-base;
        padding: 0 $margin-size-middle;
        border-bottom: 1px solid $bg-color-divider;
        box-sizing: border-box;

        .breadcrumb-item, .breadcrumb-separate {
            color: $font-color-secondary;
        }

        .breadcrumb-item:last-child {
            color: $font-color-base;
        }

        .breadcrumb-separate {
            display: inline-block;
            margin: 0 8px;
        }
    }
</style>

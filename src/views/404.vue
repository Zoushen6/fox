<template>
    <div class="index-wrapper">
        <div class="index-content">
            <top-bar></top-bar>
            <div class="main">
                <p class="text-center p-t-60"><img src="~@/images/404.png" alt=""></p>
                <div v-if="this.$route.query.type !== 'noAuthority'">
                    <h1 class="text not-found">404</h1>
                    <h2 class="text-center">你要找的页面不存在</h2>
                </div>
                <div v-else>
                    <h1 class="text no-auth">您无权限浏览此页面</h1>
                    <h2 class="text-center">若想访问，请联系相关技术人员</h2>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import topBar from '@/components/Topbar.vue';

    export default {
        components: {topBar}
    }
</script>

<style lang="scss" scoped>
    .main {
        padding-top: 60px;
    }

    .text {
        text-align: center;
        line-height: 120px;
        padding-top: 20px;
    }

    .not-found {
        font-size: 100px;
    }

    .no-auth {
        font-size: 40px;
    }
</style>

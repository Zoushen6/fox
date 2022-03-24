<template>
    <div id="app" class="overflow-hidden" ref="app" :class="scrollTop>20?'add-shadow':''">
        <router-view/>
    </div>
</template>

<script>

    export default {
        name: 'App',
        data(){
            return {
                scrollTop: 0,
            };
        },

        mounted() {
            window.addEventListener('scroll', this.handleScroll, true);
        },

        beforeDestroy() {
            // 离开该页面需要移除这个监听的事件，不然会报错
            window.removeEventListener('scroll', this.handleScroll);
        },

        methods:{
            // 保存滚动值，这是兼容的写法
            handleScroll () {
                this.scrollTop = this.$refs.app.pageYOffset || this.$refs.app.scrollTop;
            },

        }
    }
</script>

<style lang="scss">
</style>

<template>
    <div class="h-100 flex-vertical">
        <customized-menu :menu="SETTINGS_MENU_LIST" :breadcrumb="true">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </customized-menu>
    </div>
</template>

<script>
    import {SETTINGS_MENU_LIST} from "@config/AuthMenu";
    import customizedMenu from '@/components/menu/CustomizedMenu.vue';

    export default {
        components: {customizedMenu},

        data() {
            return {
                SETTINGS_MENU_LIST
            };
        },
    }
</script>

<style lang="scss" scoped>

</style>

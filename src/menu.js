import router from './router/router'
import store from './store/store'
import common from "./tools/common";

router.afterEach((to, from) => {
    store.commit('setActiveHeaderIndex', to.fullPath);
});

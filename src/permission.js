import router from './router/router'
import store from './store/store'
import common from "./tools/common";
import {ROUTE_MASK_LIST} from "./config/RouteAuth";

router.beforeEach(async (to, from, next) => {
    if (!store.state.global.token) {
        const userInfo = JSON.parse(common.getLocalStorage('smartAdPlatformId', 3));
        if (userInfo && userInfo.token) {
            //保存数据到store
            store.commit('setToken', userInfo.token);
        }
    }
    const hasToken = store.state.global.token;
    if (hasToken) {
        if (to.path === '/login') {
            next({path: '/'})
        } else {
            const gotRoutes =  store.state.global.userTypeRaw !== 0;

            if (gotRoutes) {
                next();
            } else {
                try {
                    await store.dispatch('getUserInfo');

                    const roles = ROUTE_MASK_LIST[store.state.global.userTypeRaw];

                    const accessRoutes = await store.dispatch('generateRoutes', roles);

                    accessRoutes.forEach(item => {
                        router.addRoute(item);
                    })

                    next({...to, replace: true })

                } catch (error){
                    console.warn(error);
                    next({name: 'notFound'});
                }
            }
        }
    } else {
        const login = '/login';
        if (to.fullPath !== login) {
            next(login)
        } else {
            next()
        }
    }
})

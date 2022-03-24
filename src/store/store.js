import Vue from 'vue'
import Vuex from 'vuex'
import http from "@tools/promise.js";
import {asyncRoutes, constantRoutes, resetRouter} from "@/router/router";
import {GetUserRouteMask, GetRole, ALL_ROUTE_MASK} from "@config/RouteAuth";

Vue.use(Vuex);

//全局应用数据
const Global = {
    state: {
        username: '帅气的名字', //用户昵称
        userTypeRaw: 0, //计算前用户ID
        userTypeRoute: ALL_ROUTE_MASK, //计算后的routeID
        token: null,
    },
    mutations: {
        //设定用户名称
        setUsername(state, data) {
            state.username = data;
        },
        //设定用户类型
        setUserType(state, data) {
            // const role = GetRole(data);
            state.userTypeRaw = data;
            state.userTypeRoute = GetUserRouteMask(data);
        },
        //设定用户token
        setToken(state, data) {
            state.token = data;
        },
        //清除用户数据
        removeUser(state) {
            state.username = '';
            state.userTypeRaw = 0;
            state.token = '';
            state.userTypeRoute = 0;
        },
    },

    actions: {
        getUserInfo({commit}){
            return new Promise(resolve => {
                http.get("user/profile",{}).then((res) => {
                    if (res.data.code === 200) {
                        //保存数据到store
                        commit('setUsername', res.data.data.username);
                        commit('setUserType', res.data.data.role_id);
                    }
                    resolve();
                });
            })
        }
    }
};

const Menu = {
    state: {
        activeHeaderIndex: []
    },
    mutations: {
        setActiveHeaderIndex(state, data) {
            state.activeHeaderIndex = data.split('/');
        }
    },
    actions: {}
};

function hasPermission(roles, route) {
    return roles & route.meta.auth;
}

export function filterAsyncRoutes(routes, roles) {
    const res = []

    routes.forEach(route => {
        const tmp = {...route}
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })

    return res
}

const Routes = {
    state: {
        routes: [],
        addRoutes: []
    },
    mutations: {
        setRoutes: (state, routes) => {
            state.addRoutes = routes
            state.routes = constantRoutes.concat(routes)
        },
        removeRoutes:(state)=>{
            state.addRoutes = [];
            state.routes = [];
            resetRouter();
        }
    },

    actions: {
        generateRoutes({ commit }, roles) {
            return new Promise(resolve => {
                let accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
                commit('setRoutes', accessedRoutes);
                resolve(accessedRoutes)
            })
        }
    }
};

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        global: Global,
        menu: Menu,
        route: Routes,
    }
})

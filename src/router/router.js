import Vue from 'vue'
import Router from 'vue-router'
import {ALL_ROUTE_MASK,ADMIN_ROUTE_MASK,MANAGERS_ROUTE_MASK} from "@config/RouteAuth";
import {redirectIndex} from "@router/redirect";

const Login = () => import('@/views/Login.vue');
const Index = () => import('@/views/Index.vue');
const notFound = () => import('@/views/404.vue');

const UserManage = () => import('@views/UserManage/UserManage.vue');
const LabelManage = () => import('@views/LabelManage/LabelManage.vue');
const CrowdList = () => import('@views/CrowdList/CrowdList.vue');
const DirectionPackage = () => import('@views/DirectionPackage/DirectionPackage.vue');
const OperateLog = () => import('@views/OperateLog/OperateLog.vue');

const DataScreen = () => import('@views/UserInsight/DataScreen/DataScreen.vue');
const TaskManage = () => import('@views/UserInsight/TaskManage/TaskManage.vue');
const CalculationRules = () => import('@views/UserInsight/CalculationRules/CalculationRules.vue');

Vue.use(Router);
/**
 * 权限配置说明：
 * 每个路由页面需要在meta中添加authority参数，不然无法显示
 * authority:1>管理员(默认所以权限，可不加)
 admin 1 管理员
 operator 2 运营
 */
export const asyncRoutes = [
    {
        path: '/',
        name: 'index',
        component: Index,
        redirect:redirectIndex,
        meta: {auth: ALL_ROUTE_MASK},
        children: [
            {
                path: 'userManage',
                name: 'userManage',
                component: UserManage,
                meta: {auth: ADMIN_ROUTE_MASK},
            },{
                path: 'labelManage',
                name: 'labelManage',
                component: LabelManage,
                meta: {auth: MANAGERS_ROUTE_MASK},
            },{
                path: 'crowdList',
                name: 'crowdList',
                component: CrowdList,
                meta: {auth: MANAGERS_ROUTE_MASK},
            },{
                path: 'directionPackage',
                name: 'directionPackage',
                component: DirectionPackage,
                meta: {auth: ALL_ROUTE_MASK},
            },{
                path: 'dataScreen',
                name: 'dataScreen',
                component: DataScreen,
                meta: {auth: MANAGERS_ROUTE_MASK},
            },{
                path: 'taskManage',
                name: 'taskManage',
                component: TaskManage,
                meta: {auth: MANAGERS_ROUTE_MASK},
            },{
                path: 'calculationRules',
                name: 'calculationRules',
                component: CalculationRules,
                meta: {auth: MANAGERS_ROUTE_MASK},
            },{
                path: 'operateLog',
                name: 'operateLog',
                component: OperateLog,
                meta: {auth: ADMIN_ROUTE_MASK},
            }
        ]
    }, {
        path: '*',
        name: 'notFound',
        component: notFound,
        meta: {auth: ALL_ROUTE_MASK}
    }
];

export const constantRoutes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
    }
];


const createRouter = () => new Router({
    routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher;// reset router
}


// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
// push
const VueRouterPush = Router.prototype.push;
Router.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch(err => err)
};

// replace
const VueRouterReplace = Router.prototype.replace;
Router.prototype.replace = function replace(to) {
    return VueRouterReplace.call(this, to).catch(err => err)
};

export default router

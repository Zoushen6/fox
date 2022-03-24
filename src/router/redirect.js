import store from "@store/store";
import {ADMIN_ROUTE_MASK,OPERATE_MANAGE_ROUTE_MASK,CUSTOMER_ROUTE_MASK} from "@config/RouteAuth";

const redirectList = {
    [ADMIN_ROUTE_MASK] : 'userManage',
    [OPERATE_MANAGE_ROUTE_MASK] : 'dataScreen',
    [CUSTOMER_ROUTE_MASK] : 'directionPackage',
}

export const redirectIndex = function(){
    const name = redirectList[store.state.global.userTypeRoute];
    return {name};
};

import {ADMIN_ROUTE_MASK, OPERATE_MANAGE_ROUTE_MASK,MANAGERS_ROUTE_MASK, CUSTOMER_ROUTE_MASK, EXCLUDE_CUSTOMER_ROUTE_MASK} from "@config/RouteAuth";

import store from '@store/store.js';

let showOperations = () => {
    return Boolean(store.state.global.userTypeRoute & EXCLUDE_CUSTOMER_ROUTE_MASK);
}

export {
    showOperations,
}

export const NONE_ROUTE_MASK = 1<<0;
export const ADMIN_ROUTE_MASK = 1<<1;
export const OPERATE_MANAGE_ROUTE_MASK = 1<<2;
export const CUSTOMER_ROUTE_MASK = 1<<3;

export const ALL_ROUTE_MASK = (1<<23) - 1;
export const MANAGERS_ROUTE_MASK = ADMIN_ROUTE_MASK|OPERATE_MANAGE_ROUTE_MASK;
export const EXCLUDE_CUSTOMER_ROUTE_MASK = ALL_ROUTE_MASK ^ CUSTOMER_ROUTE_MASK;


export const ROUTE_MASK_LIST = {
    1: ADMIN_ROUTE_MASK,
    2: OPERATE_MANAGE_ROUTE_MASK,
    3: CUSTOMER_ROUTE_MASK,
    0: NONE_ROUTE_MASK
};

/**
 * @param id
 * @returns {*} Number
 */
export function GetUserRouteMask(id) {
    return ROUTE_MASK_LIST[id];
}

export function GetRole(roleId) {
    return roleId.reduce((res,item)=>res*10+Number(item),0);
}

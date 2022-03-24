import {mixinHelper} from "@tools/Mixin";
import * as UserTypeRoute from "@config/RouteAuth";

const config = {data: 'number', methods: 'function'};

export const RouteAuthMixin = mixinHelper([UserTypeRoute], config);

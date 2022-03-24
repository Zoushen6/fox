import th from "element-ui/src/locale/lang/th";

export default {
    data(){
        return {
            timerId:0,
        }
    },
    methods:{
        throttle(method, context, t, ...args) {
            clearTimeout(context.timerId);
            t = t || 200;
            context.timerId = setTimeout(() => {
                method.apply(context, args);
            }, t);
        },
        clearTimer(){
            clearTimeout(this.timerId);
        }
    },
    destroyed(){
        this.clearTimer();
    }
}

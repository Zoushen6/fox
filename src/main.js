import Vue from 'vue';
import App from '@/App.vue';
import router from '@router/router';
import store from '@store/store';
import '@filter/index';

import './permission'
import './menu'

/************ICONFONT**************/
import '@/icons'
/************ICONFONT**************/

/************CSS**************/
import '@styles/style.scss';
/************CSS**************/

/************ELEMENT**************/
import ElementUI from 'element-ui';
import '@styles/element-variables.scss'

Vue.use(ElementUI);
/************ELEMENT**************/

/************AXIOS**************/
import http from "@tools/promise.js"; //请求封装
Vue.prototype.$http = http;
/************AXIOS**************/

/************ComponentAutoRegister**************/
import ComponentAutoRegister from '@tools/ComponentAutoRegister.js';
/************ComponentAutoRegister**************/

/************directive**************/
import '@directive/directive.js';
/************directive**************/

Vue.config.productionTip = false;

ComponentAutoRegister.then(()=>{
    new Vue({
        router,
        store,
        render: h => h(App),
    }).$mount('#app');
});

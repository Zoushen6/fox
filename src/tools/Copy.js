import {Message} from 'element-ui';
import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);

export function CopyContent(url, success = "复制成功", fail = "复制失败...") {
    this.$copyText(url).then(e => {if (success) Message.success(success)}).catch(e => {if (fail) Message.error(fail)});
}

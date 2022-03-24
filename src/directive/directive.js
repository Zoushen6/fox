import Vue from 'vue'

const ScrollHandler = function (binding) {
    const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight;
    if (CONDITION) {
        binding.value();
    }
};

Vue.directive('loadmore', {
    bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
        SELECTWRAP_DOM.addEventListener('scroll', ScrollHandler.bind(SELECTWRAP_DOM, binding));
    },
    unbind: function (el, binding) {
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
        if (SELECTWRAP_DOM) {
            SELECTWRAP_DOM.removeEventListener('scroll', ScrollHandler.bind(SELECTWRAP_DOM, binding));
        } else {
            console.warn("【memory leak】:please set el-select prop:popper-append-to-body false");
        }
    }
});

import Vue from 'vue';
Vue.filter("size",(num)=>{
        if (num >= 1073741824) {
            num = num / (1073741824).toFixed(2) + "GB";
        } else if (num >= 1048576) {
            num = (num / 1048576).toFixed(2) + "MB";
        } else if (1048576 >= num && num >= 1024) {
            num = (num / 1024).toFixed(2) + "KB";
        } else {
            num = num + "B";
        }
        return num;
})

Vue.filter("handleLength",(val,num)=>{
    if(!val){
        return '';
    }else if(val && val.length>num){
        return val.slice(0,num) + '...'
    }
    return val;
})
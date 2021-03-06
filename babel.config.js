// 生产环境移除console
const plugins = ["@vue/babel-plugin-transform-vue-jsx"];
if (process.env.NODE_ENV === 'production') {
    plugins.push("transform-remove-console");
}
module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset'
    ],
    plugins: []
};

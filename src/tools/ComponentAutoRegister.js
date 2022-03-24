import Vue from 'vue';

const Pro = new Promise((resolve) => {

    import('lodash').then((module) => {

        const upperFirst = module.upperFirst;
        const camelCase = module.camelCase;

        const requireComponent = require.context(
            // 其组件目录的相对路径
            '../components',
            // 是否查询其子目录
            false,
            // 匹配基础组件文件名的正则表达式
            /[A-Za-z]\w+\.(vue|js)$/,
            'lazy'
        );

        const arr = [];

        requireComponent.keys().forEach(fileName => {

            arr.push(new Promise(resolve1 => {

                // 获取组件配置
                requireComponent(fileName).then((component) => {

                    // 获取组件的 PascalCase 命名
                    const componentName = upperFirst(
                        camelCase(
                            // 获取和目录深度无关的文件名
                            fileName
                                .split('/')
                                .pop()
                                .replace(/\.\w+$/, '')
                        )
                    );

                    // 全局注册组件
                    Vue.component(
                        componentName,
                        // 如果这个组件选项是通过 `export default` 导出的，
                        // 那么就会优先使用 `.default`，
                        // 否则回退到使用模块的根。
                        component.default || component
                    );

                    resolve1();

                });

            }));

        });

        Promise.all(arr).then(()=>{
            resolve();
        });

    });

});

export default Pro;



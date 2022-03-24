export function convert(obj, res, type) {
    for (const  [key, val] of Object.entries(obj)) {
        let types;
        if (typeof type === 'string') {
            types = [type];
        }
        types.forEach(type => {
            if (typeof val === type) res[key] = val;
        });
    }
}

/**
 * 根据传入对象数组和config生成对应的对象，可直接导出成mixin使用
 * @param objects Array[Object]
 * @param config Object 示例：{data: ['number', 'string'], methods: 'function'};
 * @returns {{}} 返回对象，key为config中的key， value为objects中每个object中类型为config[key]的集合
 */
export function mixinHelper(objects, config) {
    return Object.keys(config).reduce((res, key) => {
        const vars = objects.reduce((prev, next) => {convert(next, prev, config[key]); return prev;}, {});
        // vue组件中data是函数类型
        if (key === 'data') {
            res[key] = () => vars;
        } else {
            res[key] = vars;
        }
        return res;
    }, {});
}

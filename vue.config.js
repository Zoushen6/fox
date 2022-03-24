const path = require('path');

const utils = {
    assetsPath: function (_path) {
        const assetsSubDirectory = process.env.NODE_ENV === 'production'
            // 生产环境下的 static 路径
            ? 'static'
            // 开发环境下的 static 路径
            : '';
        return path.posix.join(assetsSubDirectory, _path);
    },
    resolve: function (dir) {
        return path.resolve(__dirname, dir)
    }
};

// const tinyPngWebpackPlugin = require('tinypng-webpack-plugin');
console.log(process.env.VUE_APP_URL);
console.log(process.argv.slice(2).includes('--preview')?'./web/index.html':'./web/index.php');

module.exports = {
    outputDir: 'web',
    indexPath: path.resolve(__dirname, process.argv.slice(2).includes('--preview')?'./web/index.html':'./web/index.php'), //相对于outputDir
    assetsDir: '',
    //基本路径
    publicPath: '',
    //生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    //存储时不需要eslint
    lintOnSave: false,
    //打包后文件是否添加hash
    filenameHashing: true,
    //css
    css: {
        // 是否生成css文件的源文件
        sourceMap: process.env.NODE_ENV !== 'production',
        // 是否将css文件从js文件中分离
        extract: process.env.NODE_ENV === 'production',
        loaderOptions: {
            sass: {
                // 全局sass变量
                //sass-loader 新版本
                additionalData: `@import "~@/styles/variables.scss";`
            }
        }
    },
    //webpack配置
    configureWebpack: {
        plugins: [],
        resolve: {
            // 设置别名
            alias: {
                '@': utils.resolve('src'), // 这样配置后 @ 可以指向 src 目录
                '@styles': utils.resolve('src/styles'), // 这样配置后 @styles 可以指向 styles 目录
                '@images': utils.resolve('src/images'), // 这样配置后 @images 可以指向 images 目录
                '@components': utils.resolve('src/components'), // 这样配置后 @components 可以指向 components 目录
                '@config': utils.resolve('src/config'), // 这样配置后 @config 可以指向 config 目录
                '@filter': utils.resolve('src/filter'), // 这样配置后 @filter 可以指向 filter 目录
                '@mixins': utils.resolve('src/mixins'), // 这样配置后 @mixins 可以指向 mixins 目录
                '@router': utils.resolve('src/router'), // 这样配置后 @router 可以指向 router 目录
                '@store': utils.resolve('src/store'), // 这样配置后 @store 可以指向 store 目录
                '@tools': utils.resolve('src/tools'), // 这样配置后 @tools 可以指向 tools 目录
                '@views': utils.resolve('src/views'), // 这样配置后 @views 可以指向 views 目录
                '@directive': utils.resolve('src/directive'), // 这样配置后 @directive 可以指向 directive 目录
            }
        },
        optimization: {
            minimizer: [
                //png压缩
                // new tinyPngWebpackPlugin({
                //   key:"ZcMYDkPWg7eKMpwk78BxcuoFo9JypWNv",
                //   ext: ['png', 'jpeg', 'jpg']
                // })
            ]
        },
        //不加入打包的插件
        externals: {},
        devServer: {
            // Paths
            contentBase: path.resolve(__dirname, '../web'), // /web/
            proxy: {
                "/": {
                    target: process.env.PROXY_TARGET,
                    ws: false,
                    changeOrigin: true,
                    logLevel: "debug"
                }
            },
            // Various Dev Server settings
            host: '0.0.0.0', // can be overwritten by process.env.HOST
            port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        },
    },
    chainWebpack(config) {
        // set svg-sprite-loader
        // issue:https://github.com/PanJiaChen/vue-element-admin/issues/980
        config.module
            .rule('svg')
            .exclude.add(utils.resolve('src/icons'))
            .end();
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(utils.resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end();

        config
            .when(process.env.NODE_ENV !== 'development',
                config => {

                    config
                        .optimization.splitChunks({
                        chunks: 'all',
                        cacheGroups: {
                            libs: {
                                name: 'chunk-libs',
                                test: /[\\/]node_modules[\\/]/,
                                priority: 10,
                                chunks: 'initial' // only package third parties that are initially dependent
                            },
                            elementUI: {
                                name: 'chunk-elementUI', // split elementUI into a single package
                                priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                                test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                            },
                            commons: {
                                name: 'chunk-commons',
                                test: utils.resolve('src/components'), // can customize your rules
                                minChunks: 3, //  minimum common number
                                priority: 5,
                                reuseExistingChunk: true
                            }
                        }
                    });
                    // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
                    config.optimization.runtimeChunk('single')
                }
            );
    }
};

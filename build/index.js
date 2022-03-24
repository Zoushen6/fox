const {run} = require('runjs');
const chalk = require('chalk');
const config = require('../vue.config.js');
const http = require('http');
const url = require('url');
const fs = require('fs');
const mimeTypes = require('mime-types');
const path = require('path');
const net = require('net');
const httpProxy = require('http-proxy');

const rawArgv = process.argv.slice(2);
const args = rawArgv.join(' ');

const proxyMap = {
  develop: 'https://ads-desk-dev.wisemedia.cn/',
  test: 'https://ads-desk-test.wisemedia.cn/',
  pro: 'https://polestar.wisemedia.cn/',
};

if (process.env.npm_config_preview || rawArgv.includes('--preview')) {
    run(`vue-cli-service build ${args}`);

    console.log(chalk.green(`> Proxy to  ${proxyMap[process.env.NODE_ENV.trimEnd()]}`));

    let proxy = httpProxy.createProxyServer({
        target: proxyMap[process.env.NODE_ENV.trimEnd()],//后台地址 NODE_ENV设置时会将空格也带入
        changeOrigin: true
        // 下面的设置用于https
        // ssl: {
        // key: fs.readFileSync('server_decrypt.key', 'utf8'),
        // cert: fs.readFileSync('server.crt', 'utf8')
        // },
        // secure: false
    });

    proxy.on('error', function (err, req, res) {
        console.log(err);
        res.writeHead(500, {
            'content-type': 'text/html'
        });
        res.end('Something went wrong. And we are reporting a custom error message.');
    });
    proxy.on('proxyRes', function (proxyRes, req, res) {
        //console.log('Raw Response from the server:',proxy.optionsx.target.href, 'is:', JSON.stringify(proxyRes.headers, true, 2));
    });
    proxy.on('open', function (proxySocket) {
        // listen for messages coming FROM the target here
        proxySocket.on('data', hybiParseAndLogMessage);
    });
    proxy.on('close', function (res, socket, head) {
        // view disconnected websocket connections
        console.log('Client disconnected');
    });

    //过滤掉静态资源不走代理
    let needUsePorxy = function (pathname) {
        const mime = ['.gif', '.png', '.jpeg', '.jpg', '.ico', '.html', '.css', '.js', '.woff2', '.woff', '.ttf', '.swf', '.txt', '.svg'];
        let num = 0;
        for (let i = 0; i < mime.length; i++) {
            if (pathname.indexOf(mime[i]) > 0) {
                num = pathname.indexOf(mime[i]);
                break;
            }
        }
        return num <= 0;
    };

    const PORT = 6657;

    let server = http.createServer(function (request, response) {

        let pathname = url.parse(request.url).pathname;
        console.log("===========pathname:==" + pathname + "====================");

        //要拿到requestUrl的全称
        let thisPath = url.parse(request.url).path;
        console.log("===========thisPath:==" + thisPath + "====================");

        //判断如果是接口访问，则通过proxy转发
        if (needUsePorxy(pathname)) {

            proxy.web(request, response); //不符合要求的不走代理
            console.log(pathname, ':开启代理');
            return;
        }

        let realPath = path.join("./web", pathname);
        console.log("===========realPath:==" + realPath + "====================");

        let ext = path.extname(realPath);
        ext = ext ? ext.slice(1) : 'unknown';

        fs.exists(realPath, function (exists) {
            if (!exists) {
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                response.write("This request URL " + pathname + " was not found on this server.");
                response.end();
            } else {
                if (fs.lstatSync(realPath).isDirectory()) {//判断是不是文件夹
                    response.writeHead(404, {
                        'Content-Type': 'text/plain'
                    });
                    response.write("This request URL " + pathname + " was a directory on this server. Permission Denied !");
                    response.end();
                } else {
                    fs.readFile(realPath, "binary", function (err, file) {
                        if (err) {
                            response.writeHead(500, {
                                'Content-Type': 'text/plain'
                            });
                            response.end(err);
                        } else {
                            let contentType = mimeTypes.lookup(ext) || "text/plain";
                            response.writeHead(200, {
                                'Content-Type': contentType
                            });
                            response.write(file, "binary");
                            response.end();
                        }
                    });
                }
            }
        });
    });

    server.portIsOccupied = function (port) {
        // 创建服务并监听该端口
        let _this = this;
        let serverTest = net.createServer().listen(port);
        serverTest.on('listening', function () { // 执行这块代码说明端口未被占用
            serverTest.close(); // 关闭服务
            console.log('The port【' + port + '】 is available.');// 控制台输出信息
            server.listen(PORT);
            console.log("Server runing on at port: " + PORT + ".");
        });
        serverTest.on('error', function (err) {
            if (err.code === 'EADDRINUSE') { // 端口已经被使用
                console.log('The port【' + port + '】 is inavailable.'); // 控制台输出信息
                PORT++;
                _this.portIsOccupied(PORT);
            }
        });
    };

    // 检测端口是否被占用
    server.portIsOccupied(PORT);

    console.log(chalk.green(`> Preview at  http://localhost:${PORT}/index.html`));
} else {
    run(`vue-cli-service build ${args}`);
}

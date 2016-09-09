/**
 * 默认的运行为DEV,当为TRUE是为生产构建
 * string 为参数名
 * 以下相当于在命令行中添加 --sysName console
 */
var defaultOps = {
    boolean: 'build',
    default: {build: false}
};
var path = require('path')
/**
 * 获取命令行参数集合
 * @param {json} defaultOps 设置参数默认值,如果在命令行中没有设置此参数,则使用此值
 */
function getCommandLineParms(defaultOps) {
    const minimist = require('minimist');
    return minimist(process.argv.slice(2), defaultOps);
}
const options = getCommandLineParms(defaultOps);
console.log('----------------------------------/n')
console.log('命令行参数:', options)
console.log('----------------------------------/n')
/**
 * 判断项目录是否有效
 */
function getProjectConfig() {
    if (!options.sysName) {
        console.log('----------------------------------/n')
        console.log('未在命令行中指定项目参数,格式为: --sysName 项目名称')
        console.log('----------------------------------/n')
        return false;
    }
    return setProjectConfig(options.sysName)
}
const projectOpts = {
    'console': {
        build: {
            sysName: 'console',
            host: 'console.wulianaq.com',
            publicPath: 'http://console.wulianaq.com',
            outPutPath: '../../dist/console',
            template: 'mvvm/build/index.template.console.html'
        },
        dev: {
            sysName: 'console',
            host: 'localhost',
            port: 9083,
            publicPath: 'http://localhost:9083/',
            outPutPath: '../../dist/console'
        }
    },
    'mobile': {
        build: {
            sysName: 'mobile',
            host: 'm.wulianaq.com',
            publicPath: 'http://m.wulianaq.com',
            outPutPath: path.resolve(__dirname, 'dist/m'),
            template: 'mvvm/build/index.template.mobile.html'
        },
        test: {
            sysName: 'mobile',
            host: '192.168.28.218',
            port: 9073,
            publicPath: 'http://192.168.28.218:9073/',
            // outPutPath: '../../dist/m-test',
            outPutPath: path.resolve(__dirname, 'dist/m-test'),
            template: 'mvvm/build/index.template.mobile.html'
        },
        dev: {
            sysName: 'mobile',
            host: '192.168.29.33',
            port: 9093,
            publicPath: 'http://192.168.29.33:9093/',
            outPutPath: path.resolve(__dirname, 'dist/m')
        }
    },
    'www': {
        build: {
            sysName: 'www',
            host: 'www.wulianaq.com',
            publicPath: 'http://www.wulianaq.com',
            outPutPath: path.resolve(__dirname, 'dist/www'),
            template: 'mvvm/build/index.template.www.html',
            //构建时,要将此目录复制到DIST目录
            copyFolder: [{
                dir: 'mvvm/www/src/components/ueditor/ueditor-1.4.3.3/dist/utf8-php/**/*',
                toDir: 'ueditor'
            }, {
                dir: 'mvvm/www/src/ieSupport/polyfill.min.js',
                toDir: ''
            }]
        },
        dev: {
            sysName: 'www',
            host: '192.168.29.33',
            port: 9073,
            publicPath: 'http://192.168.29.33:9073/',
            outPutPath: path.resolve(__dirname, 'dist/www')
        }
    },
}
function getProjectConfigByName(projectName, domain) {
    var config = {
        sysName: projectName,
        host: projectName + domain,
        publish: null,
        template: null
    }
    config.outPutPath = 'dist/' + config.sysName
    config.template = 'mvvm/build/index.template.' + config.sysName + '.html'
    return config
}
function setProjectConfig(projectName) {
    var currentOpts = projectOpts[projectName]['dev'];
    if (options.build) {
        currentOpts = projectOpts[projectName]['build']
    } else if (options.test) {
        currentOpts = projectOpts[projectName]['test']
    }
    if (!currentOpts) {
        currentOpts = getProjectConfigByName(projectName)
    }
    currentOpts.isIP = options.ip === 'true' ? true : false;
    currentOpts.openProxy = options.proxy === 'true' ? true : false;
    console.log(currentOpts.copyFolder)
    console.log(currentOpts);
    return currentOpts
}
//console.log(setProjectConfig(['console','supp']))
module.exports = getProjectConfig()

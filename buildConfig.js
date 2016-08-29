/**
 * 默认的运行为DEV,当为TRUE是为生产构建
 * string 为参数名
 * 以下相当于在命令行中添加 --sysName console
 */
var defaultOps = {
    boolean: 'build',
    default: {build:false}
};
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
        build:{
            sysName: 'console',
            host: 'console.wulianaq.com',
            publicPath: 'http://console.wulianaq.com',
            outPutPath: '../../dist/console',
            template: 'mvvm/build/index.template.console.html'
        },
        dev:{
            sysName: 'console',
            host: 'localhost',
            port:9083,
            publicPath: 'http://localhost:9083/',
            outPutPath: '../../dist/console'
        }

    },
    'mobile': {
        build:{
            sysName: 'mobile',
            host: 'm.wulianaq.com',
            publicPath: 'http://m.wulianaq.com',
            outPutPath: '../../dist/m',
            template: 'mvvm/build/index.template.mobile.html'
        },
        dev:{
            sysName: 'mobile',
            host: '192.168.29.33',
            port:9093,
            publicPath: 'http://192.168.29.33:9093/',
            outPutPath: '../../dist/mobile'
        }

    },
    'www': {
        build:{
            sysName: 'www',
            host: 'www.wulianaq.com',
            publicPath: 'http://www.wulianaq.com',
            outPutPath: '../../dist/www',
            template: 'mvvm/build/index.template.www.html'
        },
        dev:{
            sysName: 'www',
            host: 'localhost',
            port:9073,
            publicPath: 'http://localhost:9073/',
            outPutPath: '../../dist/www'
        }

    },

}
function getProjectConfigByName(projectName,domain) {
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
    var currentOpts = options.build ? projectOpts[projectName]['build'] :projectOpts[projectName]['dev']
    if (!currentOpts) {
        currentOpts = getProjectConfigByName(projectName)
    }
    currentOpts.isIP = options.ip === 'true' ? true : false;
    currentOpts.openProxy = options.proxy === 'true' ? true : false;
    console.log(currentOpts);
    return currentOpts
}
//console.log(setProjectConfig(['console','supp']))
module.exports = getProjectConfig()

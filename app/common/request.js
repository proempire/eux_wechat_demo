var request = require('superagent').agent();
var cheerio = require('cheerio');
var _ = require('underscore');

/**
 * error说明:
 * 'no-error': 内部使用,用来中断promise的运行
 * 'not-login': 未获得用户账号信息
 * @constructor
 */
function Request(user) {
    // this.user = {
    //     username: 'lvzheyang',
    //     password: 'yang11212'
    // };
    console.log(user);
    this.user = user;
}

/**
 * opt string request.get(string)
 * @param opt
 * @returns {Promise}
 */
Request.prototype.request = function(opt) {
    var _self = this;

    var config = {
        method: 'get'
    }

    _.isObject(opt) && _.extend(config, opt);
    if (_.isString(opt)) {
        config.url = opt;
    }

    // _self.login(config);

    console.log('开始请求');

    return new Promise(function(resolve, reject) {
        var req = request[config.method](config.url);
        config.header && req.set(config.header);
        config.data && req.send(config.data);

        //先发起请求试试
        req.then(function(res) {

            if (res.redirects.length && res.redirects[res.redirects.length-1].indexOf('cas.xjtu.edu.cn/login') !== -1) {
                //如果重定向到了西交的cas登录页,模拟登录
                if (!_self.checkUser()) {
                    //如果此时没有用户的信息,抛出异常
                    throw new Error('not-login');
                }

                //需要POST的数据
                var data = {username: _self.user.username, password: _self.user.password, code: '', lt:'', execution:'e1s1', _eventId:'submit', submit:'登录'}

                //首先获取到页面中的lt票据
                var $ = cheerio.load(res.text);
                data.lt = $('input[name=lt]').val();

                var req = request
                    .post('https://cas.xjtu.edu.cn/login')
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .send(data)
                return req;
            } else {
                //不需要登录,直接返回
                resolve(res);
                throw new Error('no-error');
            }
        })
        .then(function(res) {
            console.log('走到了这里');


            //如果走向正常,这里会redirect到认证通过的页面
            var $ = cheerio.load(res.text);

            if ($('meta[http-equiv= "Refresh"]') && $('meta[http-equiv= "Refresh"]').attr('content')) {
                var content = $('meta[http-equiv= "Refresh"]').attr('content');
                var url = content.split(';url=')[1];

                //如果走到了重定向页面,则帮助重定向获取页面信息
                var req = request[config.method](url);
                config.header && req.set(config.header);
                config.data && req.send(config.data);
                return req;
            } else {
                if (res.text.indexOf('您已经成功登录中央认证系统')) {
                    //直接跑到了这里,没有去重定向页面,手动帮助重新请求URL
                    var req = request[config.method](config.url);
                    config.header && req.set(config.header);
                    config.data && req.send(config.data);
                    return req;
                }

                //如果走到了这里,应该有两种情况:1. 直接进入到了访问界面 2. 退回到了登录界面
                if (res.redirects.length && res.redirects[res.redirects.length-1].indexOf('cas.xjtu.edu.cn/login') !== -1) {
                    //退回到了登录界面
                    throw new Error('loggin failed');
                } else {
                    resolve(res);
                    throw new Error('no-error');
                }
            }
        })
        .then(function(res) {
            //到这里的是成功的页面
            //严谨一点还是做一个检测
            console.log('获得了页面')
            if (res.redirects.length && res.redirects[res.redirects.length-1].indexOf('cas.xjtu.edu.cn/login') !== -1) {
                console.log(res.text);
                throw new Error('loggin failed');
            }
            resolve(res);
        })
        .catch(function(err) {
            //实在是很不优雅的实现
            //如果是内部中断,此异常不处理,否则抛给调用处
            if (err.message === 'no-error') {
                console.log('no');
                return;
            }
            console.error(err);
            reject(err);
        })
    });
}

Request.prototype.checkUser = function() {
    return !!this.user;
}

/**
 * 已测试通过的网站:
 * http://card.xjtu.edu.cn/CardManage/CardInfo/Transfer 校园卡充值
 * http://ssfw.xjtu.edu.cn/index.portal?.pn=p1142_p1144_p1156 成绩查询
 * http://ssfw.xjtu.edu.cn/index.portal?.pn=p1142_p1182_p1183 教学评价
 * http://ssfw.xjtu.edu.cn/index.portal?.pn=p1142_p1145_p1542 课表查询
 * http://my.xjtu.edu.cn/f/u29l1s103/p/xjtustu_schedule.u29l1n369/max/render.uP my上的课表(往往最早的课表就是这里的)(需要先抓取主页)
 * http://202.117.1.152:8080/User/GetAttendRepList 考勤信息(注意POST方法和header的传入,需要先访问user页)
 */
function test() {
    new Request().request('http://202.117.1.152:8080/User')
        .then(function(res) {
            console.log('获得了res');
            // console.log(res.text);
            // //获得考勤情况,需要先访问一下http://202.117.1.152:8080/User获取相应的cookie
            // new Request().request({method: 'post', url: 'http://202.117.1.152:8080/User/GetAttendRepList', header: {
            //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            // }, data: {json: true}})
            //     .then(function(res) {
            //         console.log(res.body);
            //     })


            //访问my.xjtu.edu.cn上的课表必须要先访问my.xjtu.edu.cn的首页,再发起一次请求课表。。。这一点原因手动在浏览器访问以下就知道了
            // new Request().request('http://my.xjtu.edu.cn/f/u29l1s103/p/xjtustu_schedule.u29l1n369/max/render.uP')
            //     .then(function(res) {
            //         console.log(res.text);
            //     })
            // if (res.redirects.length) {
            //     //如果有重定向,要重新访问一次,不然就定向到首页了,目前发现ssfw.xjtu.edu.cn有这个问题
            //     console.log(res.redirects);
            //     test();
            // } else {
            //     console.log(res.text);
            // }
        })
        .catch(function(err) {
            console.error(err);
        })
}

// test();

module.exports = Request;

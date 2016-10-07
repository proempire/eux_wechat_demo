var Request = require('../../common/request');
var scoreHandler = require('../../model/adapter/getScore');

const URL = 'http://ssfw.xjtu.edu.cn/index.portal?.pn=p1142_p1144_p1156';

function getScore(user) {
    return new Promise(function (resolve, reject) {
        var request = new Request(user);
        (function() {
            var arg = arguments;
            request.request(URL)
                .then(function(res) {
                    if (res.redirects.length) {
                        //有redirect的情况下要在循环
                        // console.log(res);
                        arg.callee();
                    } else {
                        // console.log(res);
                        resolve(res);
                    }
                })
                .catch(function(err) {
                    reject(err);
                })
        })();
    });

}


module.exports = function* (next) {
    var _self = this;
    var user = this.cookies.get('user');
    user = user && JSON.parse(user);
    try{
        var res = yield getScore(user);
    } catch (err) {
        if (err.message == 'not-login') {
            _self.body = {
                ret: -2,
                message: '未获取到用户登录信息'
            }
        }
        console.log(err);
        return; //搞不懂异常发生了后面的语句竟然还能执行。。。
    }
    var resultJSON = scoreHandler(res.text);

    this.body = resultJSON;
}
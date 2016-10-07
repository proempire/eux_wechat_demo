var request = require('superagent').agent();
var cheerio = require('cheerio');

function check(param) {
    return true;
}

function checkUser(data) {

    return new Promise(function (resolve, reject) {
        var postData = {
            username:data.username,
            password:data.password,
            code: '',
            lt:'',
            execution:'e1s1',
            _eventId:'submit',
            submit:'登录'
        };

        //看看能否登录成功
        request
            .get('https://cas.xjtu.edu.cn/login')
            .then(function(res) {
                var $ = cheerio.load(res.text);
                postData.lt = $('input[name=lt]').val();

                var req = request
                    .post('https://cas.xjtu.edu.cn/login')
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .send(postData)

                return req;
            })
            .then(function(res) {
                if (res.text.indexOf('您已经成功登录中央认证系统。') !== -1) {
                    resolve();
                } else {
                    //验证不通过
                    reject();
                }
            })
            .catch(function(err) {
                reject(err);
            })
    });
}

module.exports = function* (next) {
    var _self = this;

    if (check(this.request.body)) {
        //如果数据验证通过,则记录用户名和密码,且跳回原来的地方
        var data = this.request.body;
        try {
            yield checkUser(data);
        } catch (err) {
            console.log('验证失败')
            _self.redirect('back')
            return;
        }
        console.log('验证成功');
        _self.cookies.set('user', JSON.stringify({username: data.username, password: data.password}), {expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)});
        console.log('设置cookies成功');
        _self.redirect(data.ref);
    }
}
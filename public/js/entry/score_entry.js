require('../lib/zepto');
var ejs = require('../lib/ejs');

var util = require('../common/util');

(function(win, $) {
    function getData(callback) {
        var baseData = util.local.get('score');
        if (baseData) {
            callback(baseData);
            return;
        }
        getNewData(callback);
    }

    function getNewData(callback) {
        $.get('/dean/getScore', function(json) {
            if (json.ret == -2) {
                //需要登录
                // alert(win.location.pathname);
                win.location.href = '/user/login?ref=' + win.location.pathname;
            } else if (json.ret == 0) {
                callback(json.data);
                util.local.set('score', json.data);
            } else {
                //做一些其他处理,比如toast告诉用户数据拉取出错了
            }
        });
    }

    function render(data) {
        var str = $('#tpl_score').html();
        var html = ejs.render(str, {list: data.scoreList});
        $('#score').html(html);
    }

    function updateData() {
        setTimeout(function() {
            getNewData(function(data) {
                render(data);
            })
        }, 0)
    }

    (function init() {
        getData(function(data) {
            render(data);
        });
        updateData();
    })();
}(window, Zepto));
var cheerio = require('cheerio');
// var fs = require('fs');

// var html = fs.readFileSync('./test.html');


function adapter(scoreHTML) {
    var $ = cheerio.load(scoreHTML);

    var json = {
        ret: -1, //0表示正常, -1表示异常
        data: {},
        msg: ''
    }

    if (!$('#queryGridf1131').html()) {
        json.msg = '成绩列表不存在,请排查页面是否正常获取'
        return json;
    }

    var titleArr = [];

    $('#queryGridf1131 thead tr a').each(function() {
        titleArr.push($(this).text());
    });

    //学年学期 课程代码 课程名称 课程类别 考试性质 成绩 学分 特殊原因 修读性质 是否生效
    // titleArr = ['xnxq', 'kcdm', 'kcmc', 'kclb', 'ksxz', 'cj', 'xf', 'tsyy', 'xdxz', 'sfss'];

    var tr = $('#queryGridf1131 tbody tr');

    json.data.scoreList = [];
    json.data.len = tr.length;

    var detailMap = [
      '总成绩','平时成绩','标准成绩', '期中成绩', '实验成绩', '期末成绩', '其他成绩'
    ];

    // var detailMap = [
    //     'zcj','pscj','bzcj', 'qzcj', 'sycj', 'qmcj', 'qtcj'
    // ];

    tr.each(function(i, item) {
        var info = {};
        $(item).find('td').each(function(i, item) {
            //对于成绩要特殊处理一下
            if ($(item).html().indexOf('<a') != -1) {
                info[titleArr[i]] = trim($(item).find('a').text());
                //对隐藏信息进行展开
                var str = $(item).html();
                var detailArr = str.match(/newFamily\((.*?)\)/)[1].split(',');
                detailArr.forEach(function(detail, i) {
                    if (detailMap[i]) {
                        info[detailMap[i]] = trim(detail);
                    }
                });
            } else {
                info[titleArr[i]] = trim($(item).text());
            }
        });
        json.data.scoreList.push(info);
    });

    json.ret = 0;

    return json;

}

//格式化一下输出,去除乱七八糟的东西
function trim(str) {
    return str.replace(/[\t|\n|\r]/g, '').trim().replace(/&.*?;/g, '');
}

module.exports = adapter;
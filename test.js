var request = require('superagent').agent();
var cheerio = require('cheerio');

request
    .get('https://cas.xjtu.edu.cn/login')
    .then(function (res) {
        // Calling the end function will send the request
        var $ = cheerio.load(res.text);
        var lt = $('input[name=lt]').val();
        // var cookie = res.header['set-cookie'][0].split(';')[0];

        var data = {
            username: 'lvzheyang',
            password: 'yang11212',
            code: '',
            lt: lt,
            execution: 'e1s2',
            _eventId: 'submit'
        };

        var req = request
            .post('https://cas.xjtu.edu.cn/login')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            // .set('Content-Length', 145)
            .send(data);

        console.log(req);
        return req;
    })
    .then(function(res) {
        console.log(res.text);
    })
    .catch(function(err) {
        console.error(err);
    })
;
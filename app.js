var koa = require('koa');
var app = koa();
var router = require('koa-router')();
var logger = require('koa-logger');
var handlebars = require("koa-handlebars");
var bodyParser = require('koa-bodyparser');
var session = require('koa-session');

app.use(bodyParser());
app.use(session(app));

app.use(handlebars({
	extension: "html",
	viewsDir: 'app/views'
}));

//路由引入
var dean = require('./app/router/dean/entry');
var user = require('./app/router/user/entry');

app.use(function *(next){
	var start = new Date;
	yield next;
	var ms = new Date - start;
	console.log('%s %s - %s', this.method, this.url, ms);

});

app.use(require('koa-static')(__dirname + '/public'));

//路由处理
router.use('/dean', dean.routes());
router.use('/user', user.routes());

app
	.use(router.routes())
	.use(router.allowedMethods());

app.use(logger());


app.listen(3000)
	.on('listening', function(){
		console.log('listening on server at localhost:'+this.address().port);
	});
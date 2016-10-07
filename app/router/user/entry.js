var router = require('koa-router')();

var loginGet = require('./login');
var loginPost = require('./loginPost');
var logoutGet = require('./logout');

router.get('/login', loginGet);
router.post('/login', loginPost);
router.get('/logout', logoutGet);

module.exports = router;

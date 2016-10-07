var router = require('koa-router')();

var getScoreHandler = require('./getScore');
var scoreHandler = require('./score');

router.get('/getScore', getScoreHandler);
router.get('/score', scoreHandler);

module.exports = router;

module.exports = function* (next) {
    var _self = this;

    yield this.render('score', {
        title: '分数'
    });
}
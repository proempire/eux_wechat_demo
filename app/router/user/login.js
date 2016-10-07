module.exports = function* (next) {
    var _self = this;

    yield this.render('login', {
        title: '登录',
        ref: _self.query.ref
    });
}
module.exports = function* (next) {
    this.cookies.set('user',  null);
    this.body = '已成功登出!';
    console.log('清除cookies成功');
}
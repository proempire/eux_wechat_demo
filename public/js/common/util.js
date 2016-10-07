module.exports = {
    /**
     * local二次封装Storage,规范只能用于存储对象,如果要存储其他类型,先转换为对象类型。
     */
    local: {
        get: function(key) {
            return JSON.parse(window.localStorage.getItem('eux_' + key));
        },
        set: function(key, value) {
            window.localStorage.setItem('eux_'+ key, JSON.stringify(value));
        }
    }
}
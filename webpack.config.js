module.exports = {
    entry: {
        login: "./public/js/entry/login_entry.js",
        score: "./public/js/entry/score_entry.js",
    },
    output: {
        path: __dirname + "/public/js",
        filename: "[name].js"
    }
}
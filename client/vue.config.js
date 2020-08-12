const path = require('path')
const debug = process.env.NODE_ENV !== 'production'

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/', // 根域上下文目录
    outputDir: __dirname + '/../client_vue', // 构建输出目录       

    devServer: {
        open: true,
        port: 5000,
    }
}

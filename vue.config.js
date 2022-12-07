// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
//   // base: '/vue_shop/'

// })
module.exports = {
  assetsDir: 'static',
  parallel: false,
  publicPath: './',
  devServer: {
      port: 5000, // 端口号
      open: true // 是否自启动
  }
}

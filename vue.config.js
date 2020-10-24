const webpack = require("webpack");
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// let target = process.env.VUE_APP_BASEURL;
const FileManagerPlugin = require('filemanager-webpack-plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",

        jQuery: "jquery",
        "windows.jQuery": "jquery"
      })
    ]
  },
    pluginOptions: {
       electronBuilder: {
           builderOptions: {
                  win: {
                      icon: './public/app.ico'
                  },
                  mac: {
                      icon: './public/app.png'
                  },
                  productName: '轻会议'
              }
          }
  },
  lintOnSave: false,
  devServer: {
    overlay: {
      warning: false,
      errors: false
    },
    // host: '127.0.0.1',
    // port: '8080',
    // https: true,
    open: false,
    proxy: {
      "/api": {
        // target:"http://live.lighos.com",  // 正式服务器
        target: "	https://meeting-api.lighos.com", // 测试服务器
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api"
        },
        timeout: 30000
      }
    },
  },


}
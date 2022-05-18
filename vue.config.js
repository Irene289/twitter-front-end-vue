console.log(process.env.VUE_APP_BASEURL)

// module.exports = {
//   publicPath: process.env.NODE_ENV === 'production'
//     ? '/twitter-front-end-vue/'
//     : '/'
// }
// module.exports = {
//   configureWebpack: {
//     devtool: 'source-map'
//   }
// }

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  configureWebpack: {
    devtool: 'source-map'
  }
}
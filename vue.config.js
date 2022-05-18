console.log(process.env.VUE_APP_BASEURL)

module.exports = {
  publicPath: process.env.VUE_APP_BASEURL === 'production'
    ? '/twitter-front-end-vue/'
    : '/'
}

module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  }
}
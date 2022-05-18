console.log(process.env.VUE_APP_BASEURL)

// module.exports = {
//   publicPath: process.env.NODE_ENV === 'production'
//     ? '/twitter-front-end-vue/'
//     : '/'
// }

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? './'
  : '/'
  
}



module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  }
}
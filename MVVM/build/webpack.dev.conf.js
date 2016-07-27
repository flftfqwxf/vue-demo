var config = require('./webpack.base.conf')

config.devtool = 'eval-source-map'

config.devServer = {
  host: '127.0.0.1',
  historyApiFallback: true,
  noInfo: true
}

module.exports = config

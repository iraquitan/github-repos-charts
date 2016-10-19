/**
 * Created by iraquitan on 10/18/16.
 */
module.exports = {
  entry: {
    filename: './app/scripts/main.js'
  },
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};

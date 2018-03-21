const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['es2015', {'modules': false}]
            ]
          }
        }
      }
    ]
  },
  // plugins: [
  //   new CopyWebpackPlugin([
  //     {from: 'dist', to: 'demo' }
  //   ])
  // ],
  devServer: {
    contentBase: './demo',
    overlay: {
      warnings: true,
      errors: true
    }
  },
};

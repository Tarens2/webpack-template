const path = require('path');
const webpack = require('webpack');
const ReloadPlugin = require('reload-html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const extractSass = new ExtractTextPlugin({
  filename: '[name].css',
});

const page = name => new HtmlWebpackPlugin({
  template: `src/views/pages/${name}/${name}.pug`,
  inject: 'body',
  title: 'App',
  filename: `${name}.html`,
});


const config = {
  build: './public',
  src: {
    views: '/src/views/',
    styles: '/src/styles/',
    js: '/src/js/',
  },
};

module.exports = {
  entry: `${path.join(__dirname, config.src.js)}main.js`,
  output: {
    path: path.resolve(__dirname, config.build),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        use: ['babel-loader', 'eslint-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                sourceMap: true,
              },
            },
            {
              loader: 'resolve-url-loader',
            },
            {
              loader: `sass-loader?sourceMap=${config.src.styles}main.scss`,
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  autoprefixer(),
                  cssnano(),
                ],
              },
            },
          ],
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.(jpe?g|png|woff|gif|woff2|eot|ttf|svg|otf)(\?[a-z0-9=.]+)?$/,
        loaders: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[path][name].[ext]',
              context: 'src',
            },
          },
        ],
      },
      {
        test: /\.(pug|jade)$/,
        use: [
          {
            loader: 'html-loader?minimize=false',
            query: {
              minimize: false,
              collapseWhitespace: false,
              conservativeCollapse: false,
            },
          },
          {
            loader: 'pug-html-loader?minimize=false',
            query: {
              minimize: false,
              collapseWhitespace: false,
              conservativeCollapse: false,
            },
          },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    contentBase: [config.build],
    hot: true,
    watchContentBase: true,
    inline: true,
    stats: 'errors-only',
  },
  plugins: [
    extractSass,
    page('index'),
  ],
};

if (process.env.NODE_ENV === 'development') {
  module.exports.devtool = '#source-map';
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.HotModuleReplacementPlugin(),
    new ReloadPlugin(),
  ]);
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
    }),
  ]);
}


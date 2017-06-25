const {resolve} = require('path');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const {NoEmitOnErrorsPlugin, ProgressPlugin, NamedModulesPlugin, EnvironmentPlugin, NormalModuleReplacementPlugin, HashedModuleIdsPlugin} = require('webpack');
const {AotPlugin} = require('@ngtools/webpack');
const {UglifyJsPlugin} = require('webpack').optimize;
const path = require('path');

const cssLoader = () => ({
  loader: 'css-loader',
  options: {
    sourceMap: false,
    importLoaders: 1
  }
});
const postcssLoader = () => ({
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins: () => ([
      autoprefixer(),
      cssnano({
        autoprefixer: false,
        safe: true,
        mergeLonghand: false,
        // safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
        discardComments: {remove: (comment) => !(/@preserve|@license|[@#]\s*source(?:Mapping)?URL|^!/i).test(comment)}
      })
    ])
  }
});
const sassLoader = () => ({
  loader: 'sass-loader',
  options: {
    sourceMap: false,
    precision: 8
  }
});

module.exports = {
  target: 'node',
  devtool: false,
  resolve: {
    extensions: ['.ts', '.js']
  },
  entry: {
    server: './src/server.ts'
  },
  output: {
    path: root('./dist/server'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {enforce: 'pre', test: /\.js$/, loader: 'source-map-loader', exclude: [/\/node_modules\//]},
      {test: /\.ts$/, loader: '@ngtools/webpack'},
      {test: /\.html$/, loader: 'raw-loader'},
      {test: /\.css$/, use: ['exports-loader?module.exports.toString()', cssLoader(), postcssLoader()]},
      {
        test: /\.scss$|\.sass$/,
        use: ['exports-loader?module.exports.toString()', cssLoader(), postcssLoader(), sassLoader()]
      },
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.(eot|svg)$/, loader: 'file-loader?name=[name].[hash:20].[ext]'},
      {
        test: /\.(jpg|png|gif|otf|ttf|woff|woff2|cur|ani)$/,
        loader: 'url-loader?name=[name].[hash:20].[ext]&limit=10000'
      }
    ]
  },
  plugins: [
    new NoEmitOnErrorsPlugin(),
    new ProgressPlugin(),
    new NamedModulesPlugin(),
    new EnvironmentPlugin({
      'NODE_ENV': "production"
    }),
    new AotPlugin({
      tsConfigPath: 'src/tsconfig.server.json',
    }),
    new NormalModuleReplacementPlugin(
      /environment.ts/,
      'environment.prod.ts'
    ),
    new HashedModuleIdsPlugin({
      hashFunction: 'md5',
      hashDigest: 'base64',
      hashDigestLength: 4
    }),
    new UglifyJsPlugin({
      mangle: {
        screw_ie8: true,
        except: ['prebootstrap']
      },
      compress: {
        screw_ie8: true,
        warnings: false
      },
      sourceMap: false
    })
  ],
  stats: {
    version: false
  }
};

function root(path) {
  return resolve(__dirname, path);
}
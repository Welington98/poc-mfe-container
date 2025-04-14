const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const commonConfig = require('./webpack.common');
const packageJson = require('../package.json');

const domain = process.env.PRODUCTION_DOMAIN;

const prodConfig = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    publicPath: '/', // arquivos servidos da raiz
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        marketing: `marketing@https://poc-mfe-marketing.pages.dev/remoteEntry.js`,
        auth: `auth@https://poc-mfe-auth.pages.dev/remoteEntry.js`,
        dashboard: `dashboard@https://poc-mfe-dashboard.pages.dev/remoteEntry.js`,
      },
      shared: packageJson.dependencies,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/_redirects', to: '.' } // <-- garante que _redirects vá pro output final (ex: /dist)
      ]
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);

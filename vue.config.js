const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true,
  css: {
    extract: true,
  },
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser'
      }),
    ],

    resolve: {
      extensions: ['.js', '.vue', '.json', '.ts', '.tsx', '.jsx'],
      alias: {
        vue$: 'vue/dist/vue.esm-bundler.js',
        '@': __dirname + '/src'
      },
      fallback: {
        "fs": false,
        "path": false,
        "os": false,
        "path": require.resolve("path-browserify"),
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "https": require.resolve("https-browserify"),
        "http": require.resolve("stream-http"),
        "zlib": require.resolve("browserify-zlib"),
        "vm": require.resolve("vm-browserify"),
        "querystring": require.resolve("querystring-es3"),
        "constants": require.resolve("constants-browserify"),
        "assert": require.resolve("assert/"),
        "tty": require.resolve("tty-browserify"),
        "util": require.resolve("util/"),
        "worker_threads": require.resolve("worker_threads"),

      }
    }
  }
})

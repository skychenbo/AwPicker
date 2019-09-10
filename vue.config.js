
module.exports = {
  publicPath: './',
  productionSourceMap: false,
  devServer: {
    overlay: {
      warnings: true,
      errors: true,
    },
    port: 4001,
  },
  pages: {
    index: {
      entry: './example/main.js',
    },
  },
};

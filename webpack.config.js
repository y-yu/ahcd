module.exports = {
  mode: 'production',
  entry: './src/AppleHealthCareData.js',
  resolve: {
    fallback: {
      fs: false,
      stream: false,
      string_decoder: false,
    }
  },
  output: {
    library: 'AppleHealthCareData',
    libraryTarget: 'umd',
    globalObject: 'this',
    filename: 'ahcd.js'
  }
};


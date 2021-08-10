var path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  target: 'node10.24',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },

};
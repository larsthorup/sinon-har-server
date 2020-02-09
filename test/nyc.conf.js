module.exports = {
  verbose: false,
  'report-dir': './output/coverage',
  reporter: [
    'lcov',
    'json',
    'text-summary'
  ],
  'temp-dir': './output/coverage'
};

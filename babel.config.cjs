/**
 * @format
 */

module.exports = function (api) {
  const plugins = [];
  let presets = ['@babel/preset-flow', '@babel/preset-env'];
  let shouldPrintComment = _ => true;

  // Are we building the ESM bundle?
  if (api.env('esm')) {
    presets = [
      '@babel/preset-flow',
      ['@babel/preset-env', { modules: false }]
    ];
  }
  // Are we building the bundle for the browser?
  else if (api.env('production')) {
    presets.push('minify');
    shouldPrintComment = val => /@license|@preserve/.test(val);
  }

  return {
    presets,
    shouldPrintComment,
    plugins,
  };
};

/**
 * @format
 */

module.exports = function (api) {
  const plugins = [];
  let presets = ['@babel/preset-flow', '@babel/preset-env'];

  // Filter out @format and @flow directives, keep license and JSDoc comments
  let shouldPrintComment = (val) => {
    // Always keep license comments
    if (/@license|@preserve|!/.test(val)) {
      return true;
    }
    // Skip @format and @flow directives
    if (/@format|@flow/.test(val)) {
      return false;
    }
    // Keep all other comments (including JSDoc)
    return true;
  };

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
  // For CommonJS build (dev env), add module.exports compatibility
  else if (api.env('dev')) {
    plugins.push('add-module-exports');
  }

  return {
    presets,
    shouldPrintComment,
    plugins,
    compact: false,
    retainLines: false,
  };
};

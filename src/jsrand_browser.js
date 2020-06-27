/** @format @flow */

'use strict';

import Srand from './jsrand.js';

Srand._oldSrand = window.Srand;

/**
 * In the uncommon case the name `Srand` is already used,
 * restore its initial value and return the Srand object.
 */
Srand.noConflict = function (): Function {
  window.Srand = Srand._oldSrand;
  return Srand;
};

window.Srand = Srand;

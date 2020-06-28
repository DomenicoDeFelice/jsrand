/*!
 * jsrand - https://github.com/DomenicoDeFelice/jsrand
 *
 * Copyright (c) 2014-2020 Domenico De Felice
 * Released under the MIT License - https://dom.mit-license.org/2014-2020
 *
 * @license
 * @format
 */

QUnit.test(
  'Srand.noConflict() restores the original value and returns Srand',
  assert => {
    const originalSrand = Srand;
    const noConflictReturnValue = Srand.noConflict();

    assert.strictEqual(originalSrand, noConflictReturnValue);

    // The original value of Srand is set in `browser_tests.html`.
    assert.equal(Srand, 'original value');

    Srand = originalSrand;
  }
);

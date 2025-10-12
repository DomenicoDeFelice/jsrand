/*!
 * jsrand - https://github.com/DomenicoDeFelice/jsrand
 *
 * Copyright (c) 2014-2025 Domenico De Felice
 * Released under the MIT License
 *
 * @license
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function Srand(seed) {
  if (seed != null) {
    this.seed(seed);
  } else {
    this.randomize();
  }
}
Srand.prototype = {};

/**
 * Set or get (if no argument is given) the seed for the pseudo-random
 * number generator. The seed can be any float or integer number.
 */
Srand.seed = Srand.prototype.seed = function (seed) {
  if (seed == null) {
    return this._seed;
  }

  // Use only one seed (mw), mz is fixed.
  // Must not be zero, nor 0x9068ffff.
  this._mz = 123456789;
  return this._mw = this._seed = seed;
};

/**
 * Set and return a random seed.
 */
Srand.randomize = Srand.prototype.randomize = function () {
  return this.seed(1 + Math.floor(Math.random() * 0xffffffff));
};

/**
 * Return an object with the state of the generator. Use setState to
 * resume the state.
 */
Srand.getState = Srand.prototype.getState = function () {
  return {
    seed: this._seed,
    mz: this._mz,
    mw: this._mw
  };
};

/**
 * Resume a state previously returned by getState.
 */
Srand.setState = Srand.prototype.setState = function (state) {
  if (state == null || typeof state !== 'object' || typeof state.seed !== 'number' || typeof state.mz !== 'number' || typeof state.mw !== 'number') {
    throw new Error('Invalid state.');
  }
  this._seed = state.seed;
  this._mz = state.mz;
  this._mw = state.mw;
};

/**
 * Return a pseudo-random number between 0 inclusive and 1 exclusive.
 *
 * The algorithm used is MWC (multiply-with-carry) by George Marsaglia.
 *
 * Implementation based on:
 * - http://en.wikipedia.org/wiki/Random_number_generation#Computational_methods
 * - http://stackoverflow.com/questions/521295/javascript-random-seeds#19301306
 */
Srand.random = Srand.prototype.random = function () {
  if (this._seed == null) {
    this.randomize();
  }
  let mz = this._mz;
  let mw = this._mw;

  // The 16 least significant bits are multiplied by a constant
  // and then added to the 16 most significant bits. 32 bits result.
  mz = (mz & 0xffff) * 36969 + (mz >> 16) & 0xffffffff;
  mw = (mw & 0xffff) * 18000 + (mw >> 16) & 0xffffffff;
  this._mz = mz;
  this._mw = mw;
  const x = ((mz << 16) + mw & 0xffffffff) / 0x100000000;
  return 0.5 + x;
};

/**
 * Return a pseudo-random float number between a inclusive and b exclusive.
 */
Srand.inRange = Srand.prototype.inRange = function (a, b) {
  return a + this.random() * (b - a);
};

/**
 * Return a psuedo-random integer between min and max inclusive.
 */
Srand.intInRange = Srand.prototype.intInRange = function (min, max) {
  return min + Math.floor(this.random() * (max - min + 1));
};

/**
 * Return a random element from the input array.
 *
 * If arr is empty, an exception is thrown.
 */
Srand.choice = Srand.prototype.choice = function (arr) {
  if (arr.length === 0) {
    throw new Error('Cannot choose random element from empty array.');
  }
  const randomIndex = this.intInRange(0, arr.length - 1);
  return arr[randomIndex];
};

/**
 * Return a k-sized array sampled with replacement from the input array,
 * i.e. each element can be sampled more than once.
 *
 * If k > 0 and arr is empty, throws an exception.
 */
Srand.choices = Srand.prototype.choices = function (arr, k) {
  const sample = new Array(k);
  for (let i = 0; i < k; i++) {
    sample[i] = this.choice(arr);
  }
  return sample;
};

/**
 * Return a k-sized array sampled without replacement from the input array.
 *
 * If k > arr.length an exception is thrown.
 */
Srand.sample = Srand.prototype.sample = function (arr, k) {
  if (k > arr.length) {
    throw new Error('Sample size cannot exceed population size.');
  }
  if (k === arr.length) {
    return this.shuffle([...arr]);
  }
  const maxIndex = arr.length - 1;
  const sample = new Array(k);
  const selected = {};
  for (let i = 0, j; i < k; i++) {
    do {
      j = this.intInRange(0, maxIndex);
    } while (selected[j]);
    sample[i] = arr[j];
    selected[j] = true;
  }
  return sample;
};

/**
 * Shuffle the input array using the Fisher-Yates algorithm and return it
 * (the input array is modified).
 */
Srand.shuffle = Srand.prototype.shuffle = function (arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = this.intInRange(0, i - 1);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

/**
 * Return a random element from arr based on the provided weights.
 *
 * Weights should be positive numbers. They will be normalized internally,
 * so [1, 2, 3] is equivalent to [0.166, 0.333, 0.5].
 *
 * If arr is empty, an exception is thrown.
 * If weights array length doesn't match arr length, an exception is thrown.
 * If all weights are zero or negative, an exception is thrown.
 */
Srand.weightedChoice = Srand.prototype.weightedChoice = function (arr, weights) {
  if (arr.length === 0) {
    throw new Error('Cannot choose random element from empty array.');
  }
  if (arr.length !== weights.length) {
    throw new Error('Items and weights must have the same length.');
  }

  // Calculate total weight
  let totalWeight = 0;
  for (let i = 0; i < weights.length; i++) {
    if (weights[i] < 0) {
      throw new Error('Weights must be non-negative.');
    }
    totalWeight += weights[i];
  }
  if (totalWeight === 0) {
    throw new Error('At least one weight must be greater than zero.');
  }

  // Generate random value between 0 and totalWeight
  const randomValue = this.random() * totalWeight;

  // Find the item corresponding to this value
  let cumulativeWeight = 0;
  for (let i = 0; i < arr.length; i++) {
    cumulativeWeight += weights[i];
    if (randomValue < cumulativeWeight) {
      return arr[i];
    }
  }
  return arr[arr.length - 1];
};

/**
 * Return a random number from a Gaussian (normal) distribution.
 *
 * Uses the Box-Muller transform to generate normally distributed values.
 *
 * @param mean - The mean (center) of the distribution (default: 0)
 * @param stddev - The standard deviation (spread) of the distribution (default: 1)
 */
Srand.gaussian = Srand.prototype.gaussian = function (mean = 0, stddev = 1) {
  // Box-Muller transform
  const u1 = this.random();
  const u2 = this.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stddev + mean;
};

/**
 * Return a random number from an exponential distribution.
 *
 * Useful for modeling time between events in a Poisson process.
 *
 * @param lambda - The rate parameter (lambda > 0). Higher values produce smaller numbers.
 */
Srand.exponential = Srand.prototype.exponential = function (lambda) {
  if (lambda <= 0) {
    throw new Error('For exponential distributions, lambda must be positive.');
  }
  return -Math.log(1 - this.random()) / lambda;
};

/**
 * Return a random integer from a Poisson distribution.
 *
 * Useful for modeling the number of events in a fixed interval.
 *
 * @param lambda - The expected number of events (lambda > 0)
 */
Srand.poisson = Srand.prototype.poisson = function (lambda) {
  if (lambda <= 0) {
    throw new Error('For Poisson distributions, lambda must be positive.');
  }

  // Knuth's algorithm for Poisson distribution
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= this.random();
  } while (p > L);
  return k - 1;
};

// Keep flow happy.
Srand._oldSrand = undefined;
Srand.noConflict = function () {
  return Srand;
};
var _default = Srand;
exports.default = _default;
module.exports = exports.default;

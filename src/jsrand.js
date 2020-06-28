/** @format @flow */
/*!
 * jsrand - https://github.com/DomenicoDeFelice/jsrand
 *
 * Copyright (c) 2014-2020 Domenico De Felice
 * Released under the MIT License
 *
 * @license
 */

'use strict';

type State = {|
  seed: number,
  mz: number,
  mw: number,
|};

function Srand(seed?: number) {
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
Srand.seed = Srand.prototype.seed = function (seed?: number): number {
  if (seed == null) {
    return this._seed;
  }

  // Use only one seed (mw), mz is fixed.
  // Must not be zero, nor 0x9068ffff.
  this._mz = 123456789;

  return (this._mw = this._seed = seed);
};

/**
 * Set and return a random seed.
 */
Srand.randomize = Srand.prototype.randomize = function (): number {
  return this.seed(1 + Math.floor(Math.random() * 0xffffffff));
};

/**
 * Return an object with the state of the generator. Use setState to
 * resume the state.
 */
Srand.getState = Srand.prototype.getState = function (): State {
  return {
    seed: this._seed,
    mz: this._mz,
    mw: this._mw,
  };
};

/**
 * Resume a state previously returned by getState.
 */
Srand.setState = Srand.prototype.setState = function (state: State) {
  if (
    state == null ||
    typeof state !== 'object' ||
    typeof state.seed !== 'number' ||
    typeof state.mz !== 'number' ||
    typeof state.mw !== 'number'
  ) {
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
Srand.random = Srand.prototype.random = function (): number {
  if (this._seed == null) {
    this.randomize();
  }

  let mz = this._mz;
  let mw = this._mw;

  // The 16 least significant bits are multiplied by a constant
  // and then added to the 16 most significant bits. 32 bits result.
  mz = ((mz & 0xffff) * 36969 + (mz >> 16)) & 0xffffffff;
  mw = ((mw & 0xffff) * 18000 + (mw >> 16)) & 0xffffffff;

  this._mz = mz;
  this._mw = mw;

  const x = (((mz << 16) + mw) & 0xffffffff) / 0x100000000;
  return 0.5 + x;
};

/**
 * Return a pseudo-random float number between a inclusive and b exclusive.
 */
Srand.inRange = Srand.prototype.inRange = function (
  a: number,
  b: number
): number {
  return a + this.random() * (b - a);
};

/**
 * Return a psuedo-random integer between min and max inclusive.
 */
Srand.intInRange = Srand.prototype.intInRange = function (
  min: number,
  max: number
): number {
  return min + Math.floor(this.random() * (max - min + 1));
};

/**
 * Return a random element from the input array.
 *
 * If arr is empty, an exception is thrown.
 */
Srand.choice = Srand.prototype.choice = function <T>(arr: Array<T>): T {
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
Srand.choices = Srand.prototype.choices = function <T>(
  arr: Array<T>,
  k: number
): Array<T> {
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
Srand.sample = Srand.prototype.sample = function <T>(
  arr: Array<T>,
  k: number
): Array<T> {
  if (k > arr.length) {
    throw new Error('Sample size cannot exceed population size.');
  }

  if (k === arr.length) {
    return [...arr];
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
Srand.shuffle = Srand.prototype.shuffle = function <T>(
  arr: Array<T>
): Array<T> {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = this.intInRange(0, i - 1);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr;
};

// Keep flow happy.
Srand._oldSrand = undefined;
Srand.noConflict = function (): Function {
  return Srand;
};

module.exports = Srand;

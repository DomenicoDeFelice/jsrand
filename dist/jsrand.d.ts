/*!
 * jsrand - https://github.com/DomenicoDeFelice/jsrand
 *
 * Copyright (c) 2014-2025 Domenico De Felice
 * Released under the MIT License
 *
 * @license
 */

/**
 * State object for saving and restoring the generator state
 */
export interface State {
  seed: number;
  mz: number;
  mw: number;
}

/**
 * Seeded pseudo-random number generator
 */
export interface SrandInstance {
  /**
   * Set or get (if no argument is given) the seed for the pseudo-random
   * number generator. The seed can be any float or integer number.
   */
  seed(seed?: number): number;

  /**
   * Set and return a random seed.
   */
  randomize(): number;

  /**
   * Return an object with the state of the generator.
   * Use setState to resume the state.
   */
  getState(): State;

  /**
   * Resume a state previously returned by getState.
   */
  setState(state: State): void;

  /**
   * Return a pseudo-random number between 0 inclusive and 1 exclusive.
   *
   * The algorithm used is MWC (multiply-with-carry) by George Marsaglia.
   */
  random(): number;

  /**
   * Return a pseudo-random float number between a inclusive and b exclusive.
   */
  inRange(a: number, b: number): number;

  /**
   * Return a psuedo-random integer between min and max inclusive.
   */
  intInRange(min: number, max: number): number;

  /**
   * Return a random element from the input array.
   *
   * If arr is empty, an exception is thrown.
   */
  choice<T>(arr: T[]): T;

  /**
   * Return a k-sized array sampled with replacement from the input array,
   * i.e. each element can be sampled more than once.
   *
   * If k > 0 and arr is empty, throws an exception.
   */
  choices<T>(arr: T[], k: number): T[];

  /**
   * Return a k-sized array sampled without replacement from the input array.
   *
   * If k > arr.length an exception is thrown.
   */
  sample<T>(arr: T[], k: number): T[];

  /**
   * Shuffle the input array using the Fisher-Yates algorithm and return it
   * (the input array is modified).
   */
  shuffle<T>(arr: T[]): T[];
}

/**
 * Seeded pseudo-random number generator constructor
 */
export interface SrandConstructor extends SrandInstance {
  new (seed?: number): SrandInstance;

  /**
   * Only available when using Srand as a plain script.
   * In the uncommon case the name `Srand` is already taken, restores its
   * initial value and return the `Srand` object.
   */
  noConflict(): SrandConstructor;
}

declare const Srand: SrandConstructor;

export default Srand;

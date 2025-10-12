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
  weightedChoice<T>(arr: T[], weights: number[]): T;

  /**
   * Return a random number from a Gaussian (normal) distribution.
   *
   * Uses the Box-Muller transform to generate normally distributed values.
   *
   * @param mean - The mean (center) of the distribution (default: 0)
   * @param stddev - The standard deviation (spread) of the distribution (default: 1)
   */
  gaussian(mean?: number, stddev?: number): number;

  /**
   * Return a random number from an exponential distribution.
   *
   * Useful for modeling time between events in a Poisson process.
   *
   * @param lambda - The rate parameter (lambda > 0). Higher values produce smaller numbers.
   */
  exponential(lambda: number): number;

  /**
   * Return a random integer from a Poisson distribution.
   *
   * Useful for modeling the number of events in a fixed interval.
   *
   * @param lambda - The expected number of events (lambda > 0)
   */
  poisson(lambda: number): number;
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

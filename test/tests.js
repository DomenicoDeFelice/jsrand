/*!
 * jsrand - https://github.com/DomenicoDeFelice/jsrand
 *
 * Copyright (c) 2014-2025 Domenico De Felice
 * Released under the MIT License
 *
 * @license
 * @format
 * @flow
 */

'use strict';

const QUnit = require('qunit');
const Srand = require('../dist/jsrand.js');
const arrayEquals = require('array-equal');

function range(k) {
  return [...Array(k).keys()];
}

function randomSequence(generator = Srand, k = 100) {
  const seq = [];
  for (let i = 0; i < k; i++) {
    seq.push(generator.random());
  }
  return seq;
}

QUnit.module('JSRand', {
  beforeEach: () => Srand.randomize(),
});

QUnit.test('Same seeds generate same sequences', assert => {
  const rnd = new Srand();
  Srand.seed(rnd.seed());

  const sequenceA = randomSequence(Srand, 100);
  const sequenceB = randomSequence(rnd, 100);
  assert.ok(arrayEquals(sequenceA, sequenceB));
});

QUnit.test('setState throws on invalid state', assert => {
  assert.throws(() => Srand.setState());
  assert.throws(() => Srand.setState(42));
  assert.throws(() => Srand.setState({}));
  assert.throws(() => Srand.setState({ seed: 42 }));
  assert.throws(() => Srand.setState({ seed: 1, mw: '2', mz: 3 }));
});

QUnit.test('setState correctly resumes state', assert => {
  const state = Srand.getState();
  const firstSeq = randomSequence();
  Srand.setState(state);
  const secondSeq = randomSequence();
  const thirdSeq = randomSequence();

  assert.ok(arrayEquals(firstSeq, secondSeq));
  assert.notOk(arrayEquals(firstSeq, thirdSeq));
});

QUnit.test('inRange returns only numbers in the specified range', assert => {
  const min = 10;
  const max = 20;

  for (let i = 0; i < 1000; i++) {
    const n = Srand.inRange(min, max);
    assert.ok(n >= min, 'number < lower bound');
    assert.ok(n < max, 'number > upper bound');
  }
});

QUnit.test(
  'Random float from a range of length 1 always returns the same number',
  assert => {
    for (let i = 0; i < 100; i++) {
      assert.ok(Srand.inRange(1, 1) === 1);
    }
  }
);

QUnit.test(
  'intInRange returns only integers numbers in the specified range',
  assert => {
    const min = 10;
    const max = 20;

    for (let i = 0; i < 1000; i++) {
      const n = Srand.intInRange(min, max);
      assert.ok(n >= min, 'integer < lower bound');
      assert.ok(n <= max, 'integer > upper bound');
      assert.equal(n % 1, 0, 'not an integer');
    }
  }
);

QUnit.test('randomize sets a new seed and returns it', async assert => {
  const oldSeed = Srand.seed();
  await new Promise(resolve => setTimeout(resolve, 100));
  const newSeed = Srand.randomize();

  assert.ok(oldSeed !== newSeed);
  assert.ok(Srand.seed() === newSeed);
});

QUnit.test('choice throws on empty array', assert => {
  assert.throws(() => Srand.choice([]));
});

QUnit.test(
  'choice with a 1-sized array always returns the only element',
  assert => {
    assert.equal(Srand.choice(['foo']), 'foo');
  }
);

QUnit.test(
  'choice returns elements from the passed array and not always the same',
  assert => {
    const arr = range(25);

    let allEqual = true;
    let first;

    for (let i = 0; i < 1000; i++) {
      const n = Srand.choice(arr);

      if (i === 0) {
        first = n;
      } else if (n !== first) {
        allEqual = false;
      }

      assert.ok(arr.includes(n));
    }

    assert.notOk(allEqual);
  }
);

QUnit.test('choices of empty array', assert => {
  assert.ok(arrayEquals(Srand.choices([], 0), []));
  assert.throws(() => Srand.choices([], 1));
});

QUnit.test('choices of single element array', assert => {
  assert.ok(arrayEquals(Srand.choices([1], 0), []));
  assert.ok(arrayEquals(Srand.choices([1], 1), [1]));
  assert.ok(arrayEquals(Srand.choices([1], 5), [1, 1, 1, 1, 1]));
});

QUnit.test('choices of larger array', assert => {
  const arr = range(100);

  assert.equal(Srand.choices(arr, 10).length, 10);
  assert.ok(new Set(Srand.choices(arr, 100)).size < 100);
});

QUnit.test('sample of empty array', assert => {
  assert.ok(arrayEquals(Srand.sample([], 0), []));
  assert.throws(() => Srand.sample([], 1));
});

QUnit.test('sample of single element array', assert => {
  assert.ok(arrayEquals(Srand.sample([1], 0), []));
  assert.ok(arrayEquals(Srand.sample([1], 1), [1]));
  assert.throws(() => Srand.sample([1], 5));
});

QUnit.test('sample of larger array', assert => {
  const arr = range(100);
  assert.equal(Srand.sample(arr, 10).length, 10);

  const population = new Set(arr);
  const sampleSize = 90;
  const sample = Srand.sample(arr, sampleSize);
  assert.equal(new Set(sample).size, sampleSize);
  assert.ok(sample.every(n => population.has(n)));
});

QUnit.test('shuffle of empty array returns empty array', assert => {
  assert.ok(arrayEquals(Srand.shuffle([]), []));
});

QUnit.test('shuffle with single element array', assert => {
  assert.ok(arrayEquals(Srand.shuffle([42]), [42]));
});

QUnit.test('shuffle works in place', assert => {
  const arr = range(100);
  assert.strictEqual(arr, Srand.shuffle(arr));
});

QUnit.test('shuffle of larger array', assert => {
  const arr = range(1000);
  const shuffledArray = Srand.shuffle([...arr]);

  assert.equal(arr.length, shuffledArray.length);
  assert.notOk(arrayEquals(arr, shuffledArray));
  assert.ok(arrayEquals(arr.sort(), shuffledArray.sort()));
});

QUnit.test('weightedChoice throws on empty array', assert => {
  assert.throws(() => Srand.weightedChoice([], []));
});

QUnit.test('weightedChoice throws on mismatched lengths', assert => {
  assert.throws(() => Srand.weightedChoice([1, 2, 3], [0.5, 0.5]));
  assert.throws(() => Srand.weightedChoice([1, 2], [0.5, 0.3, 0.2]));
});

QUnit.test('weightedChoice throws on negative weights', assert => {
  assert.throws(() => Srand.weightedChoice([1, 2, 3], [0.5, -0.3, 0.2]));
});

QUnit.test('weightedChoice throws when all weights are zero', assert => {
  assert.throws(() => Srand.weightedChoice([1, 2, 3], [0, 0, 0]));
});

QUnit.test('weightedChoice with single element', assert => {
  assert.equal(Srand.weightedChoice(['foo'], [1]), 'foo');
  assert.equal(Srand.weightedChoice(['bar'], [0.5]), 'bar');
});

QUnit.test('weightedChoice with uniform weights behaves like choice', assert => {
  Srand.seed(12345);
  const arr = range(10);
  const weights = new Array(10).fill(1);
  const results = new Set();

  for (let i = 0; i < 1000; i++) {
    results.add(Srand.weightedChoice(arr, weights));
  }

  // Should get variety with uniform weights
  assert.ok(results.size > 5, 'Should have variety with uniform weights');
});

QUnit.test('weightedChoice respects weight distribution', assert => {
  Srand.seed(12345);
  const items = ['rare', 'common'];
  const weights = [1, 99]; // common should be ~99% of results
  const counts = { rare: 0, common: 0 };

  for (let i = 0; i < 10000; i++) {
    counts[Srand.weightedChoice(items, weights)]++;
  }

  const commonPercentage = counts.common / 10000;
  assert.ok(commonPercentage > 0.97 && commonPercentage < 1.0,
    `Common should be ~99%, got ${commonPercentage * 100}%`);
});

QUnit.test('weightedChoice handles zero weights correctly', assert => {
  Srand.seed(12345);
  const items = ['never', 'always'];
  const weights = [0, 1];

  for (let i = 0; i < 100; i++) {
    assert.equal(Srand.weightedChoice(items, weights), 'always');
  }
});

QUnit.test('gaussian generates values with correct distribution', assert => {
  Srand.seed(12345);
  const mean = 100;
  const stddev = 15;
  const samples = [];

  for (let i = 0; i < 10000; i++) {
    samples.push(Srand.gaussian(mean, stddev));
  }

  const sampleMean = samples.reduce((a, b) => a + b, 0) / samples.length;
  const variance = samples.reduce((sum, val) => sum + Math.pow(val - sampleMean, 2), 0) / samples.length;
  const sampleStddev = Math.sqrt(variance);

  // Check if sample mean is close to expected mean (within 1%)
  assert.ok(Math.abs(sampleMean - mean) < mean * 0.01,
    `Mean should be ~${mean}, got ${sampleMean}`);

  // Check if sample stddev is close to expected stddev (within 10%)
  assert.ok(Math.abs(sampleStddev - stddev) < stddev * 0.1,
    `Stddev should be ~${stddev}, got ${sampleStddev}`);
});

QUnit.test('gaussian with default parameters', assert => {
  Srand.seed(12345);
  const samples = [];

  for (let i = 0; i < 1000; i++) {
    samples.push(Srand.gaussian());
  }

  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;

  // Default mean should be close to 0
  assert.ok(Math.abs(mean) < 0.1, `Default mean should be ~0, got ${mean}`);
});

QUnit.test('exponential throws on invalid lambda', assert => {
  assert.throws(() => Srand.exponential(0));
  assert.throws(() => Srand.exponential(-1));
});

QUnit.test('exponential generates positive values', assert => {
  Srand.seed(12345);

  for (let i = 0; i < 100; i++) {
    const value = Srand.exponential(1);
    assert.ok(value >= 0, 'Exponential values should be non-negative');
  }
});

QUnit.test('exponential has correct mean', assert => {
  Srand.seed(12345);
  const lambda = 2;
  const samples = [];

  for (let i = 0; i < 10000; i++) {
    samples.push(Srand.exponential(lambda));
  }

  const sampleMean = samples.reduce((a, b) => a + b, 0) / samples.length;
  const expectedMean = 1 / lambda;

  // Sample mean should be close to 1/lambda (within 10%)
  assert.ok(Math.abs(sampleMean - expectedMean) < expectedMean * 0.1,
    `Mean should be ~${expectedMean}, got ${sampleMean}`);
});

QUnit.test('poisson throws on invalid lambda', assert => {
  assert.throws(() => Srand.poisson(0));
  assert.throws(() => Srand.poisson(-1));
});

QUnit.test('poisson generates non-negative integers', assert => {
  Srand.seed(12345);

  for (let i = 0; i < 100; i++) {
    const value = Srand.poisson(5);
    assert.ok(value >= 0, 'Poisson values should be non-negative');
    assert.equal(value % 1, 0, 'Poisson values should be integers');
  }
});

QUnit.test('poisson has correct mean', assert => {
  Srand.seed(12345);
  const lambda = 5;
  const samples = [];

  for (let i = 0; i < 10000; i++) {
    samples.push(Srand.poisson(lambda));
  }

  const sampleMean = samples.reduce((a, b) => a + b, 0) / samples.length;

  // Sample mean should be close to lambda (within 10%)
  assert.ok(Math.abs(sampleMean - lambda) < lambda * 0.1,
    `Mean should be ~${lambda}, got ${sampleMean}`);
});

QUnit.test('poisson with small lambda', assert => {
  Srand.seed(12345);
  const samples = [];

  for (let i = 0; i < 1000; i++) {
    samples.push(Srand.poisson(0.5));
  }

  // Most values should be 0 or 1 with lambda=0.5
  const lowValues = samples.filter(v => v <= 1).length;
  assert.ok(lowValues > 900, 'Most values should be 0 or 1 with small lambda');
});

QUnit.test('consecutive seeds should not produce correlated first random values', assert => {
  // This test verifies that using consecutive seeds (like Unix timestamps)
  // doesn't produce predictable/correlated first random values
  const baseTimestamp = 1700000000;
  const samples = [];

  // Collect first random value for 100 consecutive seeds
  for (let i = 0; i < 100; i++) {
    const seed = baseTimestamp + i;
    const rng = new Srand(seed);
    const firstRandom = rng.random();
    samples.push({ seed, firstRandom });
  }

  // Calculate Pearson correlation coefficient
  const n = samples.length;
  const seedMean = samples.reduce((sum, s) => sum + s.seed, 0) / n;
  const randomMean = samples.reduce((sum, s) => sum + s.firstRandom, 0) / n;

  let numerator = 0;
  let seedVariance = 0;
  let randomVariance = 0;

  for (let i = 0; i < n; i++) {
    const seedDiff = samples[i].seed - seedMean;
    const randomDiff = samples[i].firstRandom - randomMean;
    numerator += seedDiff * randomDiff;
    seedVariance += seedDiff * seedDiff;
    randomVariance += randomDiff * randomDiff;
  }

  const correlation = Math.abs(numerator / Math.sqrt(seedVariance * randomVariance));

  // Correlation should be low (< 0.5 indicates weak correlation)
  // Values close to 1.0 indicate strong correlation which is bad for consecutive seeds
  assert.ok(correlation < 0.5,
    `Seed correlation should be < 0.5, got ${correlation.toFixed(6)}. ` +
    `High correlation means consecutive seeds produce predictable sequences.`);
});

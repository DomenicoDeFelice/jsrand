/*!
 * jsrand 2.0 https://github.com/DomenicoDeFelice/jsrand
 *
 * Copyright (c) 2014-2020 Domenico De Felice
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

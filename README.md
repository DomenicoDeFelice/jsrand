# jsrand a.k.a. seeded-rand
[![Build Status](https://travis-ci.com/DomenicoDeFelice/jsrand.svg?branch=master)](https://travis-ci.com/DomenicoDeFelice/jsrand)

A seeded pseudo-random number generator for JavaScript.

It can be used as either a plain script or as a [Node.js module](https://www.npmjs.com/package/seeded-rand). When served gzipped, it weights only 1.7KB.

Numbers are generated using a one-seeded version of the [multiply-with-carry method by George Marsaglia](https://en.wikipedia.org/wiki/Multiply-with-carry_pseudorandom_number_generator). While this method is okay for most applications, it is not cryptographically strong.

jsrand supports saving and restoring the generator state and common operations on arrays: [`choice`](#choice) (pick a random element), [`choices`](#choices) (pick elements at random), [`sample`](#sample) (pick elements at random without repetition) and [`shuffle`](#shuffle). 

[See changelog here](https://github.com/DomenicoDeFelice/jsrand/blob/master/CHANGELOG.md).

## Table of contents
  * [Install](#install)
    * [NPM](#npm)
    * [Plain script](#plain-script)
  * [Usage](#usage)
    * [Examples](#examples)
  * [API](#api)
    * [`choice`](#choice)
    * [`choices`](#choices)
    * [`getState`](#getstate)
    * [`inRange`](#inrange)
    * [`intInRange`](#intinrange)
    * [`noConflict`](#noconflict)
    * [`random`](#random)
    * [`randomize`](#randomize)
    * [`sample`](#sample)
    * [`seed`](#seed)
    * [`setState`](#setstate)
    * [`shuffle`](#shuffle)
  * [License](#license)

## Install
### NPM
```
$ npm install seeded-rand
```

### Plain script
Just download [dist/jsrand.min.js](https://raw.githubusercontent.com/DomenicoDeFelice/jsrand/master/dist/jsrand.min.js) and (optionally) [dist/jsrand.min.js.map](https://raw.githubusercontent.com/DomenicoDeFelice/jsrand/master/dist/jsrand.min.js.map) and include it in your app.

## Usage

<table>
<thead>
<tr>
<th width="50%">Plain script</th>
<th width="50%">NPM</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```javascript
<script src="jsrand.min.js"></script>
```

This will define a global `Srand` object. If the name `Srand` is already taken, see [`noConflict`](#noconflict).

</td>
<td>

```javascript
const Srand = require('seeded-rand');
```

or

```Javascript
import Srand from 'seeded-rand';
```

</td>
</tr>
</tbody>
</table>

All methods can be used either statically:
```Javascript
Srand.seed(10); // 10
Srand.random(); // 0.4569510892033577
```
or instantiating a new generator:
```Javascript
const rnd = new Srand(10);
rnd.random(); // 0.4569510892033577

const othr = new Srand(rnd.seed());
othr.random(); // 0.4569510892033577
```

### Examples
```Javascript
const rnd = new Srand(); // Initiate with random seed

rnd.seed(); // 1836504610 Read the seed
rnd.randomize(); // 3409024789 Random seed is set and returned
rnd.seed(1836504610); // 1836504610 Set a seed

rnd.inRange(0, 10); // 6.866552880965173
rnd.intInRange(0, 10); // 1

rnd.choice([1, 2, 3]); // 3
rnd.choices([1, 2, 3], 3); // [3, 3, 1] possible repetitions
rnd.choices([1, 2, 3], 3); // [2, 2, 3] possible repetitions

rnd.sample([1, 2, 3], 2); // [1, 2] no repetitions
rnd.sample([1, 2, 3], 2); // [1, 2] no repetitions

const state = rnd.getState();
rnd.intInRange(1, 50); // 39
rnd.intInRange(1, 50); // 24
rnd.intInRange(1, 50); // 18

rnd.setState(state); // Resumes previous state, regenerating same random sequence
rnd.intInRange(1, 50); // 39
rnd.intInRange(1, 50); // 24
rnd.intInRange(1, 50); // 18
```

The same sequence of operations can be repeated with equal results using the static methods of `Srand`:

```Javascript
Srand.seed(1836504610); // 1836504610 Set the seed 

Srand.inRange(0, 10); // 6.866552880965173
Srand.intInRange(0, 10); // 1

Srand.choice([1, 2, 3]); // 3
Srand.choices([1, 2, 3], 3); // [3, 3, 1] possible repetitions
Srand.choices([1, 2, 3], 3); // [2, 2, 3] possible repetitions

Srand.sample([1, 2, 3], 2); // [1, 2] no repetitions
Srand.sample([1, 2, 3], 2); // [1, 2] no repetitions

const state = Srand.getState();
Srand.intInRange(1, 50); // 39
Srand.intInRange(1, 50); // 24
Srand.intInRange(1, 50); // 18

Srand.setState(state); // Resumes previous state, regenerating same random sequence
Srand.intInRange(1, 50); // 39
Srand.intInRange(1, 50); // 24
Srand.intInRange(1, 50); // 18
```


## API

<table>
<thead>
<tr>
<th width="20%">Method</th>
<th width="80%">Doc</th>
</tr>
</thead>
<tbody>
<tr>
<td id="choice">

```Javascript
choice(arr: Array<T>): T
```

</td>
<td>

Returns a random element from `arr`.

If `arr` is empty, an exception is thrown.
</td>
</tr>
<tr></tr>
<tr>
<td id="choices">

```Javascript
choices(arr: Array<T>, k: number): Array<T>
```

</td>
<td>

Returns a `k`-sized array sampled with replacement from `arr`,
i.e. each element can be sampled more than once.

If `k` > 0 and `arr` is empty, throws an exception.

For an alternative without replacement, see [`sample`](#sample).
</td>
</tr>
<tr></tr>
<tr>
<td id="getstate">

```Javascript
getState(): State
```

</td>
<td>
Returns an object with the state of the generator.
 
Use [`setState`](#setstate) to resume the state.
</td>
</tr>
<tr></tr>
<tr>
<td id="inrange">

```Javascript
inRange(a: number, b: number): number
```

</td>
<td>

Returns a pseudo-random float number between `a` inclusive and `b` exclusive.
</td>
</tr>
<tr></tr>
<tr>
<td id="intinrange">

```Javascript
intInRange(min: number, max: number): number
```

</td>
<td>

Returns a psuedo-random integer between `min` and `max` inclusive.
</td>
</tr>
<tr></tr>
<tr>
<td id="noconflict">

```Javascript
noConflict(): Srand
```

</td>
<td>

Only available when using Srand as a plain script.

In the uncommon case the name `Srand` is already taken, restores its initial value and return the `Srand` object.

```javascript
Srand = "my value";

// .. jsrand is loaded ...

const mySrand = Srand.noConflict();
Srand; // "my value"
```

</td>
</tr>
<tr></tr>
<tr>
<td id="random">

```Javascript
random(): number
```

</td>
<td>

Returns a pseudo-random float number between 0 inclusive and 1 exclusive.

The algorithm used is a one-seeded version of the [multiply-with-carry method by George Marsaglia](https://en.wikipedia.org/wiki/Multiply-with-carry_pseudorandom_number_generator).
</td>
</tr>
<tr></tr>
<tr>
<td id="randomize">

```Javascript
randomize(): number
```

</td>
<td>
Sets and returns a random seed.
</td>
</tr>
<tr></tr>
<tr>
<td id="sample">

```Javascript
sample(arr: Array<T>, k: number): Array<T>
```

</td>
<td>

Returns a `k`-sized array sampled without replacement from `arr`.

If `k > arr.length`, an exception is thrown.

For an alternative with replacement, see [`choices`](#choices).
</td>
</tr>
<tr></tr>
<tr>
<td id="seed">

```Javascript
seed(seed?: number): number
```

</td>
<td>
Sets or gets (if no argument is given) the seed.

The seed can be any float or integer number.
</td>
</tr>
<tr></tr>
<tr>
<td id="setstate">

```Javascript
setState(state: State): void
```

</td>
<td>

Resume a state previously returned by [`getState`](#getstate).
</td>
</tr>
<tr></tr>
<tr>
<td id="shuffle">

```Javascript
shuffle(arr: Array<T>): Array<T>
```

</td>
<td>

Shuffles `arr` in-place using the Fisher-Yates algorithm and returns it (`arr` is modified).
</td>
</tr>
</tbody>
</table>

## License

Copyright © 2014-2020, [Domenico De Felice](https://domdefelice.net).

Provided under the terms of the [MIT License](https://github.com/DomenicoDeFelice/jsrand/blob/master/LICENSE).

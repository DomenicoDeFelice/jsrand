# jsrand

A small<sup>*</sup> JavaScript library for seeded pseudo-random number generation.

Numbers are generated using a one-seeded version of the [multiply-with-carry method by George Marsaglia](https://en.wikipedia.org/wiki/Multiply-with-carry_pseudorandom_number_generator). While this method is okay for most applications, it is not cryptographically strong.

jsrand supports saving and restoring the generator state and common operations on arrays: `choice` (pick a random element), `choices` (pick elements at random), `sample` (pick elements at random without repetition) and `shuffle`. 

[See changelog here](https://github.com/DomenicoDeFelice/jsrand/blob/master/CHANGELOG.md).

> <sup>*</sup> 1.7KB when served gzipped.

## Table of contents
  * [Install](#install)
    * [NPM](#npm)
    * [Browser](#browser)
  * [Usage](#usage)
  * [API](#api)
    * [`seed`](#seed)
  * [License](#license)

## Install
### NPM
```
$ npm install jsrand
```

### Browser
Just download [dist/jsrand.min.js](https://raw.githubusercontent.com/DomenicoDeFelice/jsrand/master/dist/jsrand.min.js) and (optionally) [dist/jsrand.min.js.map](https://raw.githubusercontent.com/DomenicoDeFelice/jsrand/master/dist/jsrand.min.js.map) and include it in your app.

## Usage

<table>
<thead>
<tr>
<th width="50%">Browser</th>
<th width="50%">NPM</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```javascript
<script src="jsrand.min.js"></script>
```

This will define a global `Srand` object. If the name `Srand` is already taken, see `noConflict`.

</td>
<td>

```javascript
const Srand = require('jsrand');
```

or

```Javascript
import Srand from 'jsrand';
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
or instanciating a new generator:
```Javascript
const rnd = new Srand(10);
rnd.random(); // 0.4569510892033577

const othr = new Srand(rnd.seed());
othr.random(); // 0.4569510892033577
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
</tbody>
</table>



If a seed is not specified, a random one is chosen:
```Javascript
var baz = new Srand();
baz.seed(); // => 2285668919
```

**`randomize`** sets and returns a random seed:
```Javascript
baz.randomize(); // => 105785805
Srand.randomize(); // => 1959159643
```

**`randomIn(a, b [, x])`** returns a random float number between `a` (inclusive) and `b` exclusive.
```Javascript
foo.randomIn(20, 25); // => 20.662038924638182
foo.randomIn(20, 25); // => 24.90126643097028

Srand.randomIn(20, 25); // => 22.839022639673203
Srand.randomIn(20, 25); // => 20.512304682051763
```
If `x` is specified, it is used as the random number (between 0 inclusive and 1 exclusive), e.g., `Math.random()` can be used:
```Javascript
Srand.randomIn(0, 100, Math.random()); // => 27.20486264704126
```
If `x` is `undefined`, instance/Srand random() is used.

**`randomIntegerIn(min, max [, x])`** returns a random integer between `min` and `max` inclusive.
```Javascript
bar.randomIntegerIn(0, 50); // => 6
bar.randomIntegerIn(0, 50); // => 49

Srand.randomIntegerIn(0, 50); // => 12
Srand.randomIntegerIn(0, 50); // => 28
```
If `x` is specified, it is used as the random number (between 0 inclusive and 1 exclusive), e.g., `Math.random()` can be used:
```Javascript
Srand.randomIntegerIn(250, 275, Math.random()); // => 262
```
If `x` is `undefined`, instance/Srand random() is used.

**`choice(arr [, x])`** returns a random element from the array `arr` or `undefined` if the array is empty.
```Javascript
bar.choice([1, 2, 3]); // => 2
bar.choice([]); // => undefined

Srand.choice([1, 2, 3]); // => 3
Srand.choice([]); // => undefined
```

If `x` is specified, it is used as the random number (between 0 inclusive and 1 exclusive), e.g., `Math.random()` can be used:

```Javascript
Srand.choice([1, 2, 3], Math.random()); // => 3
```

In the uncommon case the variable `Srand` is already used, **`noConflict()`** restores its initial value and returns the `Srand` object (`dfd.Srand`can be used as well.)

```Javascript
Srand = "my value";

/* ........... */
/* load jsrand */
/* ........... */

var mySrand = Srand.noConflict();
Srand; // => "my value"

var foo = new mySrand(101);
foo.random(); // => 0.45733246579766273

dfd.Srand.random(); // => 0.9795262040570378
```

## License

Provided under the terms of the [MIT License](https://github.com/DomenicoDeFelice/jsrand/blob/master/LICENSE).

Copyright © 2014-2020, [Domenico De Felice](https://domdefelice.net).

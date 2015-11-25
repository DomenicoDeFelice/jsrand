jsrand
======

A simple (~60 LOCs, 1.4KB minified) Javascript library for seeded pseudo-random number generation.  

Numbers are generated using a one-seeded version of the [multiply-with-carry method by George Marsaglia](http://en.wikipedia.org/wiki/Multiply-with-carry). While this method is okay for most applications, it is not cryptographically strong.

Usage
-----
jsrand can be used statically
```Javascript
Srand.seed(10); // => 10
Srand.random(); // => 0.4569510892033577
```
or by creating an instance
```Javascript
var foo = new Srand(10);
foo.random(); // => 0.4569510892033577

var bar = new Srand(foo.seed());
bar.random(); // => 0.4569510892033577
```

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

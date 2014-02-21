jsrand
======

A simple (~50 LOCs) Javascript library for seeded pseudo-random number generation.  

Numbers are generated using a one-seeded version of the [multiply-with-carry method by George Marsaglia](http://en.wikipedia.org/wiki/Multiply-with-carry). While this method is okay for most applications, it is not cryptographically strong.

Usage
-----
jsrand can be used statically
```Javascript
Srand.seed(10); // => 10
Srand.random(); // => 0.4569510892033577
```
or creating an instance
```Javascript
var foo = new Srand(10);
foo.random(); // => 0.4569510892033577
```




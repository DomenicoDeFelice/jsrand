QUnit.test('Srand.noConflict() restores the original value and returns Srand', function (assert) {
    var originalSrand         = Srand;
    var noConflictReturnValue = Srand.noConflict();

    assert.ok(originalSrand === noConflictReturnValue);

    // Value 'original value' for Srand is set in `tests.html`.
    assert.ok(Srand === 'original value');

    Srand = originalSrand;
});

QUnit.test('Srand and its instances generate the same random numbers', function (assert) {
    var instance = new Srand();

    Srand.seed(instance.seed());

    assert.ok(instance.random() === Srand.random());
});

QUnit.test('Same seeds generate same sequences', function (assert) {
    var instance = new Srand();
    Srand.seed(instance.seed());

    var foo_seq = [];
    var bar_seq = [];

    for (var i=0; i<100; i++) {
        foo_seq.push(instance.random());
        bar_seq.push(Srand.random());
    }

    assert.deepEqual(foo_seq, bar_seq);
});

QUnit.test('randomIn returns only numbers in the specified range', function (assert) {
    Srand.randomize();

    var min = 10;
    var max = 20;

    for (var i=0; i<1000; i++) {
        var r = Srand.randomIn(min, max);
        assert.ok(r >= min && r < max);
    }
});

QUnit.test('Random float from a range of length 1 always returns the same number', function (assert) {
    Srand.randomize();

    for (var i=0; i<100; i++) {
        assert.ok(Srand.randomIn(1, 1) === 1);
    }
});

QUnit.test('randomIntegerIn returns only integers numbers in the specified range', function (assert) {
    Srand.randomize();

    var min = 10;
    var max = 20;

    for (var i=0; i<1000; i++) {
        var r = Srand.randomIntegerIn(min, max);
        assert.ok(r >= min && r <= max && r%1===0);
    }
});

QUnit.test('randomIntegerIn returns correct random integer for random number equal to 0', function (assert) {
    assert.ok(Srand.randomIntegerIn(0, 10, 0) === 0);
});

QUnit.test('randomIntegerIn returns correct random integer for random number equal to 0.999', function (assert) {
    assert.ok(Srand.randomIntegerIn(0, 10, 0.999) == 10);
});

QUnit.test('randomize sets a new seed and returns it', function (assert) {
    var old_seed = Srand.seed();
    var new_seed = Srand.randomize();

    assert.ok(old_seed !== new_seed);
    assert.ok(Srand.seed() === new_seed);
});

QUnit.test('choice with an empty array returns undefined', function (assert) {
    Srand.randomize();

    assert.ok(Srand.choice([]) === undefined);
    assert.ok(Srand.choice([], 0.5) === undefined);
});

QUnit.test('choice with an array with 1 element always returns that element', function (assert) {
    Srand.randomize();

    for (var i=0; i<10; i++) {
        assert.ok(Srand.choice(['foo']) === 'foo');
    }
});

QUnit.test('choice returns elements from the passed array and not always the same', function (assert) {
    Srand.randomize();

    var arr = [];
    for (var i=0; i<10; i++) {
        arr.push(i);
    }

    var all_equal = true;
    var first;

    for (i=0; i<100; i++) {
        var choice = Srand.choice(arr);

        if (i === 0) {
            first = choice;
        } else if (choice !== first) {
            all_equal = false;
        }

        assert.ok(choice >= 0 && choice<10);
    }

    assert.notOk(all_equal);
});

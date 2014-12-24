propertize Module
=================
The propertize module exposes semantically named wrappers for the ECMAScript
standard `Object.defineProperty` function.  The `propertize` functions are
broken up into three categories: **value**, **flag**, and **get/set**.

#### Value Functions
Each value function is defined to set all descriptor flags (`configurable`,
`enumerable`, `writable`), wipe any `get` or `set` functions, and optionally
update the `value`.  Each of the functions (`attribute`, `field`, `hidden`,
`internal`, `locked`, `readonly`, `regular`, and `setting`) has the same
signature, differing only in the values set for the descriptor flags.

```js
/**
 * Common function signature for value functions.
 * @param {object} obj  Object on which the property will be defined.
 * @param {string} prop Name of property to define.
 * @param {*} [val]     New value for property (defaults to existing value).
 */
function(obj, prop, val);
```

#### Flag Functions
Each flag function updates a single descriptor flag after which it is named
(`configurable`, `enumerable`, `writable`).  All other descriptors are
preserved, including get/set functions, value, and other flags.  Each of these
functions has the same signature.

```js
/**
 * Common function signature for flag functions.
 * @param {object} obj      Object on which the property will be configured.
 * @param {string} prop     Name of property to configure.
 * @param {boolean} [flag]  Flag value (default true)
 */
function(obj, prop, flag);
```

#### Get/Set Functions
Each get/set function is intended to solve a typical use case for using getters
and setters.  Each has a different signature described below.  The functions in
this group are `derived`, `managed`, `normalized`, `triggered`, and
`validated`.

API
---

### attribute
Value function which configures property flags as follows.

 * Non configurable
 * Enumerable
 * Non writeable

### configurable
Flag function for updating the configurable flag.  Note: it is not actually
possible to set this flag once it has been unset, but it can be safely set any
number of times if it has not yet been unset.

### derived
Define a property which is derived, either from other object properties or
another source.  The property will be made non-enumerable.

```js
/**
 * @param {object} obj
 * @param {string} prop
 * @param {function} derive
 */
function derived(obj, prop, derive);
```

**Example**

```js
var derived = require("propertize").derived,
    obj = {fname: "Muhammad", lname: "Li"};

// configure a "name" property to be the concatenation of fname and lname
derived(obj, "name", function() {
    return this.fname + " " + this.lname;
});

// "name" is now a derived property
assert(obj.name === "Muhammad Li");
```

### enumerable
Flag function for updating the enumerable flag.

### field
Value function which configures property flags as follows.

 * Non configurable
 * Enumerable
 * Writeable

### hidden
Value function which configures property flags as follows.

 * Configurable
 * Non enumerable
 * Writeable

### internal
Value function which configures property flags as follows.

 * Configurable
 * Non enumerable
 * Non writeable

### locked
Value function which configures property flags as follows.

 * Non configurable
 * Non enumerable
 * Non writeable

### managed
Define a property managed by a getter and setter.  The property will be made
non-enumerable.

```js
/**
 * @param {object} obj
 * @param {string} prop
 * @param {function} set
 * @param {function} get
 */
function managed(obj, prop, set, get);
```

**Example**

```js
var managed = require("propertize").managed,
    obj = {data: {}};

// proxy the "id" property to/from the object's data
managed(obj, "id", function(val) {
    this.data.id = val;
}, function() {
    return this.data.id;
});
```

### normalized
Define a property which normalizes values to a particular form before updating.
If an optional value is passed, the value will be set without any
normalization.  The property will be made enumerable.

```js
/**
 * @param {object} obj
 * @param {string} prop
 * @param {*} [val]
 * @param {function} normalizer
 */
function normalized(obj, prop, val, normalizer);
```

**Example**

```js
var normalized = require("propertize").normalized,
    obj = {};

// configure a "foo" property which normalizes values to int before updating.
normalized(obj, "foo", function(val) {
    var intVal = parseInt(val);
    return isNaN(intVal) ? this.foo : intVal;
});

// set a string value
obj.foo = "42";
assert(obj.foo === 42);

// set a float value
obj.foo = 42.24;
assert(obj.foo === 42);
```

### readonly
Value function which configures property flags as follows.

 * Configurable
 * Enumerable
 * Non writeable

### regular
Value function which configures property flags as follows.

 * Configurable
 * Enumerable
 * Writeable

### setting
Value function which configures property flags as follows.

 * Non configurable
 * Non enumerable
 * Writeable

### triggered
Define a property which triggers a callback whenever the property is updated.
The property will be made non-enumerable.

```js
/**
 * @param {object} obj
 * @param {string} prop
 * @param {function} change
 */
function triggered(obj, prop, change);
```

**Example**

```js
var triggered = require("propertize").triggered,
    obj = {};

// call function whenever "foo" property is changed
triggered(obj, "foo", function(is, was) {
    console.log("object foo changed from", was, "to", is);
});
```

### validated
Define a property which will reject invalid updates.  When attempting to set an
invalid value, the update is silently ignored.  If an optional value is passed,
the value will be set without any validation.  The property will be made
enumerable.

```js
/**
 * @param {object} obj
 * @param {string} prop
 * @param {*} [val]
 * @param {function} validator
 */
function validated(obj, prop, val, validator);
```

**Example**

```js
var validated = require("propertize").validated,
    obj = {};

// configure a "foo" property which only acceptes string values
validated(obj, "foo", function(val) {
    return typeof val === "string";
});

// set the "foo" property
obj.foo = "Foo";
assert(obj.foo === "Foo");

// attempt to set an invalid value
obj.foo = 42;
assert(obj.foo === "Foo");
```

### writeable
Flag function for updating the writable flag.


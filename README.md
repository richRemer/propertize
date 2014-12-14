propertize Module
=================
The propertize module exposes semantically named wrappers for the standard
`Object.defineProperty` function.

Value Property Functions
------------------------
Value properties have configured flags and a simple value.  There is a function
for each combination of flags.  If getter/setter is defined for the property,
it will be removed.  All value property functions have the following
signature:

```js
/**
 * @param {object} obj  Object on which the property will be defined.
 * @param {string} prop Name of property to define.
 * @param {*} [val]     New value for property (defaults to existing value).
 */
function(obj, prop, val);
```

### regular
Define a property with the following configuration:

 * Configurable
 * Enumerable
 * Writeable

### field
Define a property with the following configuration:

 * Non configurable
 * Enumerable
 * Writeable

### hidden
Define a property with the following configuration:

 * Configurable
 * Non enumerable
 * Writeable

### readonly
Define a property with the following configuration:

 * Configurable
 * Enumerable
 * Non writeable

### internal
Define a property with the following configuration:

 * Configurable
 * Non enumerable
 * Non writeable

### attribute
Define a property with the following configuration:

 * Non configurable
 * Enumerable
 * Non writeable

### setting
Define a property with the following configuration:

 * Non configurable
 * Non enumerable
 * Writeable

### locked
Define a property with the following configuration:

 * Non configurable
 * Non enumerable
 * Non writeable

Property Flag Functions
-----------------------
The property flag functions are used to update a configuration flag for an
existing property.  Unlike the value property functions, the property value
will not be updated and any getters or setters will be preserved.  Property
flag functions have the following signature:

```js
/**
 * @param {object} obj      Object on which the property will be configured.
 * @param {string} prop     Name of property to configure.
 * @param {boolean} [flag]  Flag value (default true)
 */
function(obj, prop, flag);
```

### configurable
Set the configurable flag.  Note: it is not actually possible to set this flag
once it has been unset, but it can be safely set any number of times before
then.

### enumerable
Set the enumerable flag.

### writeable
Set the writeable flag.

Getter/Setter Property Functions
--------------------------------
Some common use cases for getters and setters are made available in the
`propertize` module.

### validated
Use the `validated` function to define a property which will reject invalid
updates.  When attempting to set an invalid value, the update is silently
ignored.  The property will be enumerable.

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

### normalized
Use the `normalized` function to normalize values before updating.  The property
will be enumerable.

```js
var normalized = require("propertize").normalized,
    obj = {};

// configure a "foo" property which normalizes values to int before updating.
normalized(obj, "foo", function(val) {
    return isNaN(parseInt(val)) ? obj.foo : parseInt(val);
});

// set a string value
obj.foo = "42";
assert(obj.foo === 42);

// set a float value
obj.foo = 42.24;
assert(obj.foo === 42);
```

### derived
Use the `derived` function to calculate a property value using a getter.  The
property will not be enumerable.

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

### managed
Use the `managed` function to provide a getter/setter for the property.  The
property will not be enumerable.

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

### triggered
Use the `triggered` function to have a callback invoked whenever the property
is updated.  The property will not be enumerable.

```js
var triggered = require("propertize").triggered,
    obj = {};

// call function whenever "foo" property is changed
triggered(obj, "foo", function(is, was) {
    console.log("object foo changed from", was, "to", is);
});
```


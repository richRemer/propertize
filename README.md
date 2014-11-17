propertize Module
=================
The propertize module exposes semantically named wrappers for the standard
`Object.defineProperty` function.  The three `defineProperty` flags -
`configurable`, `enumerable`, and `writeable` - are available in all possible
combinations as the propertize functions `regular`, `field`, `hidden`,
`readonly`, `internal`, `attribute`, `setting`, and `locked`.  Some common uses
for setters are also available with the functions `validated` and `normalized`,
for getters with the function `derived`, and for getter/setter with the function
`managed`.

Basic Properties
----------------
Basic properties are those with only flags configured.  All of the propertize
functions for configuring basic properties have the following signature:

```js
/**
 * @param {object} obj  Object on which the property will be defined.
 * @param {string} prop Name of property to define.
 * @param {*} [val]     New value for property (defaults to existing value).
 */
function(obj, prop, val);
```

### regular
Use the `regular` function to define a typical JS object property.  Normally
this is done with the `=` operator, but this can be useful to reset any property
configuration which has already taken place (e.g., by calling one of the other
functions in this module).

 * Configurable
 * Enumerable
 * Writeable

### field
Use the `field` function to defined a permanent, enumerable property on the
object.  `field` will ensure the property cannot be removed or locked down
later.  Possible uses are when mapping to a field defined in a SQL schema or to
a domain specific model and you wish the property to always be included during
object serialization.

 * Non configurable
 * Enumerable
 * Writeable

### hidden
Use the `hidden` function to prevent a property from being enumerated.  Possible
uses include decorating an object with dynamic metadata which should not be part
of the object's serialization.

 * Configurable
 * Non enumerable
 * Writeable

### readonly
Use the `readonly` function to prevent the property value from being updated
with the `=` operator.  There are many uses for a read-only property and you
can call the `readonly` function again to update the value if needed.

 * Configurable
 * Enumerable
 * Non writeable

### internal
Use the `internal` function when a property is an implementation detail which
may or may not be present in the future and which should be kept hidden away
from the object consumers.  Value updates will be prevented and the property
will not be enumerated.

 * Configurable
 * Non enumerable
 * Non writeable

### attribute
Use the `attribute` function to add a permanent value to the object.  Property
enumeration will include the property and the property value will never change
in the future.  One possible use is for a property set during construction of a
base class which is selected by a sub-class.  By using an `attribute`, the base
class can guarantee the child won't change the value later.

 * Non configurable
 * Enumerable
 * Non writeable

### setting
Use the `setting` function to make a permanent, mutable prroperty which will not
be included during enumeration.  One use might be runtime view state on a
model object which is not intrinsic to the object and which will not be
serialized.

 * Non configurable
 * Non enumerable
 * Writeable

### locked
Use the `locked` function to define a locked and hidden value on the object.
The value will never change in the future and will never be enumerated.  Since
the lock can never be unlocked, this may have security uses, ensuring a value
cannot be tampered with.

 * Non configurable
 * Non enumerable
 * Non writeable

Call Properties
---------------
Call properties have a getter and/or setter function associated with them.

### validated
Use the `validated` function to define a property which will reject invalid
updates.  When attempting to set an invalid value, the update is silently
ignored.

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
Use the `normalized` function to normalize values before updating.

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
Use the `derived` function to calculate a property value using a getter.

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
Use the `managed` function to provide a getter/setter for the property.

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
is updated.

```js
var triggered = require("propertize").triggered,
    obj = {};

// call function whenever "foo" property is changed
triggered(obj, "foo", function(is, was) {
    console.log("object foo changed from", was, "to", is);
});
```

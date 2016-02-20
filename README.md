propertize Module
=================
The propertize module exposes semantically named wrappers for the ECMAScript
standard `Object.defineProperty` function.

API Overview
------------

Update a single property descriptor
 * **value**: set value
 * **configurable**: set configurable/non-configurable
 * **enumerable**: set enumerable/non-enumerable
 * **writable**: set writable/non-writable
 * **get**: define get
 * **set**: define set

Update all property descriptors
 * **attribute**: set enumerable, non-configurable, non-writable; set value; wipe get/set
 * **basic**: set configurable, enumerable, writable; set value; wipe get/set
 * **field**: set enumerable, writable, non-configurable; set value; wipe get/set
 * **hidden**: set configurable, writable, non-enumerable; set value; wipe get/set
 * **internal**: set configurable, non-enumerable, non-writable; set value; wipe get/set
 * **locked**: set non-configurable, non-enumerable, non-writable; set value; wipe get/set
 * **readonly**: set configurable, enumerable, non-writable; set value; wipe get/set
 * **setting**: set writable, non-configurable, non-enumerable; set value; wipe get/set

Common use cases for getters/setters 
 * **derived**: set non-enumerable; define get; wipe set
 * **managed**: set non-enumerable; define get/set
 * **normalized**: set enumerable; define get/set
 * **triggered**: set non-enumerable; define get/set
 * **validated**: set enumerable; define get/set

Utility
 * **describe**: return effective property descriptor

API Documentation
-----------------
All `propertize` functions accept a target object or function.  When a function
is provided, the function's prototype will be updated rather than the function
itself.


#### attribute(target, prop, [val])
Define an enumerable, non-configurable, non-writable property on an object.  If
no value is provided, use the existing value.  Clear any getter or setter.

#### basic(target, prop, [val])
Define a configurable, enumerable, writable property on an object.  If no value
is provided, use the existing value.  Clear any getter or setter.

#### configurable(target, prop, [flag])
Add or update the configurable descriptor for an object property.  If no flag
is provided, default to true.  Note: it is not possible to set this flag to
true once it has been set to false.  This is by design.  Once a property's
configuration has been removed, it cannot be undone.

#### derived(target, prop, derive)
Define a non-enumerable property with a getter used to derive the value.  The
derive function's scope will be set to the object.

**Example**

```js
var derived = require("propertize").derived,
    target = {fname: "Muhammad", lname: "Li"};

// configure a "name" property to be the concatenation of fname and lname
derived(target, "name", function() {
    return this.fname + " " + this.lname;
});

// "name" is now a derived property
assert(target.name === "Muhammad Li");
```

#### describe(target, prop)
Return the effective property descriptor for an object property.  This may be
the same descriptor as Object.getOwnPropertyDescriptor or it may be from a
prototype.

**Example**

```js
var desc = require("proprtize").describe({foo:42}, "foo");

assert(desc.value === 42);
assert(desc.writable === true);
```

#### enumerable(target, prop, [flag])
Add or update the enumerable descriptor for an object property.  If no flag
is provided, default to true.

#### field(target, prop, [val])
Define an enumerable, writable, non-configurable property on an object.  If no
value is provided, use the existing value.  Clear any getter or setter.

#### get(target, prop, getter)
Update an object property getter.

#### hidden(target, prop, [val])
Define a configurable, writable, non-enumerable property on an object.  If no
value is provided, use the existing value.  Clear any getter or setter.

#### internal(target, prop, [val])
Define a configurable, non-enumerable, non-writable property on an object.  If
no value is provided, use the existing value.  Clear any getter or setter.

#### locked(target, prop, [val])
Define a non-configurable, non-enumerable, non-writable property on an object.
If no value is provided, use the existing value.  Clear any getter or setter.

#### managed(target, prop, set, get)
Define a non-enumerable property with a getter and setter.  The set and get
functions' scopes will be set to the object.

**Example**

```js
var managed = require("propertize").managed,
    target = {data: {}};

// proxy the "id" property to/from the object's data
managed(target, "id", function(val) {
    this.data.id = val;
}, function() {
    return this.data.id;
});
```

#### normalized(target, prop, [val], normalize)
Define an enumerable property with a setter which normalizes values to a
particular form before updating.  If an optional value is passed, the value
will skip normalization.

**Example**

```js
var normalized = require("propertize").normalized,
    target = {};

// configure a "foo" property which normalizes values to int before updating.
normalized(target, "foo", function(val) {
    var intVal = parseInt(val);
    return isNaN(intVal) ? this.foo : intVal;
});

// set a string value
target.foo = "42";
assert(target.foo === 42);

// set a float value
target.foo = 42.24;
assert(target.foo === 42);
```

#### readonly(target, prop, [val])
Define a configurable, enumerable, non-writable property on an object.  If no
value is provided, use the existing value.  Clear any getter or setter.

#### set(target, prop, setter)
Update an object property setter.

#### setting(target, prop, [val])
Define a writable, non-configurable, non-enumerable property on an object.  If
no value is provided, use the existing value.  Clear any getter or setter.

#### triggered(target, prop, trigger)
Define a non-enumerable property which triggers a callback whenever the
property is set.

**Example**

```js
var triggered = require("propertize").triggered,
    target = {};

// call function whenever "foo" property is changed
triggered(target, "foo", function(is, was) {
    console.log("object foo changed from", was, "to", is);
});
```

#### validated(target, prop, [val], validate)
Define an enumerable property which rejects invalid updates.  When attempting
to set an invalid value, the update is silently ignored.  If an optional value
is passed, this initial value will be set without any validation.

**Example**

```js
var validated = require("propertize").validated,
    target = {};

// configure a "foo" property which only acceptes string values
validated(target, "foo", function(val) {
    return typeof val === "string";
});

// set the "foo" property
target.foo = "Foo";
assert(target.foo === "Foo");

// attempt to set an invalid value
target.foo = 42;
assert(target.foo === "Foo");
```

#### value(target, prop, val)
Update an object property value, even if it's non-writable.  Remove any get/set
defined for the property.

#### writable(target, prop, [flag])
Add or update the writable descriptor for an object property.  If no flag is
provided, default to true.

propertize Module
=================
The propertize module exposes semantically named wrappers for the ECMAScript
standard `Object.defineProperty` function.

Module Functions
----------------

#### attribute(obj, prop, [val])
Define an enumerable, non-configurable, non-writable property on an object.  If
no value is provided, use the existing value.  Clear any getter or setter.

#### basic(obj, prop, [val])
Define a configurable, enumerable, writable property on an object.  If no value
is provided, use the existing value.  Clear any getter or setter.

#### configurable(obj, prop, [flag])
Add or update the configurable descriptor for an object property.  If no flag
is provided, default to true.  Note: it is not possible to set this flag to
true once it has been set to false.  This is by design.  Once a property's
configuration has been removed, it cannot be undone.

#### derived(obj, prop, derive)
Define a non-enumerable property with a getter used to derive the value.  The
derive function's scope will be set to the object.

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

#### enumerable(obj, prop, [flag])
Add or update the enumerable descriptor for an object property.  If no flag
is provided, default to true.

#### field(obj, prop, [val])
Define an enumerable, writable, non-configurable property on an object.  If no
value is provided, use the existing value.  Clear any getter or setter.

### get(obj, prop, getter)
Update an object property getter.

#### hidden(obj, prop, [val])
Define a configurable, writable, non-enumerable property on an object.  If no
value is provided, use the existing value.  Clear any getter or setter.

#### internal(obj, prop, [val])
Define a configurable, non-enumerable, non-writable property on an object.  If
no value is provided, use the existing value.  Clear any getter or setter.

#### locked(obj, prop, [val])
Define a non-configurable, non-enumerable, non-writable property on an object.
If no value is provided, use the existing value.  Clear any getter or setter.

#### managed(obj, prop, set, get)
Define a non-enumerable property with a getter and setter.  The set and get
functions' scopes will be set to the object.

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

#### normalized(obj, prop, [val], normalize)
Define an enumerable property with a setter which normalizes values to a
particular form before updating.  If an optional value is passed, the value
will skip normalization.

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

#### readonly(obj, prop, [val])
Define a configurable, enumerable, non-writable property on an object.  If no
value is provided, use the existing value.  Clear any getter or setter.

#### [DEPRECATED] regular(obj, prop, [val])
Define a configurable, enumerable, writable property on an object.  If no value
is provided, use the existing value.  Clear any getter or setter.  This
function is deprecated.  Use `basic` instead.

### set(obj, prop, setter)
Update an object property setter.

#### setting(obj, prop, [val])
Define a writable, non-configurable, non-enumerable property on an object.  If
no value is provided, use the existing value.  Clear any getter or setter.

#### triggered(obj, prop, trigger)
Define a non-enumerable property which triggers a callback whenever the
property is set.

**Example**

```js
var triggered = require("propertize").triggered,
    obj = {};

// call function whenever "foo" property is changed
triggered(obj, "foo", function(is, was) {
    console.log("object foo changed from", was, "to", is);
});
```

#### validated(obj, prop, [val], validate)
Define an enumerable property which rejects invalid updates.  When attempting
to set an invalid value, the update is silently ignored.  If an optional value
is passed, this initial value will be set without any validation.

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

### value(obj, prop, val)
Update an object property value, even if it's non-writable.  Remove any get/set
defined for the property.

#### writeable(obj, prop, [flag])
Add or update the writable descriptor for an object property.  If no flag is
provided, default to true.

Future
------
Breaking changes scheduled for version 3.0.
 * remove deprecated `regular` function
 * ensure getter/setter functions work together
   * `validated` can safely layer over existing getter/setter
   * `triggered` can safely layer over existing getter/setter
   * `normalized` can safely layer over existing getter/setter
   * `managed` wipes existing getter/setter
   * `derived` wipes existing getter/setter
   * how do you replace the existing getter/setter in this case?
     * `basic`/`managed`/`derived`


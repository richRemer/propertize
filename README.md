propertize Module
=================
The propertize module exposes semantically named wrappers for the standard
`Object.defineProperty` function.  The three `defineProperty` flags -
`configurable`, `enumerable`, and `writeable` - are available in all possible
combinations as the propertize functions `regular`, `field`, `hidden`,
`readonly`, `internal`, `attribute`, `setting`, and `locked`.

Functions
------------------
All of the propertize functions have the following signature

```js
/**
 * @param {object} obj  Object on which the property will be defined.
 * @param {string} prop Name of property to define.
 * @param {*} [val]     (optional) New value for property.
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
model object which are not intrinsic to the object and which will not be
serialized.

 * Non configurable
 * Non enumerable
 * Writeable

### locked
Use the `locked` function to define locked and hidden value on the object.  The
value will never change in the future and will never be enumerated.  Since the
lock can never be unlocked, this may have security uses, ensuring a value cannot
be messed with.

 * Non configurable
 * Non enumerable
 * Non writeable

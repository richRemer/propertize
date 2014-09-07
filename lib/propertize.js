/*
 *  propertize exposes a named function for each possible combination of
 *  property definition flags.
 *
 *  FUNCTION                       FLAGS
 *              configurable    enumerable      writeable
 *  -----------------------------------------------------
 *  regular          X               X               X
 *  field            -               X               X
 *  hidden           X               -               X
 *  readonly         X               X               -
 *  internal         X               -               -
 *  attribute        -               X               -
 *  setting          -               -               X
 *  locked           -               -               -
 */

/**
 * Configure a regular property.  The property will be configurable, enumerable,
 * and writeable.  If no value is provided, the current value will be used.
 * This function can be useful after you've already configured a property and
 * wish it to return back to normal behavior.
 * @param {object} obj
 * @param {string} prop
 * @param {*} [val]
 */
function regular(obj, prop, val) {
    if (arguments.length < 3) val = obj[prop];
    Object.defineProperty(obj, prop, {
        configurable: true,
        enumerable: true,
        writeable: true,
        value: val
    });
}

/**
 * Configure a field property on an object which will not be configurable.  If
 * no value if provided, the current value will be used.
 * @param {object} obj
 * @param {string} prop
 * @param {*} [val]
 */
function field(obj, prop, val) {
    if (arguments.length < 3) val = obj[prop];
    Object.defineProperty(obj, prop, {
        enumerable: true,
        writeable: true,
        value: val
    });
}

/**
 * Configure a hidden property on an object which will not be enumerable.  If
 * no value if provided, the current value will be used.
 * @param {object} obj
 * @param {string} prop
 * @param {*} [val]
 */
function hidden(obj, prop, val) {
    if (arguments.length < 3) val = obj[prop];
    Object.defineProperty(obj, prop, {
        configurable: true,
        writeable: true,
        value: val
    });
} 

/**
 * Configure a read-only property on an object which will not be writeable.  If
 * no value is provided, the current value will be used.
 * @param {object} obj
 * @param {string} prop
 * @param {*} [val]
 */
function readonly(obj, prop, val) {
    if (arguments.length < 3) val = obj[prop];
    Object.defineProperty(obj, prop, {
        configurable: true,
        enumerable: true,
        value: val
    });
}

/**
 * Configure an internal property on an object which will not be enumerable or
 * writeable.  If no value is provided, the current value will be used.
 * @param {object} obj
 * @param {string} prop
 * @param {*} [val]
 */
function internal(obj, prop, val) {
    if (arguments.length < 3) val = obj[prop];
    Object.defineProperty(obj, prop, {
        configurable: true,
        value: val
    });
}

/**
 * Configure an attribute property on an object which will not be configurable
 * or writeable.  If no value is provided, the current value will be used.
 * @param {object} obj
 * @param {string} prop
 * @param {*} [val]
 */
function attribute(obj, prop, val) {
    if (arguments.length < 3) val = obj[prop];
    Object.defineProperty(obj, prop, {
        enumerable: true,
        value: val
    });
}

/**
 * Configure a setting property on an object which will not be configurable or
 * enumerable.  If no value is provided, the current value will be used.
 * @param {object} obj
 * @param {string} prop
 * @param {*} [val]
 */
function setting(obj, prop, val) {
    if (arguments.length < 3) val = obj[prop];
    Object.defineProperty(obj, prop, {
        writeable: true,
        value: val
    });
} 

/**
 * Configure a locked property on an object which will not be configurable,
 * enumerable, or writeable.  If no value is provided, the current value will be
 * used.
 * @param {object} obj
 * @param {string} prop
 * @param {*} [val]
 */
function locked(obj, prop, val) {
    if (arguments.length < 3) val = obj[prop];
    Object.defineProperty(obj, prop, {
        value: val
    });
}

/**
 * Configure a validated property on an object which will ignore updates for
 * values which return a non-true value when passed to a validator function.
 * @param {object} obj
 * @param {string} prop
 * @param {*} [val]
 * @param {function} validator
 */
function validated(obj, prop, val, validator) {
    if (arguments.length < 4) validator = val, val = obj[prop];
    Object.defineProperty(obj, prop, {
        configurable: true,
        enumerable: true,
        get: function() {return val;},
        set: function(newval) {
            if (validator(newval) === true) val = newval;
        }
    });
}

/**
 * Configure a normalized property on an object which passes a value through a
 * normalizer function before updating.
 * @param {object} obj
 * @param {string} prop
 * @param {*} [val]
 * @param {function} normalizer
 */
function normalized(obj, prop, val, normalizer) {
    if (arguments.length < 4) normalizer = val, val = obj[prop];
    Object.defineProperty(obj, prop, {
        configurable: true,
        enumerable: true,
        get: function() {return val;},
        set: function(newval) {val = normalizer(newval);}
    });
}

/**
 * Configure a derived property on an object which is read-only and whose value
 * is calculated by a derive function every time it is accessed.
 * @param {object} obj
 * @param {string} prop
 * @param {function} derive
 */
function derived(obj, prop, derive) {
    Object.defineProperty(obj, prop, {
        configurable: true,
        get: derive
    });
}

/** export propertize functions */
module.exports = {
    regular: regular,
    field: field,
    hidden: hidden,
    readonly: readonly,
    internal: internal,
    attribute: attribute,
    setting: setting,
    locked: locked,
    
    validated: validated,
    normalized: normalized,
    derived: derived
};

/*
    propertize exposes a named function for each possible combination of
    property definition flags.

    FUNCTION                       FLAGS
                configurable    enumerable      writeable
    -----------------------------------------------------
    regular          X               X               X
    field            -               X               X
    hidden           X               -               X
    readonly         X               X               -
    internal         X               -               -
    attribute        -               X               -
    setting          -               -               X
    locked           -               -               -
*/

/**
 * Configure a regular property.  The property will be configurable, enumerable,
 * and writeable.  If not value is provided, the current value will be used.
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

/** export propertize functions */
module.exports = {
    regular: regular,
    field: field,
    hidden: hidden,
    readonly: readonly,
    internal: internal,
    attribute: attribute,
    setting: setting,
    locked: locked
}

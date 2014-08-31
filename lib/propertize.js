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
 * Configure a calculated property on an object which will not be enumerable or
 * writeable.  When reading the property, it will be calculated by calling a
 * function on the object.
 * @param {object} obj
 * @param {string} prop
 * @param {function} fn
 */
function calculated(obj, prop, fn) {
    Object.defineProperty(obj, prop, {
        configurable: true,
        get: fn
    });
}

/** export propertize functions */
module.exports = {
    internal: internal,
    readonly: readonly,
    calculated: calculated
}

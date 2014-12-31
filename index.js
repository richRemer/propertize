/**
 * Configure a basic property.  The property will be configurable, enumerable,
 * and writable.  If no value is provided, the current value will be used.
 * This function can be useful after you've already configured a property and
 * wish it to return back to normal behavior.
 * @param {object} obj
 * @param {string} prop
 * @param {*} [val]
 */
function basic(obj, prop, val) {
    if (arguments.length < 3) val = obj[prop];
    Object.defineProperty(obj, prop, {
        configurable: true,
        enumerable: true,
        writable: true,
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
        configurable: false,
        enumerable: true,
        writable: true,
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
        enumerable: false,
        writable: true,
        value: val
    });
} 

/**
 * Configure a read-only property on an object which will not be writable.  If
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
        writable: false,
        value: val
    });
}

/**
 * Configure an internal property on an object which will not be enumerable or
 * writable.  If no value is provided, the current value will be used.
 * @param {object} obj
 * @param {string} prop
 * @param {*} [val]
 */
function internal(obj, prop, val) {
    if (arguments.length < 3) val = obj[prop];
    Object.defineProperty(obj, prop, {
        configurable: true,
        enumerable: false,
        writable: false,
        value: val
    });
}

/**
 * Configure an attribute property on an object which will not be configurable
 * or writable.  If no value is provided, the current value will be used.
 * @param {object} obj
 * @param {string} prop
 * @param {*} [val]
 */
function attribute(obj, prop, val) {
    if (arguments.length < 3) val = obj[prop];
    Object.defineProperty(obj, prop, {
        configurable: false,
        enumerable: true,
        writable: false,
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
        configurable: false,
        enumerable: false,
        writable: true,
        value: val
    });
} 

/**
 * Configure a locked property on an object which will not be configurable,
 * enumerable, or writable.  If no value is provided, the current value will be
 * used.
 * @param {object} obj
 * @param {string} prop
 * @param {*} [val]
 */
function locked(obj, prop, val) {
    if (arguments.length < 3) val = obj[prop];
    Object.defineProperty(obj, prop, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: val
    });
}

/**
 * Update an object property value, resetting any get/set and bypassing
 * non-writable descriptor.
 * @param {object} obj
 * @param {string} prop
 * @param {*} val
 */
function value(obj, prop, val) {
    var desc = Object.getOwnPropertyDescriptor(obj, prop);
    
    // if property is already defined, remove get/set and update value
    if (desc) {
        desc.value = val;
        if (desc.get && !desc.set) desc.writable = false;
        delete desc.get;
        delete desc.set;
        Object.defineProperty(obj, prop, desc);
    }

    // just set the property value to get a basic property
    else obj[prop] = val;
}

/**
 * Update the configuration for an object property, setting the configurable
 * flag (default to true).  In practice, the flag cannot be set to true once set
 * to false, but it may be set to true any number of times before being set to
 * false.
 * @param {object} obj
 * @param {string} prop
 * @param {boolean} [configurable]
 */
function configurable(obj, prop, configurable) {
    var desc = Object.getOwnPropertyDescriptor(obj, prop);
    configurable = arguments.length < 3 ? true : !!configurable;

    // if property is already defined, update its configurable flag
    if (desc) {
        desc.configurable = !!configurable;
        Object.defineProperty(obj, prop, desc);
    }

    // make field if configurable is being set to false
    else if (!configurable) field(obj, prop);
}

/**
 * Update the configuration for an object property, setting the enumerable flag
 * (default to true).
 * @param {object} obj
 * @param {string} prop
 * @param {boolean} [enumerable]
 */
function enumerable(obj, prop, enumerable) {
    var desc = Object.getOwnPropertyDescriptor(obj, prop);
    enumerable = arguments.length < 3 ? true : !!enumerable;

    // if property is already defined, update its enumerable flag
    if (desc) {
        desc.enumerable = !!enumerable;
        Object.defineProperty(obj, prop, desc);
    }

    // make hidden if enumerable is being set to false
    else if (!enumerable) hidden(obj, prop);
}

/**
 * Update the configuration for an object property, setting the writable flag
 * (default to true).
 * @param {object} obj
 * @param {string} prop
 * @param {boolean} [writable]
 */
function writable(obj, prop, writable) {
    var desc = Object.getOwnPropertyDescriptor(obj, prop);
    writable = arguments.length < 3 ? true : !!writable;

    // if property is already defined, update its writable flag
    if (desc) {
        desc.writable = !!writable;
        Object.defineProperty(obj, prop, desc);
    }

    // make readonly if writable is being set to false
    else if (!writable) readonly(obj, prop);
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
        enumerable: false,
        get: derive,
        set: undefined
    });
}

/**
 * Configure a property on an object which has get/set handlers.
 * @param {object} obj
 * @param {string} prop
 * @param {function} set
 * @param {function} get
 */
function managed(obj, prop, set, get) {
    Object.defineProperty(obj, prop, {
        configurable: true,
        enumerable: false,
        set: set,
        get: get
    });
}

/**
 * Configure a property on an object which triggers a callback when changed.
 * @param {object} obj
 * @param {string} prop
 * @param {function} change
 */
function triggered(obj, prop, change) {
    var val = obj[prop];

    Object.defineProperty(obj, prop, {
        configurable: true,
        enumerable: false,
        set: function(newval) {
            var oldval = val;
            val = newval;
            change.call(obj, newval, oldval);
        },
        get: function() {return val;}
    });
}

/** export propertize functions */
module.exports = {
    attribute: attribute,
    basic: basic,
    field: field,
    hidden: hidden,
    internal: internal,
    locked: locked,
    readonly: readonly,
    regular: basic,         // deprecated alias
    setting: setting,

    value: value,

    configurable: configurable,
    enumerable: enumerable,
    writable: writable,
    
    derived: derived,
    managed: managed,
    normalized: normalized,
    triggered: triggered,
    validated: validated
};

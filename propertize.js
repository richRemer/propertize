/**
 * Normalize target.
 * @param {object|function} target
 * @returns {object}
 */
function normalTarget(target) {
    return typeof target === "function"
        ? target.prototype
        : target;
}

/**
 * Configure a basic property.  The property will be configurable, enumerable,
 * and writable.  If no value is provided, the current value will be used.
 * This function can be useful after you've already configured a property and
 * wish it to return back to normal behavior.
 * @param {object|function} target
 * @param {string} prop
 * @param {*} [val]
 */
function basic(target, prop, val) {
    target = normalTarget(target);
    if (arguments.length < 3) val = target[prop];
    Object.defineProperty(target, prop, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: val
    });
}

/**
 * Configure a field property on an object which will not be configurable.  If
 * no value if provided, the current value will be used.
 * @param {object|function} target
 * @param {string} prop
 * @param {*} [val]
 */
function field(target, prop, val) {
    target = normalTarget(target);
    if (arguments.length < 3) val = target[prop];
    Object.defineProperty(target, prop, {
        configurable: false,
        enumerable: true,
        writable: true,
        value: val
    });
}

/**
 * Configure a hidden property on an object which will not be enumerable.  If
 * no value if provided, the current value will be used.
 * @param {object|function} target
 * @param {string} prop
 * @param {*} [val]
 */
function hidden(target, prop, val) {
    target = normalTarget(target);
    if (arguments.length < 3) val = target[prop];
    Object.defineProperty(target, prop, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: val
    });
} 

/**
 * Configure a read-only property on an object which will not be writable.  If
 * no value is provided, the current value will be used.
 * @param {object|function} target
 * @param {string} prop
 * @param {*} [val]
 */
function readonly(target, prop, val) {
    target = normalTarget(target);
    if (arguments.length < 3) val = target[prop];
    Object.defineProperty(target, prop, {
        configurable: true,
        enumerable: true,
        writable: false,
        value: val
    });
}

/**
 * Configure an internal property on an object which will not be enumerable or
 * writable.  If no value is provided, the current value will be used.
 * @param {object|function} target
 * @param {string} prop
 * @param {*} [val]
 */
function internal(target, prop, val) {
    target = normalTarget(target);
    if (arguments.length < 3) val = target[prop];
    Object.defineProperty(target, prop, {
        configurable: true,
        enumerable: false,
        writable: false,
        value: val
    });
}

/**
 * Configure an attribute property on an object which will not be configurable
 * or writable.  If no value is provided, the current value will be used.
 * @param {object|function} target
 * @param {string} prop
 * @param {*} [val]
 */
function attribute(target, prop, val) {
    target = normalTarget(target);
    if (arguments.length < 3) val = target[prop];
    Object.defineProperty(target, prop, {
        configurable: false,
        enumerable: true,
        writable: false,
        value: val
    });
}

/**
 * Configure a setting property on an object which will not be configurable or
 * enumerable.  If no value is provided, the current value will be used.
 * @param {object|function} target
 * @param {string} prop
 * @param {*} [val]
 */
function setting(target, prop, val) {
    target = normalTarget(target);
    if (arguments.length < 3) val = target[prop];
    Object.defineProperty(target, prop, {
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
 * @param {object|function} target
 * @param {string} prop
 * @param {*} [val]
 */
function locked(target, prop, val) {
    target = normalTarget(target);
    if (arguments.length < 3) val = target[prop];
    Object.defineProperty(target, prop, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: val
    });
}

/**
 * Update an object property value, resetting any get/set and bypassing
 * non-writable descriptor.
 * @param {object|function} target
 * @param {string} prop
 * @param {*} val
 */
function value(target, prop, val) {
    target = normalTarget(target);

    var desc = describe(target, prop);
    
    // if property is already defined, remove get/set and update value
    if (desc) {
        desc.value = val;
        if (desc.get && !desc.set) desc.writable = false;
        delete desc.get;
        delete desc.set;
        Object.defineProperty(target, prop, desc);
    }

    // just set the property value to get a basic property
    else target[prop] = val;
}

/**
 * Update the configuration for an object property, setting the configurable
 * flag (default to true).  In practice, the flag cannot be set to true once set
 * to false, but it may be set to true any number of times before being set to
 * false.
 * @param {object|function} target
 * @param {string} prop
 * @param {boolean} [configurable]
 */
function configurable(target, prop, configurable) {
    target = normalTarget(target);
    configurable = arguments.length < 3 ? true : !!configurable;

    var desc = describe(target, prop);

    // if property is already defined, update its configurable flag
    if (desc) {
        desc.configurable = !!configurable;
        Object.defineProperty(target, prop, desc);
    }

    // make field if configurable is being set to false
    else if (!configurable) field(target, prop);
}

/**
 * Update the configuration for an object property, setting the enumerable flag
 * (default to true).
 * @param {object|function} target
 * @param {string} prop
 * @param {boolean} [enumerable]
 */
function enumerable(target, prop, enumerable) {
    target = normalTarget(target);
    enumerable = arguments.length < 3 ? true : !!enumerable;

    var desc = describe(target, prop);

    // if property is already defined, update its enumerable flag
    if (desc) {
        desc.enumerable = !!enumerable;
        Object.defineProperty(target, prop, desc);
    }

    // make hidden if enumerable is being set to false
    else if (!enumerable) hidden(target, prop);
}

/**
 * Update the configuration for an object property, setting the writable flag
 * (default to true).
 * @param {object|function} target
 * @param {string} prop
 * @param {boolean} [writable]
 */
function writable(target, prop, writable) {
    target = normalTarget(target);
    writable = arguments.length < 3 ? true : !!writable;

    var desc = describe(target, prop);

    // if property is already defined, update its writable flag
    if (desc) {
        desc.writable = !!writable;
        Object.defineProperty(target, prop, desc);
    }

    // make readonly if writable is being set to false
    else if (!writable) readonly(target, prop);
}

/**
 * Update the configuration for an object property, setting the getter.
 * @param {object|function} target
 * @param {string} prop
 * @param {function} getter
 */
function get(target, prop, getter) {
    target = normalTarget(target);

    var desc = describe(target, prop);
    
    // if property defined, update get in descriptor
    if (desc) desc.get = getter;

    // otherwise create new descriptor
    else desc = {
        configurable: true,
        enumerable: true,
        get: getter,
        set: undefined
    };

    // define property
    Object.defineProperty(target, prop, desc);
}

/**
 * Update the configuration for an object property, setting the setter.
 * @param {object|function} target
 * @param {string} prop
 * @param {function} setter
 */
function set(target, prop, setter) {
    target = normalTarget(target);

    var desc = describe(target, prop);
    
    // if property defined, update set in descriptor
    if (desc) desc.set = setter;

    // otherwise create new descriptor
    else desc = {
        configurable: true,
        enumerable: true,
        get: undefined,
        set: setter
    };

    // define property
    Object.defineProperty(target, prop, desc);
}

/**
 * Configure a validated property on an object which will ignore updates for
 * values which return a non-true value when passed to a validator function.
 * @param {object|function} target
 * @param {string} prop
 * @param {*} [val]
 * @param {function} validator
 */
function validated(target, prop, val, validator) {
    target = normalTarget(target);

    var desc = describe(target, prop) || {};
    
    if (arguments.length < 4) validator = val, val = target[prop];
    Object.defineProperty(target, prop, {
        configurable: true,
        enumerable: true,
        get: function() {
            return desc.get
                ? desc.get.call(this)
                : val;
        },
        set: function(newval) {
            if (validator.call(this, newval) === true) {
                val = newval;
                if (desc.set) desc.set.call(this, newval);
            }
        }
    });
}

/**
 * Configure a normalized property on an object which passes a value through a
 * normalizer function before updating.
 * @param {object|function} target
 * @param {string} prop
 * @param {*} [val]
 * @param {function} normalizer
 */
function normalized(target, prop, val, normalizer) {
    target = normalTarget(target);

    var desc = describe(target, prop) || {};
    
    if (arguments.length < 4) normalizer = val, val = target[prop];
    Object.defineProperty(target, prop, {
        configurable: true,
        enumerable: true,
        get: function() {
            return desc.get
                ? desc.get.call(this)
                : val;
        },
        set: function(newval) {
            if (desc.set) desc.set.call(this, normalizer.call(this, newval));
            else val = normalizer.call(this, newval);
        }
    });
}

/**
 * Configure a derived property on an object which is read-only and whose value
 * is calculated by a derive function every time it is accessed.
 * @param {object|function} target
 * @param {string} prop
 * @param {function} derive
 */
function derived(target, prop, derive) {
    target = normalTarget(target);
    Object.defineProperty(target, prop, {
        configurable: true,
        enumerable: false,
        get: derive,
        set: undefined
    });
}

/**
 * Configure a property on an object which has get/set handlers.
 * @param {object|function} target
 * @param {string} prop
 * @param {function} set
 * @param {function} get
 */
function managed(target, prop, set, get) {
    target = normalTarget(target);
    Object.defineProperty(target, prop, {
        configurable: true,
        enumerable: false,
        set: set,
        get: get
    });
}

/**
 * Configure a property on an object which triggers a callback when set.
 * @param {object|function} target
 * @param {string} prop
 * @param {function} change
 */
function triggered(target, prop, change) {
    target = normalTarget(target);

    var val = target[prop],
        desc = describe(target, prop) || {};
    
    Object.defineProperty(target, prop, {
        configurable: true,
        enumerable: false,
        set: function(newval) {
            var oldval = val;
            val = newval;
            if (desc.set) desc.set.call(this, newval);
            change.call(this, newval, oldval);
        },
        get: function() {
            return desc.get
                ? desc.get.call(this)
                : val;
        }
    });
}

/**
 * Return the current descriptor for an object property, which may be an own
 * descriptor or a prototype descriptor.
 * @param {object|function} target
 * @param {string} prop
 * @returns {object}
 */
function describe(target, prop) {
    var proto = target,
        desc;

    while (!(desc = Object.getOwnPropertyDescriptor(proto, prop))
            && ((proto = Object.getPrototypeOf(proto)) !== Object.prototype))
        ;

    return desc;
}

/** export propertize functions */
module.exports = {
    value: value,
    configurable: configurable,
    enumerable: enumerable,
    writable: writable,
    get: get,
    set: set,
    
    attribute: attribute,
    basic: basic,
    field: field,
    hidden: hidden,
    internal: internal,
    locked: locked,
    readonly: readonly,
    setting: setting,

    derived: derived,
    managed: managed,
    normalized: normalized,
    triggered: triggered,
    validated: validated,

    describe: describe
};

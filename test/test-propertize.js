var prop = require("..")
    expect = require("expect.js"),
    sinon = require("sinon");

describe("propertize", function() {
    function testAdd(fn) {
        return function() {
            var obj = {};
            prop[fn](obj, "a", 1);
            expect(obj.a).to.be(1);        
        };
    }
    
    function testUpdate(fn) {
        return function() {
            var obj = {a: 1};
            prop[fn](obj, "a", 2);
            expect(obj.a).to.be(2);
        };
    }
    
    function testNoConfig(fn) {
        return function() {
            var obj = {};
            prop[fn](obj, "a", 1);
            expect(delete obj.a).to.be(false);
        };
    }
    
    function testNoEnumerate(fn) {
        return function() {
            var obj = {},
                enumerated = false,
                name;
                
            prop[fn](obj, "a", 1);
            for (name in obj) if (name === "a") enumerated = true;
            expect(enumerated).to.be(false);
        };
    }
    
    function testNoWrite(fn) {
        return function() {
            var obj = {};

            prop[fn](obj, "a", 1);
            obj.a = 2;
            expect(obj.a).to.be(1);        
        };
    }

    function testFunctionTarget(fn) {
        return function() {
            var target = function() {};

            prop[fn](target, "a", 1);
            expect(target.a).to.be(undefined);
            expect(target.prototype.a).to.be(1);
        };
    }

    describe(".basic", function() {
        it("should add a new property", testAdd("basic"));
        
        it("should update an existing property", testUpdate("basic"));

        it("should update function prototype", testFunctionTarget("basic"));
    });

    describe(".field", function() {
        it("should add a new property", testAdd("field"));
        
        it("should update an existing property", testUpdate("field"));
        
        it("should prevent further configuration", testNoConfig("field"));

        it("should update function prototype", testFunctionTarget("field"));
    });
    
    describe(".hidden", function() {
        it("should add a new property", testAdd("hidden"));
        
        it("should update an existing property", testUpdate("hidden"));
        
        it("should prevent property enumeration", testNoEnumerate("hidden"));

        it("should update function prototype", testFunctionTarget("hidden"));
    });

    describe(".readonly", function() {
        it("should add a new property", testAdd("readonly"));
        
        it("should update an existing property", testUpdate("readonly"));
        
        it("should prevent writing to the property", testNoWrite("readonly"));

        it("should update function prototype", testFunctionTarget("readonly"));
    });

    describe(".internal", function()  {
        it("should add a new property", testAdd("internal"));
        
        it("should update an existing property", testUpdate("internal"));
        
        it("should prevent property enumeration", testNoEnumerate("internal"));
        
        it("should prevent writing to the property", testNoWrite("internal"));

        it("should update function prototype", testFunctionTarget("internal"));
    });

    describe(".attribute", function() {
        it("should add a new property", testAdd("attribute"));
        
        it("should update an existing property", testUpdate("attribute"));
        
        it("should prevent further configuration", testNoConfig("attribute"));
        
        it("should prevent writing to the property", testNoWrite("attribute"));

        it("should update function prototype", testFunctionTarget("attribute"));
    });
    
    describe(".setting", function() {
        it("should add a new property", testAdd("setting"));
        
        it("should update an existing property", testUpdate("setting"));
        
        it("should prevent further configuration", testNoConfig("setting"));
        
        it("should prevent property enumeration", testNoEnumerate("setting"));

        it("should update function prototype", testFunctionTarget("setting"));
    });
    
    describe(".locked", function() {
        it("should add a new property", testAdd("locked"));
        
        it("should update an existing property", testUpdate("locked"));
        
        it("should prevent further configuration", testNoConfig("locked"));
        
        it("should prevent property enumeration", testNoEnumerate("locked"));

        it("should prevent writing to the property", testNoWrite("locked"));

        it("should update function prototype", testFunctionTarget("locked"));
    });

    describe(".value", function() {
        it("should add a new property", testAdd("value"));
        
        it("should update an existing property", testUpdate("value"));

        it("should preserve descriptors while changing value", function() {
            var proto = {},
                o = Object.create(proto);

            prop.readonly(proto, "bar", 42);
            prop.readonly(o, "foo", 42);

            o.foo = 23;                 expect(o.foo).to.be(42); // rejected
            prop.value(o, "foo", 23);   expect(o.foo).to.be(23); // bypass
            o.foo = 42;                 expect(o.foo).to.be(23); // rejected

            o.bar = 23;                 expect(o.bar).to.be(42); // rejected
            prop.value(o, "bar", 23);   expect(o.bar).to.be(23); // bypass
            o.bar = 42;                 expect(o.bar).to.be(23); // rejected
        });

        it("should update function prototype", testFunctionTarget("value"));
    });    

    describe(".configurable", function() {
        it("should update existing property configurable flag", function() {
            var obj = {},
                desc;
            
            prop.derived(obj, "foo", function() {return 42;});
            desc = Object.getOwnPropertyDescriptor(obj, "foo");
            expect(desc.get).to.be.a("function");
            expect(desc.configurable).to.be(true);
            
            prop.configurable(obj, "foo", false);
            desc = Object.getOwnPropertyDescriptor(obj, "foo");
            expect(desc.get).to.be.a("function");
            expect(desc.configurable).to.be(false);
        });
    });

    describe(".enumerable", function() {
        it("should update existing property enumerable flag", function() {
            var obj = {},
                desc;
            
            prop.derived(obj, "foo", function() {return 42;});
            desc = Object.getOwnPropertyDescriptor(obj, "foo");
            expect(desc.get).to.be.a("function");
            expect(desc.enumerable).to.be(false);
            
            prop.enumerable(obj, "foo");
            desc = Object.getOwnPropertyDescriptor(obj, "foo");
            expect(desc.get).to.be.a("function");
            expect(desc.enumerable).to.be(true);
            
            prop.enumerable(obj, "foo", false);
            desc = Object.getOwnPropertyDescriptor(obj, "foo");
            expect(desc.get).to.be.a("function");
            expect(desc.enumerable).to.be(false);
            
            prop.enumerable(obj, "foo", true);
            desc = Object.getOwnPropertyDescriptor(obj, "foo");
            expect(desc.get).to.be.a("function");
            expect(desc.enumerable).to.be(true);
        });
    });

    describe(".writable", function() {
        it("should update existing property writable flag", function() {
            var obj = {foo: 42},
                desc;
            
            desc = Object.getOwnPropertyDescriptor(obj, "foo");
            expect(desc.writable).to.be(true);
            
            prop.writable(obj, "foo", false);
            desc = Object.getOwnPropertyDescriptor(obj, "foo");
            expect(desc.writable).to.be(false);            
        });
    });
    
    describe(".get", function() {
        it("should update getter", function() {
            var obj = {},
                val = 42;

            prop.managed(obj, "foo",
                function(newval) {val = newval;},
                function() {return val;}
            );
            expect(obj.foo).to.be(42);

            prop.get(obj, "foo", function() {return val*2;});
            expect(obj.foo).to.be(84);

            obj.foo = 23;
            expect(obj.foo).to.be(46);
        });
    });
    
    describe(".set", function() {
        it("should update setter", function() {
            var obj = {},
                val = 42;

            prop.managed(obj, "foo",
                function(newval) {val = newval;},
                function() {return val;}
            );
            expect(obj.foo).to.be(42);

            prop.set(obj, "foo", function(newval) {val = newval*2;});
            expect(obj.foo).to.be(42);

            obj.foo = 23;
            expect(obj.foo).to.be(46);
        });
    });

    describe(".validated", function() {
        it("should add a new property", function() {
            var obj = {};
            prop.validated(obj, "foo", "FOO", function(val) {return true;});
            expect(obj.foo).to.be("FOO");
        });
        
        it("should update an existing property", function() {
            var obj = {foo:1};
            prop.validated(obj, "foo", "FOO", function(val) {return true;});
            expect(obj.foo).to.be("FOO");
        });
        
        it("should ignore invalid updates to the property", function() {
            var obj = {};
            prop.validated(obj, "foo", function(val) {
                return typeof val === "number";
            });
            obj.foo = "FOO";
            expect(obj.val).to.be(undefined);
        });

        it("should execute validator with object context", function() {
            var obj = {foo: false};
            prop.validated(obj, "bar", false, function(val) {
                return this.foo === true;
            });

            obj.bar = 42;
            expect(obj.bar).to.be(false);
            obj.foo = true;
            obj.bar = 42;
            expect(obj.bar).to.be(42);
        });

        it("should work with getter/setter", function() {
            var obj = {},
                spy = sinon.spy();

            prop.set(obj, "foo", spy);
            expect(spy.callCount).to.be(0);

            obj.foo = 13;
            expect(spy.callCount).to.be(1);

            prop.validated(obj, "foo", function(val) {
                return typeof val === "number";
            });

            obj.foo = 23;
            expect(spy.callCount).to.be(2);

            obj.foo = "foo";
            expect(spy.callCount).to.be(2);
        });
    });
    
    describe(".normalized", function() {
        it("should add a new property", function() {
            var obj = {};
            prop.normalized(obj, "foo", "FOO", function(val) {return val;});
            expect(obj.foo).to.be("FOO");
        });
        
        it("should update an existing property", function() {
            var obj = {foo:1};
            prop.normalized(obj, "foo", "FOO", function(val) {return val;});
            expect(obj.foo).to.be("FOO");
        });
        
        it("should pass updates through normalizer", function() {
            var obj = {};
            prop.normalized(obj, "foo", function(val) {
                return val.toLowerCase();
            });
            obj.foo = "FOO";
            expect(obj.foo).to.be("foo");
        });

        it("should execute normalizer with object context", function() {
            var obj = {foo: "A"};
            prop.normalized(obj, "bar", function(val) {
                return this.foo + val;
            });

            obj.bar = "biff";
            expect(obj.bar).to.be("Abiff");
            obj.foo = "B";
            obj.bar = "biff";
            expect(obj.bar).to.be("Bbiff");
        });

        it("should work with getter/setter", function() {
            var obj = {},
                spy = sinon.spy();

            prop.set(obj, "foo", spy);
            expect(spy.callCount).to.be(0);

            prop.normalized(obj, "foo", function(val) {
                return Number(val);
            });

            obj.foo = "42";
            expect(spy.calledWith(42)).to.be(true);
        });
    });
    
    describe(".derived", function() {
        it("should add a new derived property", function() {
            var obj = {foo:1};
            prop.derived(obj, "bar", function() {return this.foo + 1;});
            expect(obj.bar).to.be(2);
        });
    });
    
    describe(".managed", function() {
        it("should add new property with getter/setter", function() {
            var obj = {},
                val = 0,
                called = false;
                
            prop.managed(
                obj, "foo",
                function(newval) {val = newval; called = true},
                function() {return val;}
            );
            
            obj.foo = "bar";
            expect(obj.foo).to.be("bar");
            expect(called).to.be(true);
        });
    });

    describe(".triggered", function() {
        it("should trigger callback when property is changed", function() {
            var obj = {foo: 42},
                called = false;

            prop.triggered(obj, "foo", function(is, was) {
                called = true;
                expect(this).to.be(obj);
                expect(is).to.be(43);
                expect(was).to.be(42);
            });

            obj.foo = 43;
            expect(obj.foo).to.be(43);
            expect(called).to.be(true);
        });

        it("should work with getter/setter", function() {
            var obj = {},
                setter = sinon.spy(),
                trigger = sinon.spy();

            prop.set(obj, "foo", setter);
            expect(setter.callCount).to.be(0);
            expect(trigger.callCount).to.be(0);

            obj.foo = 13;
            expect(setter.callCount).to.be(1);

            prop.triggered(obj, "foo", trigger);

            obj.foo = 23;
            expect(setter.callCount).to.be(2);
            expect(trigger.callCount).to.be(1);
        });
    });

    describe(".describe", function() {
        it("should return own property descriptor", function() {
            var obj = {foo:42},
                desc = prop.describe(obj, "foo");

            expect(desc.value).to.be(42);
            expect(desc.writable).to.be(true);
            expect(desc.configurable).to.be(true);
            expect(desc.enumerable).to.be(true);
        });

        it("should return inherited property descriptor", function() {
            var proto = {foo:42},
                obj = Object.create(proto),
                desc = prop.describe(obj, "foo"),
                ownDesc = Object.getOwnPropertyDescriptor(obj, "foo");

            expect(ownDesc).to.be(undefined);
            expect(desc).to.be.an("object");
            expect(desc.value).to.be(42);
            expect(desc.writable).to.be(true);
            expect(desc.configurable).to.be(true);
            expect(desc.enumerable).to.be(true);
        });
    });
});


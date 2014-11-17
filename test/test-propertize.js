var prop = require("..")
    expect = require("expect.js");

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

    describe(".field", function() {
        it("should add a new property", testAdd("field"));
        
        it("should update an existing property", testUpdate("field"));
        
        it("should prevent further configuration", testNoConfig("field"));
    });
    
    describe(".hidden", function() {
        it("should add a new property", testAdd("hidden"));
        
        it("should update an existing property", testUpdate("hidden"));
        
        it("should prevent property enumeration", testNoEnumerate("hidden"));
    });

    describe(".readonly", function() {
        it("should add a new property", testAdd("readonly"));
        
        it("should update an existing property", testUpdate("readonly"));
        
        it("should prevent writing to the property", testNoWrite("readonly"));
    });

    describe(".internal", function()  {
        it("should add a new property", testAdd("internal"));
        
        it("should update an existing property", testUpdate("internal"));
        
        it("should prevent property enumeration", testNoEnumerate("internal"));
        
        it("should prevent writing to the property", testNoWrite("internal"));
    });

    describe(".attribute", function() {
        it("should add a new property", testAdd("attribute"));
        
        it("should update an existing property", testUpdate("attribute"));
        
        it("should prevent further configuration", testNoConfig("attribute"));
        
        it("should prevent writing to the property", testNoWrite("attribute"));
    });
    
    describe(".setting", function() {
        it("should add a new property", testAdd("setting"));
        
        it("should update an existing property", testUpdate("setting"));
        
        it("should prevent further configuration", testNoConfig("setting"));
        
        it("should prevent property enumeration", testNoEnumerate("setting"));
    });
    
    describe(".locked", function() {
        it("should add a new property", testAdd("locked"));
        
        it("should update an existing property", testUpdate("locked"));
        
        it("should prevent further configuration", testNoConfig("locked"));
        
        it("should prevent property enumeration", testNoEnumerate("locked"));

        it("should prevent writing to the property", testNoWrite("locked"));
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
    });
});


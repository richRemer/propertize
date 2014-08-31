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
});


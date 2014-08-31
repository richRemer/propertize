var prop = require("..")
    expect = require("expect.js");

describe("propertize", function() {
    describe(".internal", function()  {
        it("should add internal object property", function() {
            var obj = {},
                hidden = true;

            prop.internal(obj, "a", 1);
            expect(obj.a).to.be(1);
            
            obj.a = 2;
            expect(obj.a).to.be(1);
            
            for (var name in obj) if (name === "a") hidden = false;
            expect(hidden).to.be.ok();
        });
    });

    describe(".readonly", function() {
        it("should add read-only object property", function() {
            var obj = {};

            prop.readonly(obj, "a", 1);
            expect(obj.a).to.be(1);

            obj.a = 2;
            expect(obj.a).to.be(1);
        });
    });
    
    describe(".calculated", function() {
        it("should add calculated object property", function() {
            var obj = {a: 1};
            
            prop.calculated(obj, "b", function() {return this.a+1;});
            expect(obj.b).to.be(2);
            
            obj.a = 3;
            expect(obj.b).to.be(4);
        });
    })
});


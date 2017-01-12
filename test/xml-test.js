var assert = require("assert");

var XmlParser = require("../src/utils/XMLParser")

describe("XML Parser", function () {

    describe("#parser", function () {
        it("should add two numbers together", function () {
            var result = XmlParser.parse("");
            console.log(result);
            assert.equal(3, 3);
        });
    });
});
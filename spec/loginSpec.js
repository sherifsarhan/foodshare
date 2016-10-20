/**
 * Created by Sherif on 10/19/2016.
 */
var blah = require('./helpers/blah');
describe("Hello world", function() {
    it("says hello", function() {
        console.log(blah.helloWorld);
        // expect(blah).toEqual("Hello world!");
    });
});
"use strict";

describe("starting tenant integration tests", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("loading product integration tests", (done) => {
        // GET
        require("./get/listTenants.test.js");
        require("./get/getTenant.test.js");

        // POST


        // PUT


        // DELETE


        done();
    });

});
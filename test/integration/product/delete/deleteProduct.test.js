"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let deleteProductSchema = require("../schemas/deleteProduct.js");

describe("Testing delete product API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    let prods = [];

    it("Success - will delete - code", (done) => {
        let params = {
            qs: {
                code: 'SOMEC'
            }
        };
        requester('/product', 'delete', params, (error, body) => {
            console.log("Something: ", JSON.stringify(body, null, 2));
            assert.ifError(error);
            assert.ok(body);
            let check = validator.validate(body, deleteProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will return all product records", (done) => {
        let params = {};
        requester('/products', 'get', params, (error, body) => {
            prods = body.data;
            done();
        });
    });

    it("Success - will delete - id", (done) => {

        let params = {
            qs: {
                id: prods[2]._id
            }
        };
        requester('/product', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data.ok, 1);
            let check = validator.validate(body, deleteProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fails - will not delete - prod not found", (done) => {
        let params = {
            qs: {
                id: "5512867be603d7e01ab1666d"
            },
            form: {
                name: "NOTANAME"
            }
        };
        requester('/product', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors);
            assert.deepEqual(body.errors.codes[0], 460);
            let check = validator.validate(body, deleteProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();

        });
    });

    it("Fail - will not delete - no params", (done) => {
        let params = {};
        requester('/product', 'delete', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, deleteProductSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});
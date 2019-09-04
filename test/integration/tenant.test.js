"use strict";
const assert = require('assert');
let request = require("request");

let extKey = '';

function requester(apiName, method, params, cb) {
    let options = {
        uri: 'http://127.0.0.1:4004' + apiName,
        headers: {
            key: extKey
        },
        method: method.toUpperCase(),
        json: true
    };

    if (params.headers) {
        for (let header in params.headers) {
            if (Object.hasOwnProperty.call(params.headers, header)) {
                options.headers[header] = params.headers[header];
            } else {
            }
        }
    }
    if (params.form) {
        options.form = params.form;
    }
    if (params.qs) {
        options.qs = params.qs;
    }
    if (method === 'delete') {
        request.del(options, function (error, response, body) {
            assert.ifError(error);
            assert.ok(body);
            return cb(null, body);
        });
    } else {
        request[method](options, function (error, response, body) {
            assert.ifError(error);
            assert.ok(body);
            return cb(null, body);
        });
    }
}

describe("starting Tenant integration tests", () => {

    before(function (done) {
       done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    describe("Testing list tenants API", () => {
        it("Success - will return all tenant records", (done) => {
            let params = {};
            requester('/tenants', 'get', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.data);
                assert.ok(body.data.length > 0);
                done();
            });
        });

        it("Fail - will not return all tenant records - wrong request", (done) => {
            let params = {};
            requester('/tenants', 'post', params, (error, body) => {
                assert.ifError(error);
                assert.ok(body);
                assert.ok(body.errors.codes);
                done();
            });
        });
    });

});
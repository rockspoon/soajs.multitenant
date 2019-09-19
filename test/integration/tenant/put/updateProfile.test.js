"use strict";
const assert = require('assert');
const requester = require('../../requester');

let core = require('soajs').core;
let validator = new core.validator.Validator();
let updateProfileSchema = require("../schemas/updateProfile.js");
let listTenantsSchema = require("../schemas/listTenants.js");
let getTenantSchema = require("../schemas/getTenant");

describe("Testing update tenant profile API", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    let tenants = [];
    let selectedTenant;

    it("Success - will return all tenant records - no input", (done) => {
        let params = {};
        requester('/tenants', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            tenants = body.data;
            body.data.forEach(tenant => {
                if (tenant.code === 'test') {
                    selectedTenant = tenant;
                }
            });
            assert.ok(body.data.length > 0);
            let check = validator.validate(body, listTenantsSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will update tenant profile - id", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id
            },
            body: {
                profile: {
                    "test": "profile"
                }
            }
        };
        requester('/tenant/profile', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data, 1);
            let check = validator.validate(body, updateProfileSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will return product record - id", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id
            }
        };
        requester('/tenant', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data.name, 'Test Tenant');
            assert.deepEqual(body.data.code, 'test');
            assert.deepEqual(body.data.description, 'this is a description for test tenant');
            assert.deepEqual(body.data.profile, {
                "test": "profile"
            });
            let check = validator.validate(body, getTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will update tenant profile - code", (done) => {
        let params = {
            qs: {
                code: 'test'
            },
            body: {
                profile: {
                    "test": "profile with code"
                }
            }
        };
        requester('/tenant/profile', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data, 1);
            let check = validator.validate(body, updateProfileSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Success - will return product record - id", (done) => {
        let params = {
            qs: {
                id: selectedTenant._id
            }
        };
        requester('/tenant', 'get', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.data);
            assert.deepEqual(body.data.name, 'Test Tenant');
            assert.deepEqual(body.data.code, 'test');
            assert.deepEqual(body.data.description, 'this is a description for test tenant');
            assert.deepEqual(body.data.profile, {
                "test": "profile with code"
            });
            let check = validator.validate(body, getTenantSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });

    it("Fail - will not return tenant record - no params", (done) => {
        let params = {};
        requester('/tenant/profile', 'put', params, (error, body) => {
            assert.ifError(error);
            assert.ok(body);
            assert.ok(body.errors.codes);
            let check = validator.validate(body, updateProfileSchema);
            assert.deepEqual(check.valid, true);
            assert.deepEqual(check.errors, []);
            done();
        });
    });
});
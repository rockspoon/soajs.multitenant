"use strict";

const helper = require("../../helper.js");
const BL = helper.requireModule('bl/index.js');


describe("Unit test for: BLs", () => {

    let soajs = {
        config: {
            "errors": {
                400: "Business logic required data are missing.",
                450: "Unable to find tenant",
                460: "Unable to find product.",
                461: "Unable to find packages.",
                466: "You are not allowed to remove the product you are currently logged in with.",
                467: "Package already exists",
                468: "Product already exists.",

                470: "Unable to update product.",

                500: "You cannot modify or delete a locked record.",

                601: "Model not found.",
                602: "Model error: ",
            },
        },
        log: {
            error: () => {
                console.log();
            },
            debug: () => {
                console.log();
            }
        },
        registry: {
            get: () => {
                return {
                    "coreDB": {
                        "provision": {
                            "name": "core_provision",
                            "prefix": "",
                            "servers": [
                                {
                                    "host": "127.0.0.1",
                                    "port": 27017
                                }
                            ],
                            "credentials": null,
                            "URLParam": {
                                "poolSize": 5,
                                "autoReconnect": true
                            }
                        }
                    }
                };
            }
        }
    };

    describe("Unit test index init", () => {
        it("Success - init", (done) => {
            BL.init(soajs, soajs.config, (err, records) => {
                done();
            });
        });
    });

});
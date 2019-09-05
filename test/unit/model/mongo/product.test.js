"use strict";

const helper = require("../../../helper.js");
const Product = helper.requireModule('model/mongo/product.js');
const assert = require('assert');

describe("Unit test for: Model - product", () => {
    let model;
    let service = {
        config: {
            "errors": {},
            "console": {
                "product": "DSBRD"
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
                    coreDB: {
                        provision: {
                            "name": "core_provision",
                            "prefix": '',
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

    describe("Testing product no instance", () => {
        before((done) => {
            model = new Product(service);
            done();
        });

        afterEach((done) => {
            done();
        });

        it("Success - validateId", (done) => {
            model.validateId({id: '5d6fedabbed68d11b6f54636'}, (err, id) => {
                assert.ok(id);
                done();
            });
        });

        it("Fails - validateId", (done) => {
            model.validateId({id: null}, (err, id) => {
                assert.ok(err);
                done();
            });
        });

        it("Fail - listProducts", (done) => {
            model.listProducts(null, (err, records) => {
                assert.ok(err);
                done();
            });
        });

        it("Success - listProducts", (done) => {
            model.listProducts(service.config.console, (err, records) => {
                assert.ok(records);
                done();
            });
        });

        it("Success - listConsoleProducts", (done) => {
            model.listConsoleProducts(service.config.console, (err, records) => {
                assert.ok(records);
                done();
            });
        });

        it("Fails - listConsoleProducts", (done) => {
            model.listConsoleProducts(null, (err, records) => {
                assert.ok(err);
                done();
            });
        });


        it("Fails - getProduct null", (done) => {
            model.getProduct(null, (err, recoord) => {
                assert.ok(err);
                done();
            });
        });

        it("Success - add Product", (done) => {
            model.addProduct({
                name: "SOMETHING2",
                code: "CODE2"
            }, (err, record) => {
                assert.ifError(err);
                assert.ok(record);
                done();
            });
        });

        it("Success - add Product", (done) => {
            model.addProduct({
                name: "SOMETHING4",
                code: "CODE4"
            }, (err, record) => {
                assert.ifError(err);
                assert.ok(record);
                done();
            });
        });

        it("Success - getProduct code", (done) => {
            model.getProduct({code: 'CODE2'}, (err, record) => {
                console.log(err, record);
                assert.ifError(err);
                assert.ok(record);
                done();
            });
        });

        it("Success - getProduct id", (done) => {
            let prods = [];
            model.listProducts(service.config.console, (err, records) => {
                prods = records;

                model.getProduct({id: prods[0]._id}, (err, record) => {
                    assert.ifError(err);
                    assert.ok(record);
                    done();
                });
            });
        });

        it('Success - update - id and name', (done) => {
            let prods = [];
            model.listProducts(service.config.console, (err, records) => {
                prods = records;
                console.log(prods);
                model.updateProduct({id: prods[1]._id, code: "Something", name: "Somesome"}, (err, record) => {
                    assert.ifError(err);
                    assert.ok(record);
                    done();
                });
            });
        });

        it('Fails - update - null data', (done) => {
            model.updateProduct(null, (err, record) => {
                assert.ok(err);
                done();
            });
        });

        it("Success - deleteProduct - id", (done) => {
            let prods = [];
            model.listProducts(service.config.console, (err, records) => {
                prods = records;
                model.deleteProduct({
                    id: prods[1]._id
                }, (err, record) => {
                    assert.ifError(err);
                    assert.ok(record);
                    done();
                });
            });
        });

        it("Success - deleteProduct - code", (done) => {
            let prods = [];
            model.listProducts(service.config.console, (err, records) => {
                prods = records;
                model.deleteProduct({
                    code: 'CODE4'
                }, (err, record) => {
                    assert.ifError(err);
                    assert.ok(record);
                    done();
                });
            });
        });

        it("Fails - deleteProduct - Null data", (done) => {
            model.deleteProduct(null, (err, record) => {
                assert.ok(err);
                done();
            });
        });

        //TODO fix indexes

        // it("Fails - add Product", (done) => {
        //     model.addProduct(null, (err, record) => {
        //         assert.ok(err);
        //         done();
        //     });
        // });

        it('Success - check if exist - code', (done) => {
            model.checkIfExist({code: 'TEST'}, (err, count) => {
                assert.ifError(err);
                assert.deepEqual(count, 0);
                done();
            });
        });

        it('Fail - check if exist - id', (done) => {
            model.checkIfExist(null, (err, count) => {
                assert.ok(err);
                done();
            });
        });


        //TODO fix indexes

        // it("Fails - getProduct empty", (done) => {
        // 	model.addProduct({}, (err, record) =>{
        // 	    console.log(err, record);
        // 		assert.ok(err);
        // 		done();
        // 	});
        // });

        it("Success - closeConnection", (done) => {
            model.closeConnection();
            done();
        });
    });

    describe("Testing product with db config", () => {
        before((done) => {
            model = new Product(service, {
                "name": "core_provision",
                "prefix": '',
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
            }, null);
            done();
        });

        afterEach((done) => {
            done();
        });

        it("Success - validateId", (done) => {
            model.validateId({id: '5d6fedabbed68d11b6f54636'}, (err, id) => {
                assert.ok(id);
                done();
            });
        });

        it("Fails - validateId", (done) => {
            model.validateId({id: null}, (err, id) => {
                assert.ok(err);
                done();
            });
        });

        it("Fail - listProducts", (done) => {
            model.listProducts(null, (err, records) => {
                assert.ok(err);
                done();
            });
        });

        it("Success - listProducts", (done) => {
            model.listProducts(service.config.console, (err, records) => {
                assert.ok(records);
                done();
            });
        });

        it("Success - listConsoleProducts", (done) => {
            model.listConsoleProducts(service.config.console, (err, records) => {
                assert.ok(records);
                done();
            });
        });

        it("Fails - listConsoleProducts", (done) => {
            model.listConsoleProducts(null, (err, records) => {
                assert.ok(err);
                done();
            });
        });

        it("Success - add Product", (done) => {
            model.addProduct({
                name: "SOMETHING3",
                code: "CODE3"
            }, (err, record) => {
                assert.ifError(err);
                assert.ok(record);
                done();
            });
        });

        it("Success - getProduct code", (done) => {
            model.getProduct({code: 'CODE3'}, (err, record) => {
                assert.ifError(err);
                assert.ok(record);
                done();
            });
        });

        it("Success - getProduct id", (done) => {
            let prods = [];
            model.listProducts(service.config.console, (err, records) => {
                prods = records;

                model.getProduct({id: prods[0]._id}, (err, record) => {
                    assert.ifError(err);
                    assert.ok(record);
                    done();
                });
            });
        });

        it("Fails - getProduct null", (done) => {
            model.getProduct(null, (err, recoord) => {
                assert.ok(err);
                done();
            });
        });

        //TODO fix indexes

        // it("Fails - add Product", (done) => {
        //     model.addProduct(null, (err, record) => {
        //         assert.ok(err);
        //         done();
        //     });
        // });


        it('Success - update - id and name', (done) => {
            let prods = [];
            model.listProducts(service.config.console, (err, records) => {
                prods = records;
                model.updateProduct({
                    id: prods[1]._id,
                    name: "NEW",
                    code: "UPDATE"
                }, (err, record) => {
                    assert.ifError(err);
                    assert.ok(record);
                    done();
                });
            });
        });

        it('Fails - update - null data', (done) => {
            model.updateProduct(null, (err, record) => {
                assert.ok(err);
                done();
            });
        });

        it("Success - deleteProduct id", (done) => {
            let prods = [];
            model.listProducts(service.config.console, (err, records) => {
                prods = records;

                model.deleteProduct({id: prods[1]._id}, (err, record) => {
                    assert.ifError(err);
                    assert.ok(record);
                    done();
                });
            });
        });

        it("Fails - deleteProduct id", (done) => {
            model.deleteProduct(null, (err, record) => {
                assert.ok(err);
                done();
            });
        });

        it('Success - check if exist - code', (done) => {
            model.checkIfExist({code: 'TEST'}, (err, count) => {
                assert.ifError(err);
                assert.deepEqual(count, 0);
                done();
            });
        });

        it('Success - check if exist - id', (done) => {
            model.checkIfExist({id: 'NOTFOUND'}, (err, count) => {
                assert.ifError(err);
                assert.deepEqual(count, 0);
                done();
            });
        });

        it('Fail - check if exist - id', (done) => {
            model.checkIfExist(null, (err, count) => {
                assert.ok(err);
                done();
            });
        });


        //TODO fix indexes

        // it("Fails - getProduct empty", (done) => {
        // 	model.addProduct({}, (err, record) =>{
        // 	    console.log(err, record);
        // 		assert.ok(err);
        // 		done();
        // 	});
        // });

        it("Success - closeConnection", (done) => {
            model.closeConnection();
            done();
        });
    });

    describe("Testing product with instance", () => {
        it("Success", (done) => {
            model = new Product(service, null, true);
            done();
        });
    });
});
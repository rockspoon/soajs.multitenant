"use strict";

const helper = require("../../helper.js");
const BL = helper.requireModule('bl/tenant.js');
const assert = require('assert');

describe("Unit test for: BL - tenant", () => {
	let soajs = {
		config: {
			"errors": {
				400: "Business logic required data are missing.",
				
				450: "Unable to find tenant",
				461: "Unable to find packages.",
				462: "You are not allowed to remove the tenant you are currently logged in with.",
				
				466: "You are not allowed to remove the product you are currently logged in with.",
				467: "Package already exists",
				468: "Product already exists.",
				
				470: "Unable to update product.",
				
				500: "You cannot modify or delete a locked record.",
				
				601: "Model not found.",
				602: "Model error: ",
			},
			"console": {
				"product": "DSBRD"
			},
		},
		tenant: {
			id: "5c0e74ba9acc3c5a84a51259",
			application: {
				product: "TPROD",
				package: "TPROD_TEST",
			}
		},
		log: {
			error: () => {
				console.log();
			}
		}
	};
	
	describe("Testing list tenants", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		it("Success - List tenants - empty object", (done) => {
			BL.modelObj = {
				listTenants: (nullObject, cb) => {
					return cb(null, []);
				}
			};
			BL.list(soajs, {}, (err, records) => {
				assert.ok(records);
				assert(Array.isArray(records));
				done();
			});
		});
		
		it("Fails - List tenants - null data", (done) => {
			BL.modelObj = {
				listTenants: (nullObject, cb) => {
					return cb(true, null);
				}
			};
			BL.list(soajs, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {code: 400, msg: soajs.config.errors[400]});
				done();
			});
		});
		
		it("Fails - List tenants - listTenants error", (done) => {
			BL.modelObj = {
				listTenants: (nullObject, cb) => {
					return cb(true, null);
				}
			};
			BL.list(soajs, {}, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("Success - List tenants - empty object - client tenant", (done) => {
			let soajsClient = {
				config: {},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.listTenants = (nullObject, cb) => {
				return cb(null, []);
			};
			Tenant.prototype.closeConnection = () => {
			};
			BL.model = Tenant;
			
			BL.list(soajsClient, {}, (err, records) => {
				assert.ok(records);
				assert(Array.isArray(records));
				done();
			});
		});
		
		it("Fails - List tenants - error - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing."
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			
			function Product() {
				console.log("Product");
			}
			
			Product.prototype.listTenants = (data, cb) => {
				return cb(true, null);
			};
			Product.prototype.closeConnection = () => {
			};
			BL.model = Product;
			BL.list(soajsClient, null, (err, records) => {
				assert.ok(err);
				assert.equal(records, null);
				assert.deepEqual(err, {code: 400, msg: soajsClient.config.errors[400]});
				done();
			});
		});
		
	});
	
	describe("Testing Get tenant", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		it("Success - Get tenant - code", (done) => {
			let inputMask = {
				code: "test"
			};
			
			BL.modelObj = {
				getTenant: (inputMask, cb) => {
					return cb(null, {
						"code": "test",
						"name": "Test Tenant",
						"description": "this is a description for test tenant",
					});
				}
			};
			BL.get(soajs, inputMask, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record.name, "Test Tenant");
				done();
			});
		});
		
		it("Success - Get tenant - id", (done) => {
			let inputMask = {
				id: "testid"
			};
			
			BL.modelObj = {
				getTenant: (inputMask, cb) => {
					return cb(null, {
						"_id": "testid",
						"name": "Test Tenant",
						"description": "this is a description for test tenant",
					});
				}
			};
			BL.get(soajs, inputMask, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record.name, "Test Tenant");
				done();
			});
		});
		
		it("Fails - Get tenant - null data", (done) => {
			BL.modelObj = {
				getTenant: (nullObject, cb) => {
					return cb(null, null);
				}
			};
			BL.get(soajs, null, (err, record) => {
				assert.ok(err);
				assert.equal(err.code, 400);
				done();
			});
		});
		
		it("Success - Get tenant - code - client tenant", (done) => {
			let soajsClient = {
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.getTenant = (data, cb) => {
				return cb(null, {
					"code": "test",
					"name": "Test Tenant",
					"description": "this is a description for test tenant",
				});
			};
			Tenant.prototype.closeConnection = () => {
			};
			BL.model = Tenant;
			
			let inputMask = {
				code: "test"
			};
			
			BL.get(soajsClient, inputMask, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record.name, "Test Tenant");
				done();
			});
		});
		
		it("Success - Get tenant - id - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing."
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.getTenant = (inputMask, cb) => {
				return cb(null, {
					"_id": "testid",
					"name": "Test Tenant",
					"description": "this is a description for test tenant",
				});
			};
			
			Tenant.prototype.closeConnection = () => {
			};
			BL.model = Tenant;
			
			let inputMask = {
				id: "testid"
			};
			
			BL.get(soajsClient, inputMask, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record.name, "Test Tenant");
				done();
			});
		});
		
		it("Fail - Get tenant - null data - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing."
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.getTenant = (data, cb) => {
				return cb(true, null);
			};
			Tenant.prototype.closeConnection = () => {
			};
			BL.model = Tenant;
			
			BL.get(soajsClient, null, (err, record) => {
				assert.ok(err);
				assert.deepEqual(err.code, 400);
				done();
			});
		});
		
		it("Fail - Get tenant - null record - client tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						450: "Unable to find tenant",
						601: "Model not found",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.getTenant = (data, cb) => {
				return cb(null, null);
			};
			Tenant.prototype.closeConnection = () => {
			};
			
			BL.model = Tenant;
			
			BL.get(soajsClient, {id: "notfound"}, (err, record) => {
				assert.ok(err);
				assert.deepEqual(err.code, 450);
				done();
			});
		});
		
		it("Fail - Get tenant - mongo error when getting Tenant", (done) => {
			let soajsClient = {
				config: {
					"errors": {
						450: "Unable to find tenant",
						601: "Model not found",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.getTenant = (data, cb) => {
				return cb(true, null);
			};
			Tenant.prototype.closeConnection = () => {
			};
			
			BL.model = Tenant;
			
			BL.get(soajsClient, {id: "found"}, (err, record) => {
				assert.deepEqual(err.code, 602);
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing Add tenant", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		it("Success - add tenant - only", (done) => {
			let inputMask = {
				"name": "tenant only name",
				"code": "twr2",
				"description": "3221",
				"type": "product",
				"profile": {},
				"tag": "tag"
			};
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing.",
						450: "Unable to find tenant",
						451: "Tenant already exists",
						452: "Main Tenant id is required!",
						453: "Main Tenant is not found!",
						454: "Unable to add tenant application",
						455: "Unable to add a new key to the tenant application",
						456: "Unable to add the tenant application ext Key",
						
						460: "Unable to find product",
						461: "Unable to find package",
						466: "You are not allowed to remove the product you are currently logged in with.",
						467: "Package already exists",
						468: "Product already exists.",
						
						470: "Unable to update product.",
						
						500: "You cannot modify or delete a locked record.",
						501: "Environment record not found!",
						
						601: "Model not found.",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.countTenants = (data, cb) => {
				return cb(null, 0);
			};
			Tenant.prototype.getTenant = (data, cb) => {
				return cb(null, {
					code: "mainTenant",
					_id: "1231231231"
				});
			};
			Tenant.prototype.listAllTenants = (data, cb) => {
				return cb(null, [{
					code: "mainTenant",
					_id: "1231231231"
				}]);
			};
			Tenant.prototype.closeConnection = () => {
			};
			Tenant.prototype.generateId = () => {
				return "idgenerated";
			};
			Tenant.prototype.addTenant = (data, cb) => {
				return cb(null, {
					"_id": "5d823afc89ace01605cd0e14",
					"type": "product",
					"code": "twr2",
					"name": "tenant only name",
					"description": "3221",
					"oauth": {
						"secret": "this is a secret",
						"redirectURI": "http://domain.com",
						"grants": [
							"password",
							"refresh_token"
						],
						"disabled": 1,
						"type": 2,
						"loginMode": "urac"
					}
				});
			};
			
			BL.model = Tenant;
			BL.localConfig = {
				"tenant": {
					"generatedCodeLength": 5,
					"character": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
					"expDateTTL": 86400000
				},
				"errors": {
					400: "Business logic required data are missing.",
					450: "Unable to find tenant",
					451: "Tenant already exists",
					452: "Main Tenant id is required!",
					453: "Main Tenant is not found!",
					454: "Unable to add tenant application",
					455: "Unable to add a new key to the tenant application",
					456: "Unable to add the tenant application ext Key",
					
					460: "Unable to find product",
					461: "Unable to find package",
					466: "You are not allowed to remove the product you are currently logged in with.",
					467: "Package already exists",
					468: "Product already exists.",
					
					470: "Unable to update product.",
					
					500: "You cannot modify or delete a locked record.",
					501: "Environment record not found!",
					
					601: "Model not found.",
					602: "Model error: "
				},
			};
			BL.add(soajsClient, inputMask, {}, (err, record) => {
				assert.ok(record);
				done();
			});
		});
		
		it("success - add tenant - with application no internal key", (done) => {
			let inputMask = {
				"name": "tenant only name",
				"code": "twr2",
				"description": "3221",
				"type": "client",
				"mainTenant": "1231231231",
				
				"application": {
					"productCode": "tyrv",
					"packageCode": "sdfw",
					"description": "123",
					"_TTL": "6"
				}
			};
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing.",
						450: "Unable to find tenant",
						451: "Tenant already exists",
						452: "Main Tenant id is required!",
						453: "Main Tenant is not found!",
						454: "Unable to add tenant application",
						455: "Unable to add a new key to the tenant application",
						456: "Unable to add the tenant application ext Key",
						
						460: "Unable to find product",
						461: "Unable to find package",
						466: "You are not allowed to remove the product you are currently logged in with.",
						467: "Package already exists",
						468: "Product already exists.",
						
						470: "Unable to update product.",
						
						500: "You cannot modify or delete a locked record.",
						501: "Environment record not found!",
						
						601: "Model not found.",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.countTenants = (data, cb) => {
				return cb(null, 0);
			};
			Tenant.prototype.getTenant = (data, cb) => {
				return cb(null, {
					code: "mainTenant",
					_id: "1231231231",
					"oauth": {
						"secret": "this is a secret test",
						"redirectURI": "http://domain.com",
						"grants": [
							"password",
							"refresh_token"
						],
						"disabled": 0,
						"type": 1,
						"loginMode": "ouath"
					},
				});
			};
			Tenant.prototype.listAllTenants = (data, cb) => {
				return cb(null, [{
					code: "mainTenant",
					_id: "1231231231"
				}]);
			};
			Tenant.prototype.closeConnection = () => {
			};
			Tenant.prototype.generateId = () => {
				return "idgenerated";
			};
			Tenant.prototype.addTenant = (data, cb) => {
				return cb(null, {
					"_id": "5d823afc89ace01605cd0e14",
					"type": "product",
					"code": "twr2",
					"name": "tenant only name",
					"description": "3221",
					"oauth": {
						"secret": "this is a secret",
						"redirectURI": "http://domain.com",
						"grants": [
							"password",
							"refresh_token"
						],
						"disabled": 1,
						"type": 2,
						"loginMode": "urac"
					}
				});
			};
			
			BL.model = Tenant;
			BL.localConfig = {
				"tenant": {
					"generatedCodeLength": 5,
					"character": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
					"expDateTTL": 86400000
				},
				"errors": {
					400: "Business logic required data are missing.",
					450: "Unable to find tenant",
					451: "Tenant already exists",
					452: "Main Tenant id is required!",
					453: "Main Tenant is not found!",
					454: "Unable to add tenant application",
					455: "Unable to add a new key to the tenant application",
					456: "Unable to add the tenant application ext Key",
					
					460: "Unable to find product",
					461: "Unable to find package",
					466: "You are not allowed to remove the product you are currently logged in with.",
					467: "Package already exists",
					468: "Product already exists.",
					
					470: "Unable to update product.",
					
					500: "You cannot modify or delete a locked record.",
					501: "Environment record not found!",
					
					601: "Model not found.",
					602: "Model error: "
				},
			};
			BL.add(soajsClient, inputMask, {}, (err, record) => {
				assert.ok(record);
				done();
			});
		});
		
		it("success - add tenant - with application with internal key", (done) => {
			let inputMask = {
				"name": "tenant only name",
				"code": "twr2",
				"description": "3221",
				"type": "client",
				"mainTenant": "1231231231",
				"oauth": {
					"secret": "this is a secret test",
					"redirectURI": "http://domain.com",
					"grants": [
						"password",
						"refresh_token"
					],
					"disabled": 0,
					"type": 1,
					"loginMode": "ouath"
				},
				"application": {
					"productCode": "tyrv",
					"packageCode": "sdfw",
					"description": "123",
					"_TTL": "6",
					"appKey": {}
				}
			};
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing.",
						450: "Unable to find tenant",
						451: "Tenant already exists",
						452: "Main Tenant id is required!",
						453: "Main Tenant is not found!",
						454: "Unable to add tenant application",
						455: "Unable to add a new key to the tenant application",
						456: "Unable to add the tenant application ext Key",
						
						460: "Unable to find product",
						461: "Unable to find package",
						466: "You are not allowed to remove the product you are currently logged in with.",
						467: "Package already exists",
						468: "Product already exists.",
						
						470: "Unable to update product.",
						
						500: "You cannot modify or delete a locked record.",
						501: "Environment record not found!",
						
						601: "Model not found.",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.countTenants = (data, cb) => {
				return cb(null, 0);
			};
			Tenant.prototype.getTenant = (data, cb) => {
				return cb(null, {
					code: "mainTenant",
					_id: "1231231231"
				});
			};
			Tenant.prototype.listAllTenants = (data, cb) => {
				return cb(null, [{
					code: "mainTenant",
					_id: "1231231231"
				}]);
			};
			Tenant.prototype.closeConnection = () => {
			};
			Tenant.prototype.generateId = () => {
				return "idgenerated";
			};
			Tenant.prototype.addTenant = (data, cb) => {
				return cb(null, {
					"_id": "5d823afc89ace01605cd0e14",
					"type": "product",
					"code": "twr2",
					"name": "tenant only name",
					"description": "3221",
					"oauth": {
						"secret": "this is a secret",
						"redirectURI": "http://domain.com",
						"grants": [
							"password",
							"refresh_token"
						],
						"disabled": 1,
						"type": 2,
						"loginMode": "urac"
					}
				});
			};
			
			BL.model = Tenant;
			BL.localConfig = {
				"tenant": {
					"generatedCodeLength": 5,
					"character": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
					"expDateTTL": 86400000
				},
				"errors": {
					400: "Business logic required data are missing.",
					450: "Unable to find tenant",
					451: "Tenant already exists",
					452: "Main Tenant id is required!",
					453: "Main Tenant is not found!",
					454: "Unable to add tenant application",
					455: "Unable to add a new key to the tenant application",
					456: "Unable to add the tenant application ext Key",
					
					460: "Unable to find product",
					461: "Unable to find package",
					466: "You are not allowed to remove the product you are currently logged in with.",
					467: "Package already exists",
					468: "Product already exists.",
					
					470: "Unable to update product.",
					
					500: "You cannot modify or delete a locked record.",
					501: "Environment record not found!",
					
					601: "Model not found.",
					602: "Model error: "
				},
			};
			let soajs = {
				core: {
					registry: {
						loadByEnv: (env, cb) => {
							return cb(null, {code: "KUBE"});
						}
					},
					key: {
						generateExternalKey: (key, opt, opt1, opt2, cb) => {
							return cb(null, "2313131312312");
						}
					}
				},
				provision: {
					generateInternalKey: (cb) => {
						return cb(null, "232423423423432");
					}
				}
			};
			BL.add(soajsClient, inputMask, soajs, (err, record) => {
				assert.ok(record);
				done();
			});
		});
		
		it("success - add tenant - with application with internal key and extkey", (done) => {
			let inputMask = {
				"name": "tenant only name",
				"description": "3221",
				"type": "client",
				"mainTenant": "1231231231",
				"oauth": {
					"secret": "this is a secret test",
					"redirectURI": "http://domain.com",
					"grants": [
						"password",
						"refresh_token"
					],
					"disabled": 0,
					"type": 1,
					"loginMode": "ouath"
				},
				"application": {
					"productCode": "tyrv",
					"packageCode": "sdfw",
					"description": "123",
					"_TTL": "6",
					"appKey": {
						"extKey": {
							"label": "ttestkeylabel",
							"env": "KUBE"
						}
					}
				}
			};
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing.",
						450: "Unable to find tenant",
						451: "Tenant already exists",
						452: "Main Tenant id is required!",
						453: "Main Tenant is not found!",
						454: "Unable to add tenant application",
						455: "Unable to add a new key to the tenant application",
						456: "Unable to add the tenant application ext Key",
						
						460: "Unable to find product",
						461: "Unable to find package",
						466: "You are not allowed to remove the product you are currently logged in with.",
						467: "Package already exists",
						468: "Product already exists.",
						
						470: "Unable to update product.",
						
						500: "You cannot modify or delete a locked record.",
						501: "Environment record not found!",
						
						601: "Model not found.",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.countTenants = (data, cb) => {
				return cb(null, 0);
			};
			Tenant.prototype.getTenant = (data, cb) => {
				return cb(null, {
					code: "mainTenant",
					_id: "1231231231"
				});
			};
			Tenant.prototype.listAllTenants = (data, cb) => {
				return cb(null, []);
			};
			Tenant.prototype.closeConnection = () => {
			};
			Tenant.prototype.generateId = () => {
				return "idgenerated";
			};
			Tenant.prototype.addTenant = (data, cb) => {
				return cb(null, {
					"_id": "5d823afc89ace01605cd0e14",
					"type": "product",
					"code": "twr2",
					"name": "tenant only name",
					"description": "3221",
					"oauth": {
						"secret": "this is a secret",
						"redirectURI": "http://domain.com",
						"grants": [
							"password",
							"refresh_token"
						],
						"disabled": 1,
						"type": 2,
						"loginMode": "urac"
					}
				});
			};
			
			BL.model = Tenant;
			BL.localConfig = {
				"tenant": {
					"generatedCodeLength": 5,
					"character": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
					"expDateTTL": 86400000
				},
				"errors": {
					400: "Business logic required data are missing.",
					450: "Unable to find tenant",
					451: "Tenant already exists",
					452: "Main Tenant id is required!",
					453: "Main Tenant is not found!",
					454: "Unable to add tenant application",
					455: "Unable to add a new key to the tenant application",
					456: "Unable to add the tenant application ext Key",
					
					460: "Unable to find product",
					461: "Unable to find package",
					466: "You are not allowed to remove the product you are currently logged in with.",
					467: "Package already exists",
					468: "Product already exists.",
					
					470: "Unable to update product.",
					
					500: "You cannot modify or delete a locked record.",
					501: "Environment record not found!",
					
					601: "Model not found.",
					602: "Model error: "
				},
			};
			let soajs = {
				core: {
					registry: {
						loadByEnv: (env, cb) => {
							return cb(null, {code: "KUBE", serviceConfig: {key: "test"}});
						}
					},
					key: {
						generateExternalKey: (key, opt, opt1, opt2, cb) => {
							return cb(null, "2313131312312");
						}
					}
				},
				provision: {
					generateInternalKey: (cb) => {
						return cb(null, "232423423423432");
					}
				}
			};
			BL.add(soajsClient, inputMask, soajs, (err, record) => {
				assert.ok(record);
				done();
			});
		});
		
		it("success - add tenant - with application with internal key and extkey with initial fail", (done) => {
			let inputMask = {
				"name": "tenant only name",
				"description": "3221",
				"type": "client",
				"mainTenant": "1231231231",
				"oauth": {
					"secret": "this is a secret test",
					"redirectURI": "http://domain.com",
					"grants": [
						"password",
						"refresh_token"
					],
					"disabled": 0,
					"type": 1,
					"loginMode": "ouath"
				},
				"application": {
					"productCode": "tyrv",
					"packageCode": "sdfw",
					"description": "123",
					"_TTL": "6",
					"appKey": {
						"extKey": {
							"label": "ttestkeylabel",
							"env": "KUBE"
						}
					}
				}
			};
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing.",
						450: "Unable to find tenant",
						451: "Tenant already exists",
						452: "Main Tenant id is required!",
						453: "Main Tenant is not found!",
						454: "Unable to add tenant application",
						455: "Unable to add a new key to the tenant application",
						456: "Unable to add the tenant application ext Key",
						
						460: "Unable to find product",
						461: "Unable to find package",
						466: "You are not allowed to remove the product you are currently logged in with.",
						467: "Package already exists",
						468: "Product already exists.",
						
						470: "Unable to update product.",
						
						500: "You cannot modify or delete a locked record.",
						501: "Environment record not found!",
						
						601: "Model not found.",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.countTenants = (data, cb) => {
				return cb(null, 0);
			};
			Tenant.prototype.getTenant = (data, cb) => {
				return cb(null, {
					code: "mainTenant",
					_id: "1231231231"
				});
				
			};
			Tenant.prototype.listAllTenants = (data, cb) => {
				return cb(null, [{
					code: "mainTenant",
					_id: "1231231231"
				}]);
			};
			Tenant.prototype.closeConnection = () => {
			};
			Tenant.prototype.generateId = () => {
				return "idgenerated";
			};
			let fail = true;
			Tenant.prototype.addTenant = (data, cb) => {
				if (fail) {
					fail = false;
					return cb({message: "MongoDB Error: E11000 duplicate key error collection: local_core_provision.tenants index: code_1 dup key: { : \"twr2\" }"});
				} else {
					return cb(null, {
						"_id": "5d823afc89ace01605cd0e14",
						"type": "product",
						"code": "random",
						"name": "tenant only name",
						"description": "3221",
						"oauth": {
							"secret": "this is a secret",
							"redirectURI": "http://domain.com",
							"grants": [
								"password",
								"refresh_token"
							],
							"disabled": 1,
							"type": 2,
							"loginMode": "urac"
						}
					});
				}
			};
			
			BL.model = Tenant;
			BL.localConfig = {
				"tenant": {
					"generatedCodeLength": 5,
					"character": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
					"expDateTTL": 86400000
				},
				"errors": {
					400: "Business logic required data are missing.",
					450: "Unable to find tenant",
					451: "Tenant already exists",
					452: "Main Tenant id is required!",
					453: "Main Tenant is not found!",
					454: "Unable to add tenant application",
					455: "Unable to add a new key to the tenant application",
					456: "Unable to add the tenant application ext Key",
					
					460: "Unable to find product",
					461: "Unable to find package",
					466: "You are not allowed to remove the product you are currently logged in with.",
					467: "Package already exists",
					468: "Product already exists.",
					
					470: "Unable to update product.",
					
					500: "You cannot modify or delete a locked record.",
					501: "Environment record not found!",
					
					601: "Model not found.",
					602: "Model error: "
				},
			};
			let soajs = {
				core: {
					registry: {
						loadByEnv: (env, cb) => {
							return cb(null, {code: "KUBE", serviceConfig: {key: "test"}});
						}
					},
					key: {
						generateExternalKey: (key, opt, opt1, opt2, cb) => {
							return cb(null, "2313131312312");
						}
					}
				},
				provision: {
					generateInternalKey: (cb) => {
						return cb(null, "232423423423432");
					}
				}
			};
			BL.add(soajsClient, inputMask, soajs, (err, record) => {
				assert.ok(record);
				done();
			});
		});
		
		it("Fails - add tenant - empty data", (done) => {
			BL.modelObj = {};
			
			BL.add(soajs, null, {}, (err, record) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Fails - add tenant - tenant check error", (done) => {
			BL.modelObj = {};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.generateId = () => {
				return "idgenerated";
			};
			Tenant.prototype.countTenants = (data, cb) => {
				return cb(true, 0);
			};
			
			let inputMask = {
				"name": "tenant only name",
				"description": "3221",
				"type": "client",
				"mainTenant": "1231231231",
				"oauth": {
					"secret": "this is a secret test",
					"redirectURI": "http://domain.com",
					"grants": [
						"password",
						"refresh_token"
					],
					"disabled": 0,
					"type": 1,
					"loginMode": "ouath"
				},
				"application": {
					"productCode": "tyrv",
					"packageCode": "sdfw",
					"description": "123",
					"_TTL": "6",
					"appKey": {
						"extKey": {
							"label": "ttestkeylabel",
							"env": "KUBE"
						}
					}
				}
			};
			Tenant.prototype.closeConnection = () => {
			};
			BL.model = Tenant;
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing.",
						450: "Unable to find tenant",
						451: "Tenant already exists",
						452: "Main Tenant id is required!",
						453: "Main Tenant is not found!",
						454: "Unable to add tenant application",
						455: "Unable to add a new key to the tenant application",
						456: "Unable to add the tenant application ext Key",
						
						460: "Unable to find product",
						461: "Unable to find package",
						466: "You are not allowed to remove the product you are currently logged in with.",
						467: "Package already exists",
						468: "Product already exists.",
						
						470: "Unable to update product.",
						
						500: "You cannot modify or delete a locked record.",
						501: "Environment record not found!",
						
						601: "Model not found.",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			BL.add(soajsClient, inputMask, {}, (err, record) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Fails - add tenant - tenant already exist ", (done) => {
			BL.modelObj = {};
			let inputMask = {
				"name": "tenant only name",
				"description": "3221",
				"type": "client",
				"mainTenant": "1231231231",
				"oauth": {
					"secret": "this is a secret test",
					"redirectURI": "http://domain.com",
					"grants": [
						"password",
						"refresh_token"
					],
					"disabled": 0,
					"type": 1,
					"loginMode": "ouath"
				},
				"application": {
					"productCode": "tyrv",
					"packageCode": "sdfw",
					"description": "123",
					"_TTL": "6",
					"appKey": {
						"extKey": {
							"label": "ttestkeylabel",
							"env": "KUBE"
						}
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.closeConnection = () => {
			};
			Tenant.prototype.generateId = () => {
				return "idgenerated";
			};
			Tenant.prototype.countTenants = (data, cb) => {
				return cb(null, 1);
			};
			BL.model = Tenant;
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing.",
						450: "Unable to find tenant",
						451: "Tenant already exists",
						452: "Main Tenant id is required!",
						453: "Main Tenant is not found!",
						454: "Unable to add tenant application",
						455: "Unable to add a new key to the tenant application",
						456: "Unable to add the tenant application ext Key",
						
						460: "Unable to find product",
						461: "Unable to find package",
						466: "You are not allowed to remove the product you are currently logged in with.",
						467: "Package already exists",
						468: "Product already exists.",
						
						470: "Unable to update product.",
						
						500: "You cannot modify or delete a locked record.",
						501: "Environment record not found!",
						
						601: "Model not found.",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			BL.add(soajsClient, inputMask, {}, (err, record) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Fails - add tenant - tenant type client no main tenant ", (done) => {
			BL.modelObj = {};
			let inputMask = {
				"name": "tenant only name",
				"description": "3221",
				"type": "client",
				"oauth": {
					"secret": "this is a secret test",
					"redirectURI": "http://domain.com",
					"grants": [
						"password",
						"refresh_token"
					],
					"disabled": 0,
					"type": 1,
					"loginMode": "ouath"
				},
				"application": {
					"productCode": "tyrv",
					"packageCode": "sdfw",
					"description": "123",
					"_TTL": "6",
					"appKey": {
						"extKey": {
							"label": "ttestkeylabel",
							"env": "KUBE"
						}
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.closeConnection = () => {
			};
			Tenant.prototype.generateId = () => {
				return "idgenerated";
			};
			Tenant.prototype.countTenants = (data, cb) => {
				return cb(null, 0);
			};
			BL.model = Tenant;
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing.",
						450: "Unable to find tenant",
						451: "Tenant already exists",
						452: "Main Tenant id is required!",
						453: "Main Tenant is not found!",
						454: "Unable to add tenant application",
						455: "Unable to add a new key to the tenant application",
						456: "Unable to add the tenant application ext Key",
						
						460: "Unable to find product",
						461: "Unable to find package",
						466: "You are not allowed to remove the product you are currently logged in with.",
						467: "Package already exists",
						468: "Product already exists.",
						
						470: "Unable to update product.",
						
						500: "You cannot modify or delete a locked record.",
						501: "Environment record not found!",
						
						601: "Model not found.",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			BL.add(soajsClient, inputMask, {}, (err, record) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Fails - add tenant - error getting tenant", (done) => {
			BL.modelObj = {};
			let inputMask = {
				"name": "tenant only name",
				"description": "3221",
				"type": "client",
				"mainTenant": "12313",
				"oauth": {
					"secret": "this is a secret test",
					"redirectURI": "http://domain.com",
					"grants": [
						"password",
						"refresh_token"
					],
					"disabled": 0,
					"type": 1,
					"loginMode": "ouath"
				},
				"application": {
					"productCode": "tyrv",
					"packageCode": "sdfw",
					"description": "123",
					"_TTL": "6",
					"appKey": {
						"extKey": {
							"label": "ttestkeylabel",
							"env": "KUBE"
						}
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.closeConnection = () => {
			};
			Tenant.prototype.generateId = () => {
				return "idgenerated";
			};
			Tenant.prototype.countTenants = (data, cb) => {
				return cb(null, 0);
			};
			Tenant.prototype.getTenant = (data, cb) => {
				return cb(true, 0);
			};
			BL.model = Tenant;
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing.",
						450: "Unable to find tenant",
						451: "Tenant already exists",
						452: "Main Tenant id is required!",
						453: "Main Tenant is not found!",
						454: "Unable to add tenant application",
						455: "Unable to add a new key to the tenant application",
						456: "Unable to add the tenant application ext Key",
						
						460: "Unable to find product",
						461: "Unable to find package",
						466: "You are not allowed to remove the product you are currently logged in with.",
						467: "Package already exists",
						468: "Product already exists.",
						
						470: "Unable to update product.",
						
						500: "You cannot modify or delete a locked record.",
						501: "Environment record not found!",
						
						601: "Model not found.",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			BL.add(soajsClient, inputMask, {}, (err, record) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Fails - add tenant - malformed getting tenant ", (done) => {
			BL.modelObj = {};
			let inputMask = {
				"name": "tenant only name",
				"description": "3221",
				"type": "client",
				"mainTenant": "12313",
				"oauth": {
					"secret": "this is a secret test",
					"redirectURI": "http://domain.com",
					"grants": [
						"password",
						"refresh_token"
					],
					"disabled": 0,
					"type": 1,
					"loginMode": "ouath"
				},
				"application": {
					"productCode": "tyrv",
					"packageCode": "sdfw",
					"description": "123",
					"_TTL": "6",
					"appKey": {
						"extKey": {
							"label": "ttestkeylabel",
							"env": "KUBE"
						}
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.closeConnection = () => {
			};
			Tenant.prototype.generateId = () => {
				return "idgenerated";
			};
			Tenant.prototype.countTenants = (data, cb) => {
				return cb(null, 0);
			};
			Tenant.prototype.getTenant = (data, cb) => {
				return cb(null, {});
			};
			BL.model = Tenant;
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing.",
						450: "Unable to find tenant",
						451: "Tenant already exists",
						452: "Main Tenant id is required!",
						453: "Main Tenant is not found!",
						454: "Unable to add tenant application",
						455: "Unable to add a new key to the tenant application",
						456: "Unable to add the tenant application ext Key",
						
						460: "Unable to find product",
						461: "Unable to find package",
						466: "You are not allowed to remove the product you are currently logged in with.",
						467: "Package already exists",
						468: "Product already exists.",
						
						470: "Unable to update product.",
						
						500: "You cannot modify or delete a locked record.",
						501: "Environment record not found!",
						
						601: "Model not found.",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			BL.add(soajsClient, inputMask, {}, (err, record) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Fails - add tenant - no code and failed listing tenants ", (done) => {
			BL.modelObj = {};
			let inputMask = {
				"name": "tenant only name",
				"description": "3221",
				"type": "client",
				"mainTenant": "12313",
				"oauth": {
					"secret": "this is a secret test",
					"redirectURI": "http://domain.com",
					"grants": [
						"password",
						"refresh_token"
					],
					"disabled": 0,
					"type": 1,
					"loginMode": "ouath"
				},
				"application": {
					"productCode": "tyrv",
					"packageCode": "sdfw",
					"description": "123",
					"_TTL": "6",
					"appKey": {
						"extKey": {
							"label": "ttestkeylabel",
							"env": "KUBE"
						}
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.closeConnection = () => {
			};
			Tenant.prototype.generateId = () => {
				return "idgenerated";
			};
			Tenant.prototype.countTenants = (data, cb) => {
				return cb(null, 0);
			};
			Tenant.prototype.getTenant = (data, cb) => {
				return cb(null, {
					code: "mainTenant",
					_id: "1231231231"
				});
			};
			Tenant.prototype.listAllTenants = (data, cb) => {
				return cb(true, [{
					code: "mainTenant",
					_id: "1231231231"
				}]);
			};
			BL.model = Tenant;
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing.",
						450: "Unable to find tenant",
						451: "Tenant already exists",
						452: "Main Tenant id is required!",
						453: "Main Tenant is not found!",
						454: "Unable to add tenant application",
						455: "Unable to add a new key to the tenant application",
						456: "Unable to add the tenant application ext Key",
						
						460: "Unable to find product",
						461: "Unable to find package",
						466: "You are not allowed to remove the product you are currently logged in with.",
						467: "Package already exists",
						468: "Product already exists.",
						
						470: "Unable to update product.",
						
						500: "You cannot modify or delete a locked record.",
						501: "Environment record not found!",
						
						601: "Model not found.",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			let soajs = {
				core: {
					registry: {
						loadByEnv: (env, cb) => {
							return cb(null, {code: "KUBE", serviceConfig: {key: "test"}});
						}
					},
					key: {
						generateExternalKey: (key, opt, opt1, opt2, cb) => {
							return cb(null, "2313131312312");
						}
					}
				},
				provision: {
					generateInternalKey: (cb) => {
						return cb(null, "232423423423432");
					}
				}
			};
			BL.add(soajsClient, inputMask, soajs, (err, record) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Fails - add tenant - err when creating app key ", (done) => {
			BL.modelObj = {};
			let inputMask = {
				"name": "tenant only name",
				"description": "3221",
				"type": "client",
				"mainTenant": "12313",
				"oauth": {
					"secret": "this is a secret test",
					"redirectURI": "http://domain.com",
					"grants": [
						"password",
						"refresh_token"
					],
					"disabled": 0,
					"type": 1,
					"loginMode": "ouath"
				},
				"application": {
					"productCode": "tyrv",
					"packageCode": "sdfw",
					"description": "123",
					"_TTL": "6",
					"appKey": {
						"extKey": {
							"label": "ttestkeylabel",
							"env": "KUBE"
						}
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.closeConnection = () => {
			};
			Tenant.prototype.generateId = () => {
				return "idgenerated";
			};
			Tenant.prototype.countTenants = (data, cb) => {
				return cb(null, 0);
			};
			Tenant.prototype.getTenant = (data, cb) => {
				return cb(null, {
					code: "mainTenant",
					_id: "1231231231"
				});
			};
			Tenant.prototype.listAllTenants = (data, cb) => {
				return cb(null, [{
					code: "mainTenant",
					_id: "1231231231"
				}]);
			};
			BL.model = Tenant;
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing.",
						450: "Unable to find tenant",
						451: "Tenant already exists",
						452: "Main Tenant id is required!",
						453: "Main Tenant is not found!",
						454: "Unable to add tenant application",
						455: "Unable to add a new key to the tenant application",
						456: "Unable to add the tenant application ext Key",
						
						460: "Unable to find product",
						461: "Unable to find package",
						466: "You are not allowed to remove the product you are currently logged in with.",
						467: "Package already exists",
						468: "Product already exists.",
						
						470: "Unable to update product.",
						
						500: "You cannot modify or delete a locked record.",
						501: "Environment record not found!",
						
						601: "Model not found.",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			let soajs = {
				core: {
					registry: {
						loadByEnv: (env, cb) => {
							return cb(null, {code: "KUBE", serviceConfig: {key: "test"}});
						}
					},
					key: {
						generateExternalKey: (key, opt, opt1, opt2, cb) => {
							return cb(null, "2313131312312");
						}
					}
				},
				provision: {
					generateInternalKey: (cb) => {
						return cb(true, "232423423423432");
					}
				}
			};
			BL.add(soajsClient, inputMask, soajs, (err, record) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Fails - add tenant - err when creating ext key ", (done) => {
			BL.modelObj = {};
			let inputMask = {
				"name": "tenant only name",
				"description": "3221",
				"type": "client",
				"mainTenant": "12313",
				"oauth": {
					"secret": "this is a secret test",
					"redirectURI": "http://domain.com",
					"grants": [
						"password",
						"refresh_token"
					],
					"disabled": 0,
					"type": 1,
					"loginMode": "ouath"
				},
				"application": {
					"productCode": "tyrv",
					"packageCode": "sdfw",
					"description": "123",
					"_TTL": "6",
					"appKey": {
						"extKey": {
							"label": "ttestkeylabel",
							"env": "KUBE"
						}
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.closeConnection = () => {
			};
			Tenant.prototype.generateId = () => {
				return "idgenerated";
			};
			Tenant.prototype.countTenants = (data, cb) => {
				return cb(null, 0);
			};
			Tenant.prototype.getTenant = (data, cb) => {
				return cb(null, {
					code: "mainTenant",
					_id: "1231231231"
				});
			};
			Tenant.prototype.listAllTenants = (data, cb) => {
				return cb(null, [{
					code: "mainTenant",
					_id: "1231231231"
				}]);
			};
			BL.model = Tenant;
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing.",
						450: "Unable to find tenant",
						451: "Tenant already exists",
						452: "Main Tenant id is required!",
						453: "Main Tenant is not found!",
						454: "Unable to add tenant application",
						455: "Unable to add a new key to the tenant application",
						456: "Unable to add the tenant application ext Key",
						
						460: "Unable to find product",
						461: "Unable to find package",
						466: "You are not allowed to remove the product you are currently logged in with.",
						467: "Package already exists",
						468: "Product already exists.",
						
						470: "Unable to update product.",
						
						500: "You cannot modify or delete a locked record.",
						501: "Environment record not found!",
						
						601: "Model not found.",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			let soajs = {
				core: {
					registry: {
						loadByEnv: (env, cb) => {
							return cb(null, {code: "KUBE", serviceConfig: {key: "test"}});
						}
					},
					key: {
						generateExternalKey: (key, opt, opt1, opt2, cb) => {
							return cb(true, "2313131312312");
						}
					}
				},
				provision: {
					generateInternalKey: (cb) => {
						return cb(null, "232423423423432");
					}
				}
			};
			BL.add(soajsClient, inputMask, soajs, (err, record) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Fails - add tenant - err when getting environment ", (done) => {
			BL.modelObj = {};
			let inputMask = {
				"name": "tenant only name",
				"description": "3221",
				"type": "client",
				"mainTenant": "12313",
				"oauth": {
					"secret": "this is a secret test",
					"redirectURI": "http://domain.com",
					"grants": [
						"password",
						"refresh_token"
					],
					"disabled": 0,
					"type": 1,
					"loginMode": "ouath"
				},
				"application": {
					"productCode": "tyrv",
					"packageCode": "sdfw",
					"description": "123",
					"_TTL": "6",
					"appKey": {
						"extKey": {
							"label": "ttestkeylabel",
							"env": "KUBE"
						}
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.closeConnection = () => {
			};
			Tenant.prototype.generateId = () => {
				return "idgenerated";
			};
			Tenant.prototype.countTenants = (data, cb) => {
				return cb(null, 0);
			};
			Tenant.prototype.getTenant = (data, cb) => {
				return cb(null, {
					code: "mainTenant",
					_id: "1231231231"
				});
			};
			Tenant.prototype.listAllTenants = (data, cb) => {
				return cb(null, [{
					code: "mainTenant",
					_id: "1231231231"
				}]);
			};
			BL.model = Tenant;
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing.",
						450: "Unable to find tenant",
						451: "Tenant already exists",
						452: "Main Tenant id is required!",
						453: "Main Tenant is not found!",
						454: "Unable to add tenant application",
						455: "Unable to add a new key to the tenant application",
						456: "Unable to add the tenant application ext Key",
						
						460: "Unable to find product",
						461: "Unable to find package",
						466: "You are not allowed to remove the product you are currently logged in with.",
						467: "Package already exists",
						468: "Product already exists.",
						
						470: "Unable to update product.",
						
						500: "You cannot modify or delete a locked record.",
						501: "Environment record not found!",
						
						601: "Model not found.",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			let soajs = {
				core: {
					registry: {
						loadByEnv: (env, cb) => {
							return cb(true, {code: "KUBE", serviceConfig: {key: "test"}});
						}
					},
					key: {
						generateExternalKey: (key, opt, opt1, opt2, cb) => {
							return cb(null, "2313131312312");
						}
					}
				},
				provision: {
					generateInternalKey: (cb) => {
						return cb(null, "232423423423432");
					}
				}
			};
			BL.add(soajsClient, inputMask, soajs, (err, record) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Fails - add tenant - err no environment", (done) => {
			BL.modelObj = {};
			let inputMask = {
				"name": "tenant only name",
				"description": "3221",
				"type": "client",
				"mainTenant": "12313",
				"oauth": {
					"secret": "this is a secret test",
					"redirectURI": "http://domain.com",
					"grants": [
						"password",
						"refresh_token"
					],
					"disabled": 0,
					"type": 1,
					"loginMode": "ouath"
				},
				"application": {
					"productCode": "tyrv",
					"packageCode": "sdfw",
					"description": "123",
					"_TTL": "6",
					"appKey": {
						"extKey": {
							"label": "ttestkeylabel",
							"env": "KUBE"
						}
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.closeConnection = () => {
			};
			Tenant.prototype.generateId = () => {
				return "idgenerated";
			};
			Tenant.prototype.countTenants = (data, cb) => {
				return cb(null, 0);
			};
			Tenant.prototype.getTenant = (data, cb) => {
				return cb(null, {
					code: "mainTenant",
					_id: "1231231231"
				});
			};
			Tenant.prototype.listAllTenants = (data, cb) => {
				return cb(null, [{
					code: "mainTenant",
					_id: "1231231231"
				}]);
			};
			BL.model = Tenant;
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing.",
						450: "Unable to find tenant",
						451: "Tenant already exists",
						452: "Main Tenant id is required!",
						453: "Main Tenant is not found!",
						454: "Unable to add tenant application",
						455: "Unable to add a new key to the tenant application",
						456: "Unable to add the tenant application ext Key",
						
						460: "Unable to find product",
						461: "Unable to find package",
						466: "You are not allowed to remove the product you are currently logged in with.",
						467: "Package already exists",
						468: "Product already exists.",
						
						470: "Unable to update product.",
						
						500: "You cannot modify or delete a locked record.",
						501: "Environment record not found!",
						
						601: "Model not found.",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			let soajs = {
				core: {
					registry: {
						loadByEnv: (env, cb) => {
							return cb(null, null);
						}
					},
					key: {
						generateExternalKey: (key, opt, opt1, opt2, cb) => {
							return cb(null, "2313131312312");
						}
					}
				},
				provision: {
					generateInternalKey: (cb) => {
						return cb(null, "232423423423432");
					}
				}
			};
			BL.add(soajsClient, inputMask, soajs, (err, record) => {
				assert.ok(err);
				done();
			});
		});
		
		it("fail - add tenant - with application with internal key and extkey with fail", (done) => {
			let inputMask = {
				"name": "tenant only name",
				"description": "3221",
				"type": "client",
				"mainTenant": "1231231231",
				"oauth": {
					"secret": "this is a secret test",
					"redirectURI": "http://domain.com",
					"grants": [
						"password",
						"refresh_token"
					],
					"disabled": 0,
					"type": 1,
					"loginMode": "ouath"
				},
				"application": {
					"productCode": "tyrv",
					"packageCode": "sdfw",
					"description": "123",
					"_TTL": "6",
					"appKey": {
						"extKey": {
							"label": "ttestkeylabel",
							"env": "KUBE"
						}
					}
				}
			};
			let soajsClient = {
				config: {
					"errors": {
						400: "Business logic required data are missing.",
						450: "Unable to find tenant",
						451: "Tenant already exists",
						452: "Main Tenant id is required!",
						453: "Main Tenant is not found!",
						454: "Unable to add tenant application",
						455: "Unable to add a new key to the tenant application",
						456: "Unable to add the tenant application ext Key",
						
						460: "Unable to find product",
						461: "Unable to find package",
						466: "You are not allowed to remove the product you are currently logged in with.",
						467: "Package already exists",
						468: "Product already exists.",
						
						470: "Unable to update product.",
						
						500: "You cannot modify or delete a locked record.",
						501: "Environment record not found!",
						
						601: "Model not found.",
						602: "Model error: "
					},
				},
				tenant: {
					type: "client",
					dbConfig: {}
				},
				log: {
					error: () => {
						console.log();
					}
				}
			};
			
			function Tenant() {
				console.log("Tenant");
			}
			
			Tenant.prototype.countTenants = (data, cb) => {
				return cb(null, 0);
			};
			Tenant.prototype.getTenant = (data, cb) => {
				return cb(null, {
					code: "mainTenant",
					_id: "1231231231"
				});
				
			};
			Tenant.prototype.listAllTenants = (data, cb) => {
				return cb(null, [{
					code: "mainTenant",
					_id: "1231231231"
				}]);
			};
			Tenant.prototype.closeConnection = () => {
			};
			Tenant.prototype.generateId = () => {
				return "idgenerated";
			};
			let fail = true;
			Tenant.prototype.addTenant = (data, cb) => {
				if (fail) {
					fail = false;
					return cb({message: "MongoDB Error: E11000 duplicate key error collection: local_core_provision.tenants index: code_1 dup key: { : \"twr2\" }"});
				} else {
					return cb(true, null);
				}
			};
			
			BL.model = Tenant;
			BL.localConfig = {
				"tenant": {
					"generatedCodeLength": 5,
					"character": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
					"expDateTTL": 86400000
				},
				"errors": {
					400: "Business logic required data are missing.",
					450: "Unable to find tenant",
					451: "Tenant already exists",
					452: "Main Tenant id is required!",
					453: "Main Tenant is not found!",
					454: "Unable to add tenant application",
					455: "Unable to add a new key to the tenant application",
					456: "Unable to add the tenant application ext Key",
					
					460: "Unable to find product",
					461: "Unable to find package",
					466: "You are not allowed to remove the product you are currently logged in with.",
					467: "Package already exists",
					468: "Product already exists.",
					
					470: "Unable to update product.",
					
					500: "You cannot modify or delete a locked record.",
					501: "Environment record not found!",
					
					601: "Model not found.",
					602: "Model error: "
				},
			};
			let soajs = {
				core: {
					registry: {
						loadByEnv: (env, cb) => {
							return cb(null, {code: "KUBE", serviceConfig: {key: "test"}});
						}
					},
					key: {
						generateExternalKey: (key, opt, opt1, opt2, cb) => {
							return cb(null, "2313131312312");
						}
					}
				},
				provision: {
					generateInternalKey: (cb) => {
						return cb(null, "232423423423432");
					}
				}
			};
			BL.add(soajsClient, inputMask, soajs, (err, record) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing  Delete tenant", () => {
		afterEach((done) => {
			BL.modelObj = null;
			done();
		});
		
		it("Success - delete tenant - data", (done) => {
			let inputMask = {
				"id": "SomeID",
				"code": "test",
			};
			
			BL.modelObj = {
				getTenant: (inputMask, cb) => {
					return cb(null, {
						"id": "SomeID",
						"code": "test",
						"name": "Test Tenant",
						"description": "this is a description for test tenant",
					});
				},
				deleteTenant: (inputMask, cb) => {
					return cb(null, true);
				}
			};
			
			BL.delete(soajs, inputMask, (err, record) => {
				assert.ok(record);
				assert.deepEqual(record, true);
				done();
			});
		});
		
		it("Fails - delete tenant - null data", (done) => {
			BL.modelObj = {};
			
			BL.delete(soajs, null, (err, record) => {
				assert.ok(err);
				assert.deepEqual(err, {
					code: 400,
					msg: soajs.config.errors[400]
				});
				done();
			});
		});
		
		it("Fails - delete tenant - getTenant Error", (done) => {
			BL.modelObj = {
				getTenant: (inputMask, cb) => {
					return cb(true, null);
				},
				deleteTenant: (inputMask, cb) => {
					return cb(null, null);
				}
			};
			
			BL.delete(soajs, {}, (err, record) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("Fails - delete tenant - deleteTenant Error", (done) => {
			BL.modelObj = {
				getTenant: (inputMask, cb) => {
					return cb(null, {
						"code": "test",
						"name": "Test Tenant",
						"description": "this is a description for test tenant",
					});
				},
				deleteTenant: (inputMask, cb) => {
					return cb(true, null);
				}
			};
			
			BL.delete(soajs, {}, (err, record) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("Fails - delete tenant - no record", (done) => {
			BL.modelObj = {
				getTenant: (inputMask, cb) => {
					return cb(null, null);
				},
				deleteTenant: (inputMask, cb) => {
					return cb(null, true);
				}
			};
			
			BL.delete(soajs, {}, (err, record) => {
				assert.ok(err);
				assert.deepEqual(err, {
					code: 450,
					msg: soajs.config.errors[450]
				});
				done();
			});
		});
		
		it("Fails - delete tenant - locked record", (done) => {
			BL.modelObj = {
				getTenant: (inputMask, cb) => {
					return cb(null, {
						locked: true,
						console: true
					});
				},
				deleteTenant: (inputMask, cb) => {
					return cb(null, true);
				}
			};
			
			BL.delete(soajs, {}, (err, record) => {
				assert.ok(err);
				assert.deepEqual(err, {
					code: 500,
					msg: soajs.config.errors[500]
				});
				done();
			});
		});
		
		it("Fails - delete tenant - tenant logged in with", (done) => {
			BL.modelObj = {
				getTenant: (inputMask, cb) => {
					return cb(null, {
						_id: "5c0e74ba9acc3c5a84a51259"
					});
				},
				deleteTenant: (inputMask, cb) => {
					return cb(null, true);
				}
			};
			soajs.tenant = {
				id: "5c0e74ba9acc3c5a84a51259",
					application: {
					product: "TPROD",
						package: "TPROD_TEST",
				}
			};
			BL.localConfig = {
				"tenant": {
					"generatedCodeLength": 5,
					"character": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
					"expDateTTL": 86400000
				},
				"errors": {
					400: "Business logic required data are missing.",
					450: "Unable to find tenant",
					451: "Tenant already exists",
					452: "Main Tenant id is required!",
					453: "Main Tenant is not found!",
					454: "Unable to add tenant application",
					455: "Unable to add a new key to the tenant application",
					456: "Unable to add the tenant application ext Key",
					
					460: "Unable to find product",
					461: "Unable to find package",
					462: "You are not allowed to remove the tenant you are currently logged in with.",
					466: "You are not allowed to remove the product you are currently logged in with.",
					467: "Package already exists",
					468: "Product already exists.",
					
					470: "Unable to update product.",
					
					500: "You cannot modify or delete a locked record.",
					501: "Environment record not found!",
					
					601: "Model not found.",
					602: "Model error: "
				},
			};
			BL.delete(soajs, {}, (err, record) => {
				assert.ok(err);
				assert.deepEqual(err, {
					code: 462,
					msg: soajs.config.errors[462]
				});
				done();
			});
		});
	});
});
"use strict";
const colName = "tenants";
const core = require("soajs");
const Mongo = core.mongo;

let indexing = false;

function Tenant(service, dbConfig, mongoCore) {
	let __self = this;
	let indexingFn = () => {
		if (!indexing) {
			indexing = true;
			//todo fix indexes
			__self.mongoCore.createIndex(colName, {'code': 1}, {unique: true}, function (err, result) {
			});
			__self.mongoCore.createIndex(colName, {'applications.keys.key': 1}, {}, function (err, result) {
			});
			__self.mongoCore.createIndex(colName, {'name': 1}, {}, function (err, result) {
			});
			__self.mongoCore.createIndex(colName, {'type': 1}, {}, function (err, result) {
			});
			__self.mongoCore.createIndex(colName, {'application.keys.extKeys.env': 1}, {}, function (err, result) {
			});
			__self.mongoCore.createIndex(colName, {'tenant.id': 1}, {}, function (err, result) {
			});
			
			
			service.log.debug("Indexes for " + colName + " Updated!");
		}
	};
	
	if (mongoCore) {
		__self.mongoCore = mongoCore;
		indexingFn();
	}
	if (!__self.mongoCore) {
		if (dbConfig) {
			__self.mongoCore = new Mongo(dbConfig);
		} else {
			let registry = service.registry.get();
			__self.mongoCore = new Mongo(registry.coreDB.provision);
		}
		indexingFn();
	}
}

Tenant.prototype.listTenants = function (data, cb) {
	let __self = this;
	//todo check remove console tenants

	let condition = {
		$or: [
			{console: false},
			{console: null}
		]
	};

	__self.mongoCore.find(colName, condition, null, null, (err, records) => {
		return cb(err, records);
	});
};

Tenant.prototype.listConsoleTenants = function (data, cb) {
	let __self = this;

	if(!data) {
		let error = new Error("must provide data.");
		return cb(error, null);
	}

	let condition = {
		console: true
	};

	if (Object.hasOwnProperty.call(data, "negate") && data.negate === true) {
		condition = {'type': {$ne: data.type}};
	} else {
		condition = {'type': data.type};
	}

	let options = {"sort": {"name": 1}};

	__self.mongoCore.find(colName, condition, null, options, (err, records) => {
		return cb(err, records);
	});
};

/**
 * To validate and convert an id to mongodb objectID
 *
 * @param data
 *  should have:
 *      required (id)
 *
 * @param cb
 */
Tenant.prototype.validateId = (data, cb) => {
	let __self = this;

	if (!data || !data.id) {
		let error = new Error("must provide id.");
		return cb(error, null);
	}

	try {
		data.id = __self.mongoCore.ObjectId(data.id);
		return cb(null, data.id);
	} catch (e) {
		return cb(e, null);
	}
};

Tenant.prototype.addTenant = (data, cb) => {
	let __self = this;

	__self.mongoCore.insert(colName, data, (err, result) => {
		if (err) {
			return cb(err, null);
		}
		return cb(null, result);
	});
};

Tenant.prototype.getTenant = function (data, cb) {
	let __self = this;
	let condition = {};

	if (!data || !(data.id || data.code)) {
		let error = new Error("must provide either id or code.");
		return cb(error, null);
	}

	if (data.id) {
		__self.validateId(data, (err, id) => {
			if (err) {
				return cb(err, null);
			}
			condition = {'_id': id};
		});
	} else if (data.code) {
		condition = {'code': data.code};
	}

	__self.mongoCore.findOne(colName, condition, null, null, (err, record) => {
		return cb(err, record);
	});
};

Tenant.prototype.updateTenant = (data, cb) => {
	let __self = this;
	let condition = {};
	let options = {'upsert': false, 'safe': true};

	if (!data || !(data.id || data.code)) {
		let error = new Error("must provide either id or code.");
		return cb(error, null);
	}

	if (data.id) {
		try {
			data.id = __self.mongoCore.ObjectId(data.id);
		} catch (e) {
			return cb(e, null);
		}
		condition = {'_id': data.id};
	} else if (data.code) {
		condition = {'code': data.code};
	}

	let record = {
		'$set': {
			'description': data.description,
			'name': data.name,
			'type': data.type
		}
	};
	if (data.profile) {
		record['$set']['profile'] = data.profile;
	}
	if (data.inputmaskData.tag) {
		record['$set']['tag'] = data.tag;
	}

	__self.mongoCore.update(colName, condition, record, options, (err, result) => {
		return cb(err, result);
	});
};

Tenant.prototype.closeConnection = function () {
	let __self = this;
	
	__self.mongoCore.closeDb();
};

module.exports = Tenant;
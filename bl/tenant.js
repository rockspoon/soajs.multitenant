'use strict';


let bl = {
    "modelObj": null,
    "model": null,
    "soajs_service": null,
    "list": function (soajs, inputmaskData, localConfig, cb) {
        let l_modelObj = bl.modelObj;
        if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
            l_modelObj = new bl.model(bl.soajs_service, soajs.tenant.dbConfig, null);
        }
        l_modelObj.listTenants(null, (err, records) => {
            if (err) {
                soajs.log.error(err);
                if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
                    l_modelObj.closeConnection();
                }
                return cb({
                    "code": 436,
                    "msg": localConfig.errors[436]
                });
            }
            if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
                l_modelObj.closeConnection();
            }
            return cb(null, records);
        });
    },

    "add": function (soajs, inputmaskData, localConfig, cb) {

    },
};

module.exports = bl;
let aclSchema = require("./schemas/acl");

module.exports = {
    type: 'service',
    prerequisites: {
        cpu: '',
        memory: ''
    },
    "serviceVersion": 1,
    "serviceName": "multitenant",
    "serviceGroup": "SOAJS Core Services",
    "servicePort": 4004,
    "requestTimeout": 30,
    "requestTimeoutRenewal": 5,
    "oauth": true,
    "extKeyRequired": true,

    "errors": {
        400: "Business logic required data are missing.",

        460: "Unable to find product.",
        461: "Unable to find packages.",
        466: "You are not allowed to remove the product you are currently logged in with.",
        468: "Product already exists.",
        500: "You cannot modify or delete a locked record.",


        601: "Model not found.",
        602: "Model error: ",

    },
    "schema": {
        "commonFields": {
            "acl": aclSchema,
            "description": {
                "source": ['body.description'],
                "required": false,
                "validation": {
                    "type": "string"
                }
            },
            "name": {
                "source": ['body.name'],
                "required": true,
                "validation": {
                    "type": "string"
                }
            },
            "id": {
                "source": ['query.id'],
                "required": true,
                "validation": {
                    "type": "string"
                }
            },
            "_TTL": {
                "source": ['body._TTL'],
                "required": true,
                "validation": {
                    "type": "string",
                    "enum": ['6', '12', '24', '48', '72', '96', '120', '144', '168']
                }
            },
        },
        "get": {
            "/products": {
                _apiInfo: {
                    "l": "List Products",
                    "group": "Product",
                    "groupMain": true
                }
            },
            "/products/console": {
                _apiInfo: {
                    "l": "List Console Products",
                    "group": "Console product",
                    "groupMain": true
                }
            },
            "/product": {
                _apiInfo: {
                    "l": "Get Product",
                    "group": "Product",
                    "groupMain": true
                },
                id: {
                    "source": ['query.id'],
                    "required": false,
                    "validation": {
                        "type": "string"
                    }
                },
                code: {
                    "source": ["query.code"],
                    "required": false,
                    "validation": {
                        "type": "string",
                        "format": "alphanumeric",
                        "maxLength": 6
                    }
                }
            },
            "/product/packages": {
                _apiInfo: {
                    "l": "List Product Packages",
                    "group": "Product"
                },
                "commonFields": ['id']
            },
            "/product/package": {
                _apiInfo: {
                    "l": "Get Product Package",
                    "group": "Product"
                },
                "packageCode": {
                    "source": ["query.packageCode"],
                    "required": true,
                    "validation": {
                        "type": "string"
                    }
                },
                "productCode": {
                    "source": ["query.code"],
                    "required": true,
                    "validation": {
                        "type": "string",
                        "format": "alphanumeric",
                        "maxLength": 6
                    }
                }
            }
        },
        "post": {
            "/product": {
                _apiInfo: {
                    "l": "Add a Product",
                    "group": "Product",
                    "groupMain": true
                },
                commonFields: ['description', 'name'],
                code: {
                    "source": ['body.code'],
                    "required": true,
                    "validation": {
                        "type": "string",
                        "format": "alphanumeric",
                        "minLength": 4,
                        "maxLength": 5
                    }
                }
            },
            "/product/package": {
                _apiInfo: {
                    "l": "Add a package to a Product",
                    "group": "Product"
                },
                "commonFields": ['id', 'name', 'description', '_TTL', 'acl'],
                "code": {
                    "source": ["body.code"],
                    "required": false,
                    "validation": {
                        "type": "string",
                        "format": "alphanumeric",
                        "minLength": 4,
                        "maxLength": 5
                    }
                }
            },

        },
        "delete": {
            "/product": {
                _apiInfo: {
                    "l": "Delete a Product",
                    "group": "Product",
                    "groupMain": true
                },
                "id": {
                    "source": ['query.id'],
                    "required": false,
                    "validation": {
                        "type": "string"
                    }
                },
                "code": {
                    "source": ['query.code'],
                    "required": false,
                    "validation": {
                        "type": "string"
                    }
                }
            }

        },
        "put": {

            "/product/purge": {
                _apiInfo: {
                    "l": "Purge ACL for a Product and all its packages",
                    "group": "Product"
                },
                "commonFields": ['id']
            },
        }
    }
};
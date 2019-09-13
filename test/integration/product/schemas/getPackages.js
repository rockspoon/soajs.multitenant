"use strict";

let aclSchema = require('../../../../schemas/acl');
aclSchema.required = true;

let getPackagesSchema = {
    "type": "object",
    "required": true,
    "additionalProperties": false,
    "properties": {
        "result": {
            "type": "boolean",
            "required": true
        },
        "data": {
            "type": "array",
            "required": false,
            "uniqueItems": true,
            "items": {
                "type": "object",
                "additionalProperties": false,
                "properties": {
                    "code": {"type": "string", "required": true},
                    "name": {"type": "string", "required": true},
                    "description": {"type": "string", "required": false},
                    "_TTL": {"type": "number", "min": 1, "required": true},
                    "acl": aclSchema
                }
            }
        },
        "errors": {
            "type": "object",
            "required": false,
            "properties": {
                "codes": {
                    "type": "array",
                    "required": true
                },
                "details": {
                    "type": "array",
                    "required": true
                }
            }
        }
    }
};

module.exports = getPackagesSchema;
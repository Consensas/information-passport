/**
 *  lib/errors.js
 *
 *  David Janes
 *  Consensas
 *  2021-01-11
 */

"use strict"

const util = require('util');

/**
 */
exports.InvalidField = function(field) {
    Error.call(this);

    this.message = `Invalid field: ${field}`
    this.field = field
    this.statusCode = 400
}

util.inherits(exports.InvalidField, Error);

/**
 */
exports.InvalidSignature = function(field) {
    Error.call(this);

    this.message = `Invalid field: ${field}`
    this.field = field
    this.statusCode = 400
}

util.inherits(exports.InvalidSignature, Error);

/**
 *  lib/errors.js
 *
 *  David Janes
 *  Consensas
 *  2021-01-11
 */

"use strict"

/**
 */
class InvalidField extends Error {
    constructor(field) {
        super(`Invalid field: ${field}`)

        this.field = field
        this.statusCode = 400
    }
}

/**
 */
class InvalidSignature extends Error {
    constructor(error) {
        super(`Invalid Signature: ${error?.message || ""}`)

        this.error = error || null
        this.statusCode = 400
    }
}

/**
 */
class InvalidChain extends Error {
    constructor(error) {
        super(`Invalid Chain: ${error?.message || ""}`)

        this.error = error || null
        this.statusCode = 400
    }
}

/**
 *  API
 */
exports.InvalidField = InvalidField
exports.InvalidSignature = InvalidSignature
exports.InvalidChain = InvalidChain

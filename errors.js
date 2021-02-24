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
    constructor(error, message) {
        super(`InvalidField: ${message || error?.message || ""}`)

        this.error = error || null
        this.field = message
        this.statusCode = 400
    }
}

/**
 */
class InvalidSignature extends Error {
    constructor(error, message) {
        super(`InvalidSignature: ${message || error?.message || ""}`)

        this.error = error || null
        this.statusCode = 400
    }
}

/**
 */
class InvalidChain extends Error {
    constructor(error, message) {
        super(`InvalidChain: ${message || error?.message || ""}`)

        this.error = error || null
        this.statusCode = 400
    }
}

/**
 */
class InvalidData extends Error {
    constructor(error, message) {
        super(`InvalidData: ${message || error?.message || ""}`)

        this.error = error || null
        this.statusCode = 400
    }
}

/**
 */
class NotImplemented extends Error {
    constructor(error, message) {
        super(`NotImplemented: ${message || error?.message || ""}`)

        this.error = error || null
        this.statusCode = 500
    }
}

/**
 */
class UnknownSuite extends Error {
    constructor(error, message) {
        super(`UnknownSuite: ${message || error?.message || ""}`)

        this.error = error || null
        this.statusCode = 500
    }
}

/**
 *  This is for coding errors
 */
class DataError extends Error {
    constructor(error, field, value) {
        super(`DataError: ${field || error?.field || ""}`)

        this.error = error || null
        this.statusCode = 500
        this.field = field
        this.value = value
    }
}

/**
 *  API
 */
exports.InvalidField = InvalidField
exports.InvalidSignature = InvalidSignature
exports.InvalidChain = InvalidChain
exports.InvalidData = InvalidData
exports.NotImplemented = NotImplemented
exports.UnknownSuite = UnknownSuite
exports.DataError = DataError

/**
 *  lib/verify.js
 *
 *  David Janes
 *  Consensas
 *  2021-01-11
 *
 */

"use strict"

const assert = require("assert")
const canonicalize = require("./canonicalize").canonicalize
const jose = require("node-jose")

// https://stackoverflow.com/a/33332038/96338
const isDictionary = d => {
   return (d === void 0 || d === null || Array.isArray(d) || typeof d == 'function' || d.constructor === Date ) ?
           false : (typeof d == 'object')
}

const isString = v => typeof v === 'string';
const isArray = v => Array.isArray(v)

const SECURITY_KEY = "security"
const SECURITY_VALUE = "https://w3id.org/security#"

/**
 */
const verify = async (d, keys) => {
    assert.ok(isDictionary(d))

    const canonical = canonicalize(d)
    /*
    const timestamp = new Date().toISOString()
    const plaintext = canonical + timestamp
    const signed = await jose.JWS.createSign(keys)
        .update(plaintext, "utf8")
        .final()

    const message = Object.assign({ "@context": null }, d)
    const context = message["@context"]
    if (isString(context)) {
        message["@context"] = [
            {
                [ SECURITY_KEY ]: SECURITY_VALUE,
            },
            context
        ]
    } else if (isDictionary(context)) {
        message["@context"] = Object.assign({}, context)
        message["@context"][SECURITY_KEY] = SECURITY_VALUE
    } else if (isArray(context)) {
        message["@context"] = [].concat([
            {
                [ SECURITY_KEY ]: SECURITY_VALUE,
            },
            context
        ])
    } else {
        message["@context"] = {
            [ SECURITY_KEY ]: SECURITY_VALUE,
        }
    }

    // https://tools.ietf.org/html/rfc7797
    message["security:proof"] = {
        "security:type": "https://models.consensas.com/security#ConsensasRSA2021",
        "security:proofPurpose": "assertionMethod",
        "security:created": timestamp,
        "security:jws": `${signed.payload}.${signed.signatures[0].protected}.${signed.signatures[0].signature}`
    }

    if (verification) {
        message["security:proof"]["security:verificationMethod"] = verification
    }

    return message
    */
}

/**
 */
exports.verify = verify

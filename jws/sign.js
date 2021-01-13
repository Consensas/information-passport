/**
 *  lib/sign.js
 *
 *  David Janes
 *  Consensas
 *  2021-01-11
 *
 */

"use strict"

// const assert = require("assert")
const jose = require("node-jose")
const _util = require("./_util")

/**
 */
const sign = async (d, keys, verification) => {
    // assert.ok(_util.isDictionary(d))

    const message = Object.assign({ "@context": null }, d)
    const context = message["@context"]
    if (_util.isString(context)) {
        message["@context"] = [
            {
                [ _util.SECURITY_KEY ]: _util.SECURITY_VALUE,
            },
            context
        ]
    } else if (_util.isDictionary(context)) {
        message["@context"] = Object.assign({}, context)
        message["@context"][_util.SECURITY_KEY] = _util.SECURITY_VALUE
    } else if (_util.isArray(context)) {
        message["@context"] = [].concat([
            {
                [ _util.SECURITY_KEY ]: _util.SECURITY_VALUE,
            },
            context
        ])
    } else {
        message["@context"] = {
            [ _util.SECURITY_KEY ]: _util.SECURITY_VALUE,
        }
    }

    const timestamp = new Date().toISOString()
    const nonce = `${Math.random()}`.substring(2)
    const canonical = _util.canonicalize(message)
    const plaintext = canonical + "\n" + timestamp + "\n" + nonce
    const signed = await jose.JWS.createSign({
        format: "compact",
        alg: 'RS256',
    }, keys)
        .update(plaintext, "utf8")
        .final()

    // https://tools.ietf.org/html/rfc7797
    message["security:proof"] = {
        "security:type": _util.SECURITY_TYPE,
        "security:proofPurpose": _util.SECURITY_PROOF_PURPOSE,
        "security:created": timestamp,
        "security:nonce": nonce,
        "security:jws": signed.replace(/[.].*[.]/, "..")
        // "security:jws": signed,
    }
    // console.log("PLAINTEXT", plaintext)

    if (verification) {
        message["security:proof"]["security:verificationMethod"] = verification
    }

    return message
}

/**
 */
exports.sign = sign

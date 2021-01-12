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
const jose = require("node-jose")
const _util = require("./_util")

/**
 *  To be done:
 */
const verify = async (d, public_key) => {
    assert.ok(_util.isDictionary(d))

    const message = _util.clone(d)
    const proof = message["security:proof"]
    if (!_util.isDictionary(proof)) {
        return {
            valid: false,
            error_field: 'security:proof',
        }
    }
    delete message["security:proof"]

    Object.keys(proof).forEach(key => {
        if (!key.startsWith("security:")) {
            return
        }

        proof[key.replace(/^security:/, "")] = proof[key]
        delete proof[key]
    })

    if (!_util.isString(proof.type)) {
        return {
            valid: false,
            error_field: 'security:type',
        }
    } else if (proof.type !== _util.SECURITY_TYPE) {
        return {
            valid: false,
            error_field: 'security:type',
        }
    }

    if (!_util.isString(proof.proofPurpose)) {
        return {
            valid: false,
            error_field: 'security:proofPurpose',
        }
    } else if (proof.proofPurpose !== _util.SECURITY_PROOF_PURPOSE) {
        return {
            valid: false,
            error_field: 'security:type',
        }
    }

    if (!_util.isTimestamp(proof.created)) {
        return {
            valid: false,
            error_field: 'security:created',
        }
    }

    if (!_util.isString(proof.nonce)) {
        return {
            valid: false,
            error_field: 'security:nonce',
        }
    }

    let jws = proof.jws
    let match
    if (!_util.isString(jws)) {
        return {
            valid: false,
            error_field: 'security:jws',
        }
    } else if (!(match = jws.match(/^(.*)[.][.](.*)$/))) {
        return {
            valid: false,
            error_field: 'security:jws',
        }
    }

    if (!_util.isString(proof.verificationMethod)) {
        return {
            valid: false,
            error_field: 'security:verificationMethod',
        }
    }

    // recreate the detatched payload
    const canonical = _util.canonicalize(message)
    const plaintext = canonical + "\n" + proof.created + "\n" + proof.nonce
    const payload = jose.util.base64url.encode(plaintext, "utf8");

    jws = jws.replace("..", `.${payload}.`)

    const result = await jose.JWS.createVerify(public_key)
        .verify(jws)

    return {
        valid: true,
        proof: proof,
        payload: message,
    }
}

/**
 */
exports.verify = verify

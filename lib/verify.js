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
            error_field: 'security:proof',
        }
    }
    delete message["security:proof"]

    const type = proof['security:type']
    if (!_util.isString(type)) {
        return {
            error_field: 'security:type',
        }
    } else if (type !== _util.SECURITY_TYPE) {
        return {
            error_field: 'security:type',
        }
    }

    const proofPurpose = proof['security:proofPurpose']
    if (!_util.isString(proofPurpose)) {
        return {
            error_field: 'security:proofPurpose',
        }
    } else if (proofPurpose !== _util.SECURITY_PROOF_PURPOSE) {
        return {
            error_field: 'security:type',
        }
    }

    const timestamp = proof['security:created']
    if (!_util.isTimestamp(timestamp)) {
        return {
            error_field: 'security:timestamp',
        }
    }

    const nonce = proof['security:nonce']
    if (!_util.isString(nonce)) {
        return {
            error_field: 'security:nonce',
        }
    }

    let jws = proof['security:jws']
    let match
    if (!_util.isString(jws)) {
        return {
            error_field: 'security:jws',
        }
    } else if (!(match = jws.match(/^(.*)[.][.](.*)$/))) {
        return {
            error_field: 'security:jws',
        }
    }

    const verificationMethod = proof['security:verificationMethod']
    if (!_util.isString(verificationMethod)) {
        return {
            error_field: 'security:verificationMethod',
        }
    }

    // recreate the detatched payload
    const canonical = _util.canonicalize(message)
    const plaintext = canonical + "\n" + timestamp + "\n" + nonce
    const payload = jose.util.base64url.encode(plaintext, "utf8");

    /*
    console.log("PLAINTEXT", plaintext)
    console.log("OLD", jws.replace(/^[^.]*[.]/, "").replace(/[.].*$/, ""))
    console.log("NEW", payload)
    process.exit()
    */

    jws = jws.replace("..", `.${payload}.`)

    console.log(jws)

    const result = await jose.JWS.createVerify(public_key)
        .verify(jws)
    console.log("RESULT", result)



    /*
    const canonical = canonicalize(d)
    const timestamp = new Date().toISOString()
    const plaintext = canonical + timestamp
    const signed = await jose.JWS.createSign(public_key)
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

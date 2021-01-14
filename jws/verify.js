/**
 *  jws/verify.js
 *
 *  David Janes
 *  Consensas
 *  2021-01-11
 */

"use strict"

const forge = require("node-forge")
const jose = require("node-jose")
const _util = require("./_util")
const errors = require("../errors")

/**
 *  To be done:
 */
const verify = async (d, key_fetcher) => {
    const ip = require("..")
    // assert.ok(_util.isDictionary(d))

    const message = _util.clone(d)
    const proof = message["security:proof"]
    if (!_util.isDictionary(proof)) {
        throw new errors.InvalidField("security:proof")
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
        throw new errors.InvalidField('security:type')
    } else if (proof.type !== _util.SECURITY_TYPE) {
        throw new errors.InvalidField('security:type')
    }

    if (!_util.isString(proof.proofPurpose)) {
        throw new errors.InvalidField('security:proofPurpose')
    } else if (proof.proofPurpose !== _util.SECURITY_PROOF_PURPOSE) {
        throw new errors.InvalidField('security:type')
    }

    if (!_util.isTimestamp(proof.created)) {
        throw new errors.InvalidField('security:created')
    }

    if (!_util.isString(proof.nonce)) {
        throw new errors.InvalidField('security:nonce')
    }

    let jws = proof.jws
    let match
    if (!_util.isString(jws)) {
        throw new errors.InvalidField('security:nonce')
    } else if (!(match = jws.match(/^(.*)[.][.](.*)$/))) {
        throw new errors.InvalidField('security:nonce')
    }

    if (!_util.isString(proof.verificationMethod)) {
        throw new errors.InvalidField('security:verificationMethod')
    }

    // recreate the detatched payload
    const canonical = _util.canonicalize(message)
    const plaintext = canonical + "\n" + proof.created + "\n" + proof.nonce
    const payload = jose.util.base64url.encode(plaintext, "utf8");

    jws = jws.replace("..", `.${payload}.`)

    // get the cert chain - the top is the leaf, the bottom the CA
    const chain_pem = await key_fetcher(proof)

    const pems = chain_pem
        .split(/(-----BEGIN CERTIFICATE-----.*?-----END CERTIFICATE-----\n)/s)
        .filter(part => part.startsWith("---"))

    const keys = []
    const certs = []
    for (let pem of pems) {
        certs.push(await forge.pki.certificateFromPem(pem, "pem"))
        keys.push(await jose.JWK.asKey(pem, "pem"))
    }

    // validate the chain
    try {
        const store = forge.pki.createCaStore([ chain_pem ]);
    } catch (error) {
        throw new errors.InvalidChain(error)
    }

    // validate JWS against public key
    try {
        const result = await jose.JWS.createVerify(keys[0]).verify(jws)
        if (!!result) {
            return {
                proof: proof,
                payload: message,
                chain: certs.map(cert => ip.jws.fingerprint(cert)),
            }
        } else {
            throw new errors.InvalidSignature()
        }
    } catch (error) {
        throw new errors.InvalidSignature(error)
    }
}

/**
 */
exports.verify = verify

/**
 *  crypto/verify.js
 *
 *  David Janes
 *  Consensas
 *  2021-01-11
 *
 *  Copyright (2013-2021) Consensas
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict"

const forge = require("node-forge")
const jose = require("node-jose")
const _util = require("./_util")
const errors = require("../errors")
const jsonld = require("jsonld")

/**
 */
const _RsaSignature2018 = async (message, paramd, proof) => {
    throw new Error("RsaSignature2018: not implemented yet")
}

/**
 */
const _BbsBlsSignature2020 = async (message, paramd, proof) => {
    throw new Error("BbsBlsSignature2020: not implemented yet")
}

/**
 */
const _CanonicalRSA2021 = async (message, paramd, proof) => {
    const ip = require("..")

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
    const _message = Object.assign({}, message)
    delete _message.proof
    const canonical_message = _util.canonicalize(_message)

    const _proof = Object.assign({}, proof)
    delete _proof.jws
    const canonical_proof = _util.canonicalize(_proof)

    const plaintext = canonical_message + "\n" + canonical_proof
    const payload = jose.util.base64url.encode(plaintext, "utf8");

    jws = jws.replace("..", `.${payload}.`)

    // get the cert chain - the top is the leaf, the bottom the CA
    const chain_pem = await paramd.fetch_chain(proof)

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
        if (!result) {
            throw new errors.InvalidSignature()
        }

        return {
            chain: certs.map(cert => {
                const d = {}

                cert.subject.attributes.forEach(attribute => {
                    d[attribute.shortName] = attribute.value
                })

                d.fingerprint = ip.crypto.fingerprint(cert)

                return d
            }),
        }
    } catch (error) {
        throw new errors.InvalidSignature(error)
    }
}

/**
 *  Needs work for dealing with any type of signing algorithm.
 *
 *  This always assumes that the proof is 
 *  under "security:proof" - this probably is not 
 *  a requirement if you're writing a JSON-LD verifier.
 *
 *  Within the proof we allow e.g. "security:type"
 *  or "type", noting that the signature is based what
 *  what originally used and not some "deeper meaning"
 *
 *  The return value has:
 *  {
 *      json - the original message (may be slightly modified)
 *      claim - the claim in the message
 *      types - the types of VC
 *      chain - the X.509 chain, leaf to root
 *      proof - the simplified (no security: proof)
 *  }
 */
const verify = async (json, paramd) => {
    const ip = require("..")

    paramd = Object.assign({}, paramd || {})
    paramd.verify = paramd.verify ?? true

    let result

    switch (paramd.verify ? json?.proof?.type || "NOOP" : "NOOP") {
    case "NOOP":
        proof = null
        result = {}
        break

    case 'https://cccc4.ca/vc#CanonicalRSA2021':
    case "https://models.consensas.com/security#ConsensasRSA2021":
        result = await _CanonicalRSA2021(json, paramd, json.proof)
        break

    default:
        throw new errors.InvalidField(`security:type: ${json?.proof?.type}`)
    }

    const compacted = await jsonld.compact(json, ip.context)
    const claim_types = _util.coerce.list(compacted["@type"], _util.coerce.list(compacted["vc:type"], []))
    const claim = _util.coerce.first(compacted["vc:credentialSubject"], null)

    return Object.assign({
        proof: json?.proof || null,
        payload: json,
        claim_types: claim_types,
        claim: claim,
        chain: [],
    }, result)
}

/**
 */
exports.verify = verify

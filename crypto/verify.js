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
 *      payload - the original message (with @context)
 *      claim - the claim in the message
 *      types - the types of VC
 *      chain - the X.509 chain, leaf to root
 *      proof - the simplified (no security: proof)
 *  }
 */
const verify = async (d, paramd) => {
    const ip = require("..")

    const message = _util.clone(d)
    const compacted = await jsonld.compact(d, ip.context);
    const types = _util.coerce.list(compacted["@type"], _util.coerce.list(compacted["vc:type"], []))
    const claim = _util.coerce.first(compacted["vc:credentialSubject"], null)

    // allow proof to come as security:proof or proof
    let proof
    for (let proof_key of [ "security:proof", "proof" ]) {
        proof = message[proof_key]
        if (_util.isDictionary(proof)) {
            delete message[proof_key]
            break
        }
    }

    // it's ok for there to be no proof
    if (!proof) {
        return {
            proof: null,
            payload: compacted,
            types: types,
            claim: claim,
            chain: [],
        }
    }

    // we simplify proof for JS programming
    const proof_original = Object.assign({}, proof)
    Object.keys(proof).forEach(key => {
        if (!key.startsWith("security:")) {
            return
        }

        proof[key.replace(/^security:/, "")] = proof[key]
        delete proof[key]
    })

    if (!_util.isString(proof.type)) {
        throw new errors.InvalidField('security:type')
    } else if ((proof.type !== _util.SECURITY_TYPE) && (proof.type !== "https://models.consensas.com/security#ConsensasRSA2021")) {
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
    const canonical_message = _util.canonicalize(message)

    delete proof_original["security:jws"]
    delete proof_original["jws"]
    const canonical_proof = _util.canonicalize(proof_original)

    const plaintext = canonical_message + "\n" + canonical_proof
    const payload = jose.util.base64url.encode(plaintext, "utf8");

    jws = jws.replace("..", `.${payload}.`)

    // get the cert chain - the top is the leaf, the bottom the CA
    const chain_pem = await paramd.fetch_key(proof)

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
                payload: compacted,
                types: types,
                claim: claim,
                chain: certs.map(cert => {
                    const d = {}

                    cert.subject.attributes.forEach(attribute => {
                        d[attribute.shortName] = attribute.value
                    })

                    d.fingerprint = ip.crypto.fingerprint(cert)

                    return d
                }),
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

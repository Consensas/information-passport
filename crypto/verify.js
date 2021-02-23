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

const _ = require("lodash")
const _util = require("./_util")
const errors = require("../errors")
const jsonld = require("jsonld")

/**
 *  public key fingerprint
 */
const _chain = async (chain_pem) => {
    const forge = require("node-forge")
    const ip = require("..")

    const pems = chain_pem
        .split(/(-----BEGIN [A-Z0-9]+-----.*?-----END [A-Z0-9]+-----\n)/s)
    const cert_pems = pems
        .filter(part => part.startsWith("-----BEGIN CERTIFICATE"))

    const certs = []
    for (let pem of cert_pems) {
        certs.push(await forge.pki.certificateFromPem(pem, "pem"))
    }

    // validate the chain
    try {
        const store = forge.pki.createCaStore([ cert_pems.join("\n") ]);
    } catch (error) {
        throw new errors.InvalidChain(error)
    }

    // build the chain
    const chain = certs.map(cert => {
        const d = {}

        cert.subject.attributes.forEach(attribute => {
            d[attribute.shortName] = attribute.value
        })

        d.fingerprint = ip.crypto.fingerprint(cert)

        return d
    })
    
    // if there was a public key, make sure it matches the chain leaf
    const public_pem = pems.find(pem => pem.startsWith("-----BEGIN PUBLIC KEY"))
    if (public_pem && certs[0]) {
        const public_key = await forge.pki.publicKeyFromPem(public_pem, "pem")
        if (!_.isEqual(public_key.n, certs[0].publicKey.n) || !_.isEqual(public_key.e, certs[0].publicKey.e)) {
            throw new errors.InvalidChain(error)
        }
    }

    // return the chain
    return chain
}

/**
 */
const _RsaSignature2018 = async (message, paramd, proof) => {
    const jlds = require("jsonld-signatures")
    const cryptold = require("crypto-ld")

    const pk = await paramd.fetchVerification(proof)

    const publicKey = {
        "@context": jlds.SECURITY_CONTEXT_URL,
        type: "RsaVerificationKey2018",
        id: proof.verificationMethod,
        publicKeyPem: pk,
    }

    const document_loader = url => {
        if (url === proof.verificationMethod) {
            return {
                contextUrl: null, // this is for a context via a link header
                document: publicKey, // this is the actual document that was loaded
                documentUrl: url // this is the actual context URL after redirects
            }
        }

        return jsonld.documentLoaders.node()(url);
    };


    // specify the public key controller object (whatevery the hell that is)
    const controller = {
        "@context": jlds.SECURITY_CONTEXT_URL,
        // id: "https://example.com/i/alice", // … this doesn't see to do anything
        publicKey: [ publicKey ],
        // this authorizes this key to be used for making assertions
        assertionMethod: [ publicKey.id ]
    };

    const keypair_without_private = new cryptold.RSAKeyPair({
        ...publicKey, 
    });
    const suite_without_private = new jlds.suites.RsaSignature2018({
        key: keypair_without_private,
    })

    // verify the signed document
    const result = await jlds.verify(message, {
        documentLoader: document_loader,
        suite: suite_without_private,
        purpose: new jlds.purposes.AssertionProofPurpose({
            controller,
        })
    });

    if (!result.verified) {
        throw new errors.InvalidSignature(error)
    }

    return {
        chain: await _chain(pk, null),
    }
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
    const jose = require("node-jose")

    if (!_util.isString(proof.proofPurpose)) {
        throw new errors.InvalidField(null, 'security:proofPurpose')
    } else if (proof.proofPurpose !== _util.SECURITY_PROOF_PURPOSE) {
        throw new errors.InvalidField(null, 'security:type')
    }

    if (!_util.isTimestamp(proof.created)) {
        throw new errors.InvalidField(null, 'security:created')
    }

    if (!_util.isString(proof.nonce)) {
        throw new errors.InvalidField(null, 'security:nonce')
    }

    let jws = proof.jws
    let match
    if (!_util.isString(jws)) {
        throw new errors.InvalidField(null, 'security:nonce')
    } else if (!(match = jws.match(/^(.*)[.][.](.*)$/))) {
        throw new errors.InvalidField(null, 'security:nonce')
    }

    if (!_util.isString(proof.verificationMethod)) {
        throw new errors.InvalidField(null, 'security:verificationMethod')
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
    const chain_pem = await paramd.fetchVerification(proof)

    const key = await jose.JWK.asKey(chain_pem, "pem")
    const result = await jose.JWS.createVerify(key).verify(jws)
    if (!result) {
        throw new errors.InvalidSignature()
    }

    return {
        chain: await _chain(chain_pem, key),
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
 *      credentialSubject - the claim in the message
 *      credentialTypes - the types of VC
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
        result = {}
        break

    case 'https://cccc4.ca/vc#CanonicalRSA2021':
    case "https://models.consensas.com/security#ConsensasRSA2021":
        result = await _CanonicalRSA2021(json, paramd, json.proof)
        break

    case "RsaSignature2018":
        result = await _RsaSignature2018(json, paramd, json.proof)
        break

    case "BbsBlsSignature2020":
        result = await _BbsBlsSignature2020(json, paramd, json.proof)
        break

    default:
        throw new errors.InvalidField(null, `security:type: ${json?.proof?.type}`)
    }

    const compacted = await jsonld.compact(json, ip.context)
    const credentialTypes = _util.coerce.list(compacted["@type"], _util.coerce.list(compacted["vc:type"], []))
    const credentialSubject = _util.coerce.first(compacted["vc:credentialSubject"], null)

    return Object.assign({
        proof: json?.proof || null,
        json: json,
        credentialTypes: credentialTypes,
        credentialSubject: credentialSubject,
        chain: [],
    }, result)
}

/**
 */
exports.verify = verify

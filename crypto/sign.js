/**
 *  crypto/sign.js
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

const _util = require("./_util")

/**
 */
const _RsaSignature2018 = async paramd => {
    const ip = require("..")
    const jlds = require("jsonld-signatures")
    const jsonld = require("jsonld")
    const cryptold = require("crypto-ld")

    /**
     *  The PEM file is wrapped up in some JSON-LD
     *  and put into "documents" so it can be
     *  discovered during verification.
     */
    const publicKey = {
        "@context": jlds.SECURITY_CONTEXT_URL,
        type: "RsaVerificationKey2018",
        id: paramd.verification,
        // controller: "https://example.com/i/alice", … this doesn't see to do anything
        // publicKeyPem: paramd.private_key,
    }

    /**
     *  PRIVATE PART - signing
     */
    const keypair_with_private = new cryptold.RSAKeyPair({
        ...publicKey,
        privateKeyPem: paramd.private_key,
    });
    const suite_with_private = new jlds.suites.RsaSignature2018({
        key: keypair_with_private,
    })

    // sign the document as a simple assertion
    const signed = await jlds.sign(paramd.payload, {
        suite: suite_with_private,
        purpose: new jlds.purposes.AssertionProofPurpose()
    });

    return jsonld.compact(signed, ip.context)
}

/**
 */
const _BbsBlsSignature2020 = async paramd => {
    throw new Error("BbsBlsSignature2020: not implemented yet")
}

/**
 */
const _ConsensasRSA2021 = async paramd => {
    const jose = require("node-jose")

    if (_util.isString(paramd.private_key) || _util.isBuffer(paramd.private_key)) {
        paramd.private_key = await jose.JWK.asKey(paramd.private_key, "pem")
    }

    // build @context
    const message = Object.assign({ "@context": null }, paramd.payload)
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

    // build the pre-signature proof
    const timestamp = _util.make_timestamp()
    const nonce = _util.make_nonce()
    const canonical_message = _util.canonicalize(message)

    const proof = {
        "security:type": _util.SECURITY_TYPE,
        "security:proofPurpose": _util.SECURITY_PROOF_PURPOSE,
        "security:created": timestamp,
        "security:nonce": nonce,
        "security:verificationMethod": paramd.verification,
    }
    const canonical_proof = _util.canonicalize(proof)

    // build the signature
    const plaintext = canonical_message + "\n" + canonical_proof
    const signed = await jose.JWS.createSign({
        format: "compact",
        alg: 'RS256',
    }, paramd.private_key)
        .update(plaintext, "utf8")
        .final()

    // attach the signature and proof
    proof["security:jws"] = signed.replace(/[.].*[.]/, "..")
    message["security:proof"] = proof

    return message
}

/**
 *  paramd.payload: JSON-like, the message to sign
 *  paramd.key: a node-jose key or a PEM string or buffer
 *  paramd.verification: a string, but really a URL to find the public key
 *  paramd.suite: signing suite, by default "ConsensasRSA2021"
 */
const sign = async paramd => {
    paramd = Object.assign({}, paramd || {})
    paramd.suite = paramd.suite || "ConsensasRSA2021"

    switch (paramd.suite) {
    case "ConsensasRSA2021":
        return _ConsensasRSA2021(paramd)

    case "RsaSignature2018":
        return _RsaSignature2018(paramd)

    case "BbsBlsSignature2020":
        return _BbsBlsSignature2020(paramd)

    default:
        throw new Error("unknown signing suite: " + paramd.suite)
    }
}

/**
 */
exports.sign = sign

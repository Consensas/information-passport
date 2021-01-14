/**
 *  jws/fingerprint.js
 *
 *  David Janes
 *  Consensas
 *  2021-01-14
 *  🎂-91-🥳
 */

"use strict"

const forge = require("node-forge")

const fingerprint = cert => {
    return forge.md.sha1.create()
        .update(forge.asn1.toDer(forge.pki.certificateToAsn1(cert))
        .getBytes())
        .digest()
        .toHex()
        .toUpperCase()
        .match(/.{1,2}/g)
        .join(":");
}

/**
 *  API
 */
exports.fingerprint = fingerprint

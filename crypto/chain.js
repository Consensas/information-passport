/**
 *  crypto/chain.js
 *
 *  David Janes
 *  Consensas
 *  2021-02-24
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

/**
 */
const chain = async (chain_pem) => {
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
exports.chain = chain

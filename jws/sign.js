/**
 *  jws/sign.js
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

const jose = require("node-jose")
const _util = require("./_util")

/**
 */
const sign = async (d, key, verification) => {
    if (_util.isString(key) || _util.isBuffer(key)) {
        key = await jose.JWK.asKey(key, "pem")
    }

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

    const timestamp = _util.make_timestamp()
    const nonce = _util.make_nonce()
    const canonical = _util.canonicalize(message)
    const plaintext = canonical + "\n" + timestamp + "\n" + nonce
    const signed = await jose.JWS.createSign({
        format: "compact",
        alg: 'RS256',
    }, key)
        .update(plaintext, "utf8")
        .final()

    // https://tools.ietf.org/html/rfc7797
    message["security:proof"] = {
        "security:type": _util.SECURITY_TYPE,
        "security:proofPurpose": _util.SECURITY_PROOF_PURPOSE,
        "security:created": timestamp,
        "security:nonce": nonce,
        "security:jws": signed.replace(/[.].*[.]/, ".."),
        "security:verificationMethod": verification,
    }
    // console.log("PLAINTEXT", plaintext)

    return message
}

/**
 */
exports.sign = sign

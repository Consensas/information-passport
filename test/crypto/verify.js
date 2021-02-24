/*
 *  test/crypto/verify.js
 *
 *  David Janes
 *  Consenas.com
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
const ip = require("../..")

const fs = require("fs")
const path = require("path")
const assert = require("assert")

const _util = require("./../_util")

const FOLDER = path.join(__dirname, "..", "..", "test", "data")
const WRITE = process.env.WRITE === "1"
const DUMP = process.env.DUMP === "1"

describe("verify", function() {
    const VERIFIER = "https://example.com/i/pat/keys/5"
    const MESSAGE = {
        "@context": {
            "schema": "http://schema.org"
        },
        "schema:hello": "world",
        "schema:name": "david",
    }
    const MESSAGE_FULL_CONTEXT = {
        "@context": [
            {
                "schema": "http://schema.org"
            },
            "https://w3id.org/security/v2"
        ],
        "schema:hello": "world",
        "schema:name": "david",
    }

    before(function() {
        _util.shims_on()
    })
    after(function() {
        _util.shims_off()
    })

    for (let suite of [
        "ConsensasRSA2021",
        "RsaSignature2018",
        // "BbsBlsSignature2020",
    ]) {
        it(`verify:${suite} - expected fail - bad chain`, async function() {
            const NAME = `sign/01.${suite}.json`
            const private_pem = await fs.promises.readFile(path.join(FOLDER, "private.key.pem"))

            const signed = await ip.crypto.sign({
                json: MESSAGE, 
                privateKeyPem: private_pem, 
                verification: VERIFIER,
                suite: suite,
            })

            try {
                const v = await ip.crypto.verify(signed, {
                    fetchVerification: async proof => {
                        return "djkdjdkdjdkd"
                    },
                })
            } catch (error) {
                assert.ok(error instanceof ip.errors.InvalidData)
            }
        })

    }
})

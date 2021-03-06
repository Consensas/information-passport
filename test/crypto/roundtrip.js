/*
 *  test/crypto/roundtrip.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-01-20
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

const jose = require("node-jose")

const fs = require("fs")
const path = require("path")
const assert = require("assert")

const _util = require("./../_util")

const FOLDER = path.join(__dirname, "..", "..", "test", "data")
const WRITE = process.env.WRITE === "1"
const DUMP = process.env.DUMP === "1"

describe("roundtrip", function() {
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
        it(`works - suite:${suite}`, async function() {
            const NAME = `roundtrip/01.${suite}.json`
            const private_pem = await fs.promises.readFile(path.join(FOLDER, "private.key.pem"))

            // sign
            const message = {
                "@context": {
                    "schema": "http://schema.org/",
                },
                "schema:hello": "world",
            }
            const verifier = "https://example.com/i/pat/keys/5"

            const signed = await ip.crypto.sign({ 
                json: message, 
                privateKeyPem: private_pem, 
                verification: verifier,
                suite: suite,
            })

            if (DUMP) {
                console.log("signed", JSON.stringify(signed, null, 2))
            }

            // verify
            const v = await ip.crypto.verify(signed, {
                fetchVerification: async proof => {
                    return fs.promises.readFile(path.join(FOLDER, "public.combined.pem"), "utf8")
                },
            })

            if (DUMP) {
                console.log("verified", JSON.stringify(v, null, 2))
            }
            if (WRITE) {
                await _util.write_json(v, NAME)
            }

            // For some reason, even though data is same, signature is mutating
            const got = v
            const want = await _util.read_json(NAME)
            if (suite !== "RsaSignature2018") {
                assert.deepEqual(got, want)
            }

            assert.ok(_.isArray(v.chain))
            assert.ok(_.isPlainObject(v.json))
            assert.ok(_.isPlainObject(v.proof))

            _.mapValues(message, (value, key) => {
                if (key.startsWith("@")) {
                    return
                }

                assert.deepEqual(value, v.json[key])
            })
        })
    }
})

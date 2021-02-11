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

    it("works", async function() {
        const NAME = "roundtrip/01.in.json"
        const private_pem = await fs.promises.readFile(path.join(FOLDER, "private.key.pem"))
        const private_key = await jose.JWK.asKey(private_pem, 'pem');

        // sign
        const message = {
            "hello": "world",
        }
        const verifier = "https://example.com/i/pat/keys/5"

        const signed = await ip.crypto.sign({ 
            payload: message, 
            private_key: private_key, 
            verification: verifier,
        })

        if (DUMP) {
            console.log("signed", JSON.stringify(signed, null, 2))
        }

        // verify
        const v = await ip.crypto.verify(signed, async proof => {
            return fs.promises.readFile(path.join(FOLDER, "public.cer.pem"), "utf8")
        })

        if (DUMP) {
            console.log("verified", JSON.stringify(v, null, 2))
        }

        assert.ok(_.isArray(v.chain))
        assert.ok(_.isPlainObject(v.payload))
        assert.ok(_.isPlainObject(v.proof))

        delete v.payload["@context"]
        assert.deepEqual(v.payload, message)
    })
})

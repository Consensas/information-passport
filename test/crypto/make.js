/*
 *  test/crypto/make.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-02-23
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

describe("make", function() {
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

    it("works - no params", async function() {
        const NAME = `make/01.json`

        const vc = await ip.crypto.make()

        if (DUMP) {
            console.log(JSON.stringify(vc, null, 2))
        }
        if (WRITE) {
            await _util.write_json(vc, NAME)
        }

        const got = vc
        const want = await _util.read_json(NAME)

        assert.deepEqual(got, want)
    })

    it("works - empty params", async function() {
        const NAME = `make/02.json`

        const vc = await ip.crypto.make({})

        if (DUMP) {
            console.log(JSON.stringify(vc, null, 2))
        }
        if (WRITE) {
            await _util.write_json(vc, NAME)
        }

        const got = vc
        const want = await _util.read_json(NAME)

        assert.deepEqual(got, want)
    })

    it("works - custom date", async function() {
        const NAME = `make/03.json`

        const vc = await ip.crypto.make({
            issuanceDate: _util.TEST_NOW,
        })

        assert.deepEqual(vc["vc:issuanceDate"], _util.TEST_NOW)

        if (DUMP) {
            console.log(JSON.stringify(vc, null, 2))
        }
        if (WRITE) {
            await _util.write_json(vc, NAME)
        }

        const got = vc
        const want = await _util.read_json(NAME)

        assert.deepEqual(got, want)
    })
})

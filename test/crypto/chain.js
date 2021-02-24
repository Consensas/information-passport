/*
 *  test/crypto/chain.js
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

describe("chain", function() {
    it("public key only", async function() {
    })

    it("public key + chain", async function() {
        const NAME = "chain/pk-chain-good.json"
        const pem = await _util.read_file("chain/pk-chain-good.pem")
        const chain = await ip.crypto.chain(pem)
        
        if (DUMP) {
            console.log(chain)
        }
        if (WRITE) {
            await _util.write_json(chain, NAME)
        }

        const got = chain
        const want = await _util.read_json(NAME)

        assert.deepEqual(got, want)
    })

    it("public key + non matching chain (expected fail)", async function() {
    })

    it("public key + invalid chain (expected fail)", async function() {
    })

    it("bad data (expected fail)", async function() {
        try {
            await ip.crypto.chain("djkdjkdkd")
        } catch (error) {
            assert.ok(error instanceof ip.errors.InvalidChain)
        }
    })
})

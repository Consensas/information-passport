/*
 *  test/validate/validate.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-02-08
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

const _util = require("../_util")

const FOLDER = path.join(__dirname, "..", "..", "test", "validate")
const WRITE = process.env.WRITE === "1"
const DUMP = process.env.DUMP === "1"

describe("validate/query", function() {
    const sift = require("sift")

    before(function() {
        _util.shims_on()
    })

    after(function() {
        _util.shims_off()
    })

    it("works", async function() {
        const NAME = "validate/02-outs.json"
        const ins = await _util.read_yaml("validate/02-ins.yaml")
        const ruled = await _util.read_yaml("validate/02-rules.yaml")

        if (DUMP) {
            console.log("rules", ruled.rules)
        }

        const outs = []
        for (let json of ins) {
            if (!json["@context"]) {
                json["@context"] = ip.context
            }

            const verified = await ip.crypto.verify(json, {
                verify: false,
            })
            const wrapped = await ip.validate.with.rules(verified, ruled.rules)

            outs.push(wrapped)

            if (DUMP) {
                console.log("wrapped", wrapped)
            }
    
            console.log(json["vc:credentialSubject"]["schema:name"])

            wrapped.rule_accepts.forEach(rule => {
                console.log("-", rule.name)
            })
            console.log()

        }


        /*
        const paramd = {
            operations: ip.validate.operations,
        }

        const outs = ins.filter(sift(query, paramd))
        if (WRITE) {
            await _util.write_yaml(outs, NAME)
        }

        const got = outs
        const want = await _util.read_yaml(NAME)
        
        assert.deepEqual(got, want)
        */
    })
})

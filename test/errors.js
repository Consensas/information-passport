/*
 *  test/errors.js
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
const ip = require("..")

const fs = require("fs")
const path = require("path")
const assert = require("assert")

const _util = require("./_util")

const FOLDER = path.join(__dirname, "..", "test", "data")
const WRITE = process.env.WRITE === "1"
const DUMP = process.env.DUMP === "1"

describe("errors", function() {
    for (let [ name, statusCode ] of [ 
        [ "InvalidField", 400, ],
        [ "InvalidSignature", 400, ],
        [ "InvalidChain", 400, ],
        [ "NotImplemented", 500 ],
        [ "UnknownSuite", 500 ],
    ]) {
        it(`no argument: ${name}`, async function() {
            const error = new ip.errors[name]()
            assert.strictEqual(error.statusCode, statusCode)
            assert.strictEqual(error.error, null)
        })
        it(`error argument: ${name}`, async function() {
            const chain_error = new Error("hello, world")
            const error = new ip.errors[name](chain_error)
            assert.strictEqual(error.statusCode, statusCode)
            assert.strictEqual(error.error, chain_error)
            assert.strictEqual(error.message, `${name}: hello, world`)
        })
        it(`text argument: ${name}`, async function() {
            const chain_error = new Error("hello, world")
            const error = new ip.errors[name](chain_error, "override")
            assert.strictEqual(error.statusCode, statusCode)
            assert.strictEqual(error.error, chain_error)
            assert.strictEqual(error.message, `${name}: override`)
        })
    }
})

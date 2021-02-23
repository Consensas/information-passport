/*
 *  test/_util.js
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
const ip = require("..")

const fs = require("fs")
const path = require("path")

const yaml = require("js-yaml")

/**
 *  Shims
 */
const TEST_NOW = "2021-01-18T10:10:26.179Z"
const TEST_NONCE = "123456789"

const _crypto_util = require("../crypto/_util")
let make_timestamp = _crypto_util.make_timestamp
let make_nonce = _crypto_util.make_nonce

const _validate_util = require("../validate/_util")
let make_now = _validate_util.make_now

const shims_on = () => {
    _crypto_util.make_timestamp = () => TEST_NOW
    _crypto_util.make_nonce = () => TEST_NONCE

    _validate_util.make_now = () => new Date(TEST_NOW)
}

const shims_off = () => {
    _crypto_util.make_timestamp = make_timestamp
    _crypto_util.make_nonce = make_nonce

    _validate_util.make_now = () => make_now
}

/**
 */
const write_json = async (json, filename) => {
    await fs.promises.writeFile(
        path.join(__dirname, "data", filename), 
        JSON.stringify(json, null, 2)
    )
}

/**
 */
const read_json = async (filename) => {
    return JSON.parse(await fs.promises.readFile(
        path.join(__dirname, "data", filename), 
        "utf8"
    ))
}

/**
 */
const write_yaml = async (json, filename) => {
    await fs.promises.writeFile(
        path.join(__dirname, "data", filename), 
        yaml.dump(json, {
            sortKeys: false,
            noRefs: true,
        })
    )
}

/**
 */
const read_yaml = async (filename) => {
    return yaml.load(await fs.promises.readFile(
        path.join(__dirname, "data", filename), 
        "utf8"
    ))
}

/**
 *  API
 */
exports.TEST_NOW = TEST_NOW
exports.TEST_NONCE = TEST_NONCE

exports.shims_on = shims_on
exports.shims_off = shims_off

exports.write_json = write_json
exports.read_json = read_json
exports.write_yaml = write_yaml
exports.read_yaml = read_yaml

/**
 *  tools/bin/sign.js
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

const _ = require("iotdb-helpers")
const ip = require("../..")

const fs = require("fs")
const jose = require("node-jose")
const path = require("path")

const _util = require("./_util")

const minimist = require("minimist")
const ad = minimist(process.argv.slice(2), {
    boolean: [
        "verbose", "trace", "debug",
    ],
    string: [
        "_",
        "file",
        "key",
        "verifier",
    ],
    alias: {
    },
    default: {
        "verifier": "",
    },
});

const help = message => {
    const name = "sign"

    if (message) {
        console.log(`${name}: ${message}`)
        console.log()
    }

    console.log(`\
usage: ${name} [options] [--file <file.json>] --key <private-key.pem> [--verifier <url>]

Required:

--key <private-key.pem> private key PEM

Options:

--file <file.json>      json file to sign, otherwise stdin is used
--verifier <url>        url to public key chain. If not used, you'll get output
                        but it will be tricky to verify / validate!
`)

    process.exit(message ? 1 : 0)
}

if (!ad.key) {
    help("--key argument is required")
}
if (ad.file === "-") {
    delete ad.file
}

_.logger.levels({
    debug: ad.debug || ad.verbose,
    trace: ad.trace || ad.verbose,
})

const run = async (files) => {
    const private_pem = await fs.promises.readFile(ad.key)
    const message = JSON.parse(ad.file ? await fs.promises.readFile(ad.file) : await _util.read_stdin())

    const signed = await ip.crypto.sign({
        payload: message, 
        private_key: private_pem, 
        verification: ad.verifier,
    })
    console.log(JSON.stringify(signed, null, 2))
}

run().catch(error => {
    console.log(error)
})


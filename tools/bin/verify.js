/**
 *  tools/bin/verify.js
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
const fetch = require("iotdb-fetch")
const fs = require("iotdb-fs")

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
        "in",
        "verifier",
    ],
    alias: {
    },
    default: {
    },
});

const help = message => {
    const name = "verify"

    if (message) {
        console.log(`${name}: ${message}`)
        console.log()
    }

    console.log(`\
usage: ${name} [options] [--file <file.json>] [--verifier <url>]

options:

--in <file.json>             json file to verify (otherwise stdin)
--verifier <public-key.pem>  use this public key PEM as the verifier
`)

    process.exit(message ? 1 : 0)
}

_.logger.levels({
    debug: ad.debug || ad.verbose,
    trace: ad.trace || ad.verbose,
})

const run = async (files) => {
    const message = JSON.parse(ad.in ? await fs.promises.readFile(ad.in, "utf-8") : await _util.read_stdin())

    const verified = await ip.crypto.verify(message, async proof => {
        if (_.is.AbsoluteURL(ad.verifier)) {
            const sd = await _.promise({})
                .then(fetch.document.get(ad.verifier))
            return sd.document
        } else if (_.is.String(ad.verifier)) {
            return fs.promises.readFile(ad.verifier, "utf-8")
        } else {
            const sd = await _.promise({})
                .then(fetch.document.get(proof.verificationMethod))
            return sd.document
        }
    })

    console.log(JSON.stringify(verified, null, 2))
}

run().catch(error => {
    console.log(error)
})


/*
 *  bin/validate.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-01-13
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
const tools = require("..")

const _util = require("./_util")

const minimist = require("minimist")
const ad = minimist(process.argv.slice(2), {
    boolean: [
        "verbose", "trace", "debug",
        "pretty",
		"clear",
    ],
    string: [
        "url",
        "_",
    ],
    alias: {
    },
    default: {
    },
});

const help = message => {
    const name = "validate"

    if (message) {
        console.log(`${name}: ${message}`)
        console.log()
    }

    console.log(`\
usage: ${name} [options] <url>

one of these is 

--pretty        format the output the best you can
--clear         clear screen when result found
`)

    process.exit(message ? 1 : 0)
}

if (!ad.url && ad._.length) {
    ad.url = ad._.shift()
}

if (!ad.url) {
    help("url argument is required")
}

_.logger.levels({
    debug: ad.debug || ad.verbose,
    trace: ad.trace || ad.verbose,
})

/**
 */
_.promise({
    url: ad.url,
})
    .then(_util.verify_url)
    .make(sd => {
        if (!ad.pretty) {
            console.log(JSON.stringify(sd.verified, null, 2))
        } else {
            console.clear()
        }
    })
    .conditional(ad.pretty, _util.pretty)

    .except(error => {
        delete error.self
        console.log(error)

        console.log("#", _.error.message(error))
    })

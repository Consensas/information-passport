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
        "json",
        "silent",
    ],
    string: [
        "in",
        "url",
        "rules",
        "certs",
        "_",
        "certs",
    ],
    alias: {
        "in": "url",
    },
    default: {
        "rules": null,
        "certs": null,
    },
});

const help = message => {
    const name = "validate"

    if (message) {
        console.log(`${name}: ${message}`)
        console.log()
    }

    console.log(`\
usage: ${name} [options] 

input options:

--in <url|file>    input document (URL or file)

fomatting options:

--silent           don't output anything
--json             format the output as JSON (the default)
--pretty           format the output the best you can 
--clear            clear screen when result found

rule options (one of these are required):

--no-rules          don't validate against rule set
--rules <url|file>  where to get rules (URL or file)

certificate options (one of these are required):

--no-certs          don't validate against certs
--certs <url|file>  where to get certs (URL or file)

The the rules and certificates options are defined in a 
JSON or YAML document.

Please see: (URL to documentation here)
`)

    process.exit(message ? 1 : 0)
}

if (!ad.in && ad._.length) {
    ad.in = ad._.shift()
}

if (!ad.in) {
    help("--in <url|file> is required")
}

if (_.is.Null(ad.rules)) {
    help("--no-rules or --rules <url|file> is required")
}
if (_.is.Null(ad.certs)) {
    help("--no-certs or --certs <url|file> is required")
}

_.logger.levels({
    debug: ad.debug || ad.verbose,
    trace: ad.trace || ad.verbose,
})

/**
 */
_.promise({
    rules: null,
    certs: null,
})
    .conditional(ad.certs, _util.load_certs.p(ad.certs))
    .conditional(ad.rules, _util.load_rules.p(ad.rules))
    .then(_util.verify.p(ad.in))
    .make(async sd => {
        if (sd.rules) {
            ip.validate.with.rules(sd.validated, sd.rules)
        }
        if (sd.certs) {
            ip.validate.with.certs(sd.validated, sd.certs)
        }
    })
    .make(sd => {
        if (ad.silent) {
        } else if (!ad.pretty) {
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

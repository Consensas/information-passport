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
const fs = require("iotdb-fs")
const fetch = require("iotdb-fetch")

const ip = require("../..")
const tools = require("..")

const path = require("path")
const process = require("process")

const colors = require("colors")
const jose = require("node-jose")

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

--raw           don't validate, just show the contents
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
const _pretty = _.promise((self, done) => {
    _.promise(self)
        .validate(_pretty)

        .then(tools.projects.initialize)
        .add("verified/payload/@type:data_type")
        .then(tools.projects.by_data_type)
        .then(tools.projects.required)

        .make(sd => {
			if (ad.clear) {
				console.clear()
			}

            _.d.list(sd.project, "groups", []).forEach(group => {
                console.log(colors.green(group.name))
                _.d.list(group, "nodes", []).forEach(node => {
                    console.log(`  ${node.name}: ` + colors.cyan(_.d.first(sd.verified.payload, node.id, "")))
                })
            })

            if (sd.verified.chain.length) {
                // console.log(colors.green("Verified by"))
                console.log(`  Issuer: ` + colors.cyan(sd.verified.chain[sd.verified.chain.length - 1].O))
            }
        })

        .end(done, self, _pretty)
})

_pretty.method = "_pretty"
_pretty.description = ``
_pretty.requires = {
    verified: {
        payload: _.is.Dictionary,
    },
}
_pretty.accepts = {
}
_pretty.produces = {
}

/**
 */
const _one_url = _.promise((self, done) => {
    _.promise(self)
        .validate(_one_url)

        .then(fetch.document.get({
            url: ad.url,
            headers: {
                "accept": "application/vc+ld+json",
            },
        }))
        .make(async sd => {
            if (ad.clear) {
                console.clear()
                console.log("checking…")
            }

            sd.json = JSON.parse(sd.document)

            if (ad.raw) {
                console.log(JSON.stringify(sd.json, null, 2))
                return
            }

            sd.verified = await ip.jws.verify(sd.json, async proof => {
                const result = await _.promise({})
                    .then(fetch.document.get(proof.verificationMethod))

                return result.document
            })

            if (!ad.pretty) {
                console.log(JSON.stringify(sd.verified, null, 2))
            }
        })
        .conditional(ad.pretty, _pretty)

        .end(done, self, _one_url)
})

_one_url.method = "_one_url"
_one_url.description = ``
_one_url.requires = {
    url: _.is.AbsoluteURL,
}
_one_url.accepts = {
}
_one_url.produces = {
}

/**
 */
_.promise({
    url: ad.url,
})
    .then(_one_url)
    .except(error => {
        delete error.self
        console.log(error)

        console.log("#", _.error.message(error))
    })

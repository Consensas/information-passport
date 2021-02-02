/**
 *  tools/bin/_util.js
 *
 *  David Janes
 *  Consensas
 *  2021-01-19
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
const fetch = require("iotdb-fetch")

const ip = require("../..")
const tools = require("..")

const colors = require("colors")

/**
 */
const read_stdin = () => {
    return new Promise((resolve, reject) => {
        process.stdin.resume()
        process.stdin.setEncoding("utf8")

        let buffer = ""

        process.stdin.on("data", chunk => buffer += chunk)
        process.stdin.on("end", () => resolve(buffer))
    })
}

/**
 */
const pretty = _.promise((self, done) => {
    _.promise(self)
        .validate(pretty)

        .make(sd => {
            sd.claim = _.d.first(sd, "verified/payload/vc:credentialSubject", null)
            sd.data_type = _.d.first(sd.claim, "@type", null)
        })
        .then(tools.projects.initialize)
        .then(tools.projects.by_data_type)
        .then(tools.projects.required)

        .make(sd => {
            _.d.list(sd.project, "groups", []).forEach(group => {
                console.log(colors.green(group.name))
                _.d.list(group, "nodes", []).forEach(node => {
                    console.log(`  ${node.name}: ` + colors.cyan(_.d.first(sd.claim, node.id, "")))
                })
            })

            if (sd.verified.chain.length) {
                console.log(`  Issuer: ` + colors.cyan(sd.verified.chain[sd.verified.chain.length - 1].O))
            }
        })

        .end(done, self, pretty)
})

pretty.method = "pretty"
pretty.description = ``
pretty.requires = {
    verified: {
        payload: _.is.Dictionary,
    },
}
pretty.accepts = {
}
pretty.produces = {
}

/**
 */
const verify_url = _.promise((self, done) => {
    _.promise(self)
        .validate(verify_url)

        .then(fetch.document.get({
            url: null,
            headers: {
                "accept": "application/vc+ld+json",
            },
        }))
        .make(async sd => {
            sd.json = JSON.parse(sd.document)

            sd.verified = await ip.crypto.verify(sd.json, async proof => {
                const result = await _.promise({})
                    .then(fetch.document.get(proof.verificationMethod))

                return result.document
            })
        })

        .end(done, self, verify_url)
})

verify_url.method = "verify_url"
verify_url.description = ``
verify_url.requires = {
    url: _.is.AbsoluteURL,
}
verify_url.accepts = {
}
verify_url.produces = {
    verified: _.is.Dictionary,
}

/**
 */
const verify_path = _.promise((self, done) => {
    _.promise(self)
        .validate(verify_path)

        .then(fs.read.json)
        .make(async sd => {
            sd.verified = await ip.crypto.verify(sd.json, async proof => {
                const result = await _.promise({})
                    .then(fetch.document.get(proof.verificationMethod))

                return result.document
            })
        })

        .end(done, self, verify_path)
})

verify_path.method = "verify_path"
verify_path.description = ``
verify_path.requires = {
    path: _.is.String,
}
verify_path.accepts = {
}
verify_path.produces = {
    verified: _.is.Dictionary,
}

/**
 */
exports.pretty = pretty
exports.read_stdin = read_stdin
exports.verify_url = verify_url
exports.verify_path = verify_path

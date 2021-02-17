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
const fs = require("iotdb-fs")

const ip = require("../..")
const tools = require("..")

const colors = require("colors")

/**
 */
const verify = _.promise((self, done) => {
    _.promise(self)
        .validate(verify)

        .then(_load_json)
        .make(async sd => {
            if (sd.is_claim) {
                const vc = {
                    "@context": {
                        "schema": "http://schema.org/",
                        "security": "https://w3id.org/security#",
                        "vc": "https://www.w3.org/2018/credentials/v1"
                    },
                    "@type": [
                        "vc:VerifiableCredential",
                        "vc:HealthCredential"
                    ],
                    "vc:issuer": "https://passport.consensas.com",
                    "vc:issuanceDate": _.timestamp.make(),
                    "vc:credentialSubject": sd.json,
                }

                sd.verified = {
                    payload: vc,
                    claim: sd.json,
                    types: [ "vc:VerifiableCredential", "vc:HealthCredential" ],
                    chain: [],
                    proof: {},
                }
            } else {
                sd.verified = await ip.crypto.verify(sd.json, {
                    fetch_key: async proof => {
                        const result = await _.promise({})
                            .then(fetch.document.get(proof.verificationMethod))

                        return result.document
                    },
                })
            }

        })

        .end(done, self, verify)
})

verify.method = "_util.verify"
verify.description = ``
verify.requires = {
    in: [ _.is.String, _.is.AbsoluteURL ],
}
verify.accepts = {
    is_claim: _.is.Boolean,
}
verify.produces = {
    verified: _.is.Dictionary,
}
verify.params = {
    in: _.p.normal,
    is_claim: _.p.normal,
}
verify.p = _.p(verify)

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
        .then(tools.schemas.initialize)
        .then(tools.schemas.by_data_type)
        .then(tools.schemas.required)

        .make(sd => {
            _.d.list(sd.schema, "groups", []).forEach(group => {
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
const _load_json = _.promise((self, done) => {
    _.promise.validate(self, _load_json)

    _.promise(self)
        .conditional(!_.is.AbsoluteURL(self.in), fs.read.yaml.p(self.in))
        .conditional(!_.is.AbsoluteURL(self.in), _.promise.bail)

        .then(fetch.json.get({
            url: self.in,
            headers: {
                "accept": "application/vc+ld+json",
            },
        }))

        .end(done, self, _load_json)
})

_load_json.method = "_util._load_json"
_load_json.description = `
    Load JSON data, from the web or the FS, depending in "in"
`
_load_json.requires = {
    in: [ _.is.String, _.is.AbsoluteURL ],
}
_load_json.produces = {
    json: _.is.JSON,
}

/**
 */
const load_certs = _.promise((self, done) => {
    _.promise(self)
        .validate(load_certs)

        .then(_load_json)
        .make(sd => {
            sd.certs = _.d.list(sd.json, "certs", [])
                .filter(cert => cert)
                .map(d => cert.fingerprint ? cert.fingerprint : cert)
                .filter(cert => _.is.String(cert))
        })

        .end(done, self, load_certs)
})

load_certs.method = "_util.load_certs"
load_certs.description = ``
load_certs.requires = {
    in: [ _.is.String, _.is.AbsoluteURL ],
}
load_certs.accepts = {
}
load_certs.produces = {
    certs: _.is.Array,
}
load_certs.params = {
    in: _.p.normal,
}
load_certs.p = _.p(load_certs)


/**
 */
const load_rules = _.promise((self, done) => {
    _.promise(self)
        .validate(load_rules)

        .then(_load_json)
        .make(sd => {
            sd.rules = _.d.list(sd.json, "rules", [])
                .filter(rule => _.is.Dictionary(rule))
        })

        .end(done, self, load_rules)
})

load_rules.method = "_util.load_rules"
load_rules.description = ``
load_rules.requires = {
    in: [ _.is.String, _.is.AbsoluteURL ],
}
load_rules.accepts = {
}
load_rules.produces = {
    rules: _.is.Array,
}
load_rules.params = {
    in: _.p.normal,
}
load_rules.p = _.p(load_rules)

/**
 */
const lint = _.promise((self, done) => {
    _.promise(self)
        .validate(lint)

        .make(sd => {
            sd.verified.lints = []
            sd.data_type = _.d.first(sd.verified.claim, "@type", null)
        })
        .then(tools.schemas.initialize)
        .then(tools.schemas.by_data_type)
        .conditional(sd => !sd.schema, _.promise.bail)
        .then(tools.schemas.lint)

        .end(done, self, lint)
})

lint.method = "lint"
lint.description = ``
lint.requires = {
    verified: {
        claim: _.is.Dictionary,
    },
}
lint.accepts = {
}
lint.produces = {
}

/**
 */
exports.pretty = pretty
exports.read_stdin = read_stdin
exports.verify = verify
exports.load_certs = load_certs
exports.load_rules = load_rules
exports.lint = lint

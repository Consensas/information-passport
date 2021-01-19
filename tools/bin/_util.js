/**
 *  tools/bin/_util.js
 *
 *  David Janes
 *  Consensas
 *  2021-01-19
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

        .then(tools.projects.initialize)
        .add("verified/payload/@type:data_type")
        .then(tools.projects.by_data_type)
        .then(tools.projects.required)

        .make(sd => {
            _.d.list(sd.project, "groups", []).forEach(group => {
                console.log(colors.green(group.name))
                _.d.list(group, "nodes", []).forEach(node => {
                    console.log(`  ${node.name}: ` + colors.cyan(_.d.first(sd.verified.payload, node.id, "")))
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

            sd.verified = await ip.jws.verify(sd.json, async proof => {
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
exports.pretty = pretty
exports.read_stdin = read_stdin
exports.verify_url = verify_url

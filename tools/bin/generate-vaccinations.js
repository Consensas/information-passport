/**
 *  tools/bin/generate-vaccinations.js
 *
 *  David Janes
 *  Consensas
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

const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")

const ip = require("../..")
const tools = require("..")

const path = require("path")

const minimist = require("minimist")
const ad = minimist(process.argv.slice(2), {
    boolean: [
        "verbose", "trace", "debug",
    ],
    string: [
        "_",
        "key",
        "verifier",
    ],
    alias: {
    },
    default: {
    },
});

const help = message => {
    const name = "generate-vaccinations"

    if (message) {
        console.log(`${name}: ${message}`)
        console.log()
    }

    console.log(`\
usage: ${name} [options] 

Generate a complete folder of Vaccination 
Records which can be served by HTTP like
Apache or NGINX

The methods used in here can be adapted to 
your own organization's needs.

Required:

--key <private-key.pem> private key PEM
--verifier <url>        url to public key chain PEM 
`)

    process.exit(message ? 1 : 0)
}

if (!ad.key) {
    help("--key argument is required")
}
if (!ad.verifier) {
    help("--verifier argument is required")
}

_.logger.levels({
    debug: ad.debug || ad.verbose,
    trace: ad.trace || ad.verbose,
})

const DOT = "•"

/**
 */
const _html = _.promise((self, done) => {
    const colors = require("colors")

    const _encode = s => s;

    _.promise(self)
        .validate(_html)

        .then(fs.read.utf8.p(path.join(__dirname, "../data/vaccination-template.html")))
        .add("document:template")

        .then(tools.projects.initialize)
        .add("json/@type:data_type")
        .then(tools.projects.by_data_type)
        .then(tools.projects.required)

        .make(sd => {
            const lines = []
            lines.push("<h1>Vaccination Passport</h2>")

            _.d.list(sd.project, "groups", []).forEach(group => {
                lines.push("<h2>")
                lines.push(_encode(group.name))
                lines.push("</h2><ul>")
                _.d.list(group, "nodes", []).forEach(node => {
                    lines.push("<li>")
                    lines.push(`${node.name}: `)
                    lines.push(_.d.first(sd.json, node.id, ""))
                    lines.push("</li>")
                })
                lines.push("</ul>")
            })

            sd.document = sd.template.replace("CONTENT", lines.join("\n"))
            sd.path = `website/${sd.record.code}.html`
        })
        .then(fs.make.directory.parent)
        .then(fs.write.utf8)
        .log("path", "path")

        .end(done, self, _html)
})

_html.method = "_html"
_html.description = ``
_html.requires = {
    json: _.is.JSON,
    record: {
        code: _.is.String,
    },
}
_html.accepts = {
}
_html.produces = {
}

/**
 */
const _one = _.promise((self, done) => {
    _.promise(self)
        .validate(_one)

        .make(sd => {
            sd.did = `did:example:${sd.record.code}`
            sd.treatmentDate = "2021-01-01"
        })

        // Redaction
        .make(sd => {
            let value

            value = _.d.first(sd.record, "birthDate")
            if (value) {
                value = `${value}`
                value = value.substring(0, value.length - 2).replace(/\d/g, DOT) +
                    value.substring(value.length - 2)
                sd.record["birthDate"] = value
            }

            value = _.d.first(sd.record, "card/identifier")
            if (value) {
                value = `${value}`
                value = value.substring(0, value.length - 4).replace(/\d/g, DOT) +
                    value.substring(value.length - 4)
                _.d.set(sd.record, "card/identifier", value)
            }
        })

        // Hospital
        .then(tools.templates.by_name.p("Hospital"))
        .then(tools.templates.fill.p({
            "schema:address/schema:addressCountry": "record/hospital/country",
            "schema:address/schema:addressRegion": "record/hospital/region",
            "schema:address/schema:addressLocality": "record/hospital/locality",
            'schema:name': "record/hospital/name",
        }))
        .add("result:Hospital")

        // Patient
        .then(tools.templates.by_name.p("Patient"))
        .then(tools.templates.fill.p({
            'schema:additionalName': null, 
            'schema:birthDate': "record/birthDate",
            'schema:familyName': "record/familyName",
            'schema:givenName': "record/givenName",
        }))
        .add("result:Patient")

        // Health Card
        .then(tools.templates.by_name.p("Permit-HealthCard"))
        .then(tools.templates.fill.p({
            "schema:identifier-healthCard": "record/card/identifier",
            "schema:issuedBy": "record/card/issuer",
            "schema:validUntil": "record/card/expires",
        }))
        .add("result:HealthCard")

        // Drug
        .then(tools.templates.by_name.p("Drug-Moderna"))
        .then(tools.templates.fill.p({}))
        .add("result:Drug")

        // COVID
        .then(tools.templates.by_name.p("MedicalCondition-COVID19"))
        .then(tools.templates.fill.p({}))
        .add("result:MedicalCondition")

        // Vaccination
        .then(tools.templates.by_name.p("MedicalTherapy-Vaccination"))
        .then(tools.templates.fill.p({
            "schema:drug": "Drug",
            "schema:healthCondition": "MedicalCondition",
        }))
        .add("result:MedicalCondition")

        // Vaccination Record
        .then(tools.templates.by_name.p("MedicalRecord-Vaccination"))
        .then(tools.templates.fill.p({
            "schema:identifier": null,
            "schema:name": null,
            "schema:patient": "Patient",
            "schema:permit-healthCard": "HealthCard",
            "schema:primaryPrevention": "MedicalCondition",
            "schema:location": "Hospital",
            "schema:treatmentDate": "treatmentDate",
            "w3did:id": "did",
        }))
        .add("result:MedicalRecord")

        // sign
        // write signed JSON
        .make(async sd => {
            sd.json = await ip.jws.sign(sd.MedicalRecord, sd.private_pem, ad.verifier)
            sd.path = `website/${sd.record.code}.json`
        })


        // write the JSON
        .then(fs.make.directory.parent)
        .then(fs.write.json.pretty)
        .log("path", "path")

        // write the HTML
        .then(_html)


        .end(done, self, _one)
})

_one.method = "_one"
_one.description = ``
_one.requires = {
    record: {
        code: _.is.String,
    },
    verifier: _.is.String,
    private_pem: _.is.String,
}
_one.accepts = {
}
_one.produces = {
}

/**
 */
_.promise()
    .make(async sd => {
        sd.private_pem = await fs.promises.readFile(ad.key, "utf8")
        sd.verifier = ad.verifier
    })

    .then(tools.templates.initialize)
    .then(tools.projects.initialize)

    .add("path", path.join(__dirname, "../data/fake-records.yaml"))
    .then(fs.read.json.magic)
    .make(sd => {
        sd.records = sd.json // .slice(0, 1)
    })
    .each({
        method: _one,
        inputs: "records:record",
    })
    .except(error => {
        console.log("#", _.error.message(error))
    })

/**
 *  tools/bin/fake.js
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
    ],
    alias: {
    },
    default: {
    },
});

const help = message => {
    const name = "fake-http"

    if (message) {
        console.log(`${name}: ${message}`)
        console.log()
    }

    console.log(`\
usage: ${name} [options] 

Generate a complete folder of Vaccination 
Records which can be served by HTTP like
Apache or NGINX

options:
`)

    process.exit(message ? 1 : 0)
}

_.logger.levels({
    debug: ad.debug || ad.verbose,
    trace: ad.trace || ad.verbose,
})

/**
 */
const _one = _.promise((self, done) => {
    _.promise(self)
        .validate(_one)

        .make(sd => {
            sd.did = `did:example:${sd.record.code}`
            sd.treatmentDate = "2021-01-01"
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

        .make(sd => {
            console.log(sd.MedicalCondition)
            console.log(sd.MedicalRecord)
        })


        .end(done, self, _one)
})

_one.method = "_one"
_one.description = ``
_one.requires = {
    record: _.is.Dictionary,
}
_one.accepts = {
}
_one.produces = {
}

/**
 */
_.promise()
    .then(tools.templates.initialize)

    .add("path", path.join(__dirname, "../data/fake-records.yaml"))
    .then(fs.read.json.magic)
    .make(sd => {
        sd.records = sd.json.slice(0, 1)
    })
    .each({
        method: _one,
        inputs: "records:record",
    })
    .except(error => {
        console.log("#", _.error.message(error))
    })

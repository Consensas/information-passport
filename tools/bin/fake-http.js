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
        .log("record", "templated")
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
    .make(sd => {
        console.log(sd.templated)
    })

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

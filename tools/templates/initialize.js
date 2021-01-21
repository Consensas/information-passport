/*
 *  tools/tools/initialize.js
 *
 *  David Janes
 *  Consenas.com
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
const fs = require("iotdb-fs")

const path = require("path")

/**
 */
const initialize = _.promise((self, done) => {
    _.promise(self)
        .validate(initialize)

        .add({
            path: path.join(__dirname, "../../data/templates"),
            fs$filter_name: name => name.endsWith(".yaml") || name.endsWith(".json"),
        })
        .then(fs.list)
        .then(fs.all(fs.read.json.magic))
		.make(sd => {
            sd.templated = {}
            sd.jsons.forEach((template, templatex) => {
                if (!template) {
                    return
                }

                const name = path.basename(sd.paths[templatex]).replace(/[.][^.]*$/, "")

                sd.templated[name] = template
            })
		})

        .end(done, self, initialize)
})

initialize.method = "templates.initialize"
initialize.description = ``
initialize.requires = {
}
initialize.accepts = {
}
initialize.produces = {
    templated: _.is.Dictionary,
}

/**
 *  API
 */
exports.initialize = initialize

/*
 *  tools/templates/fill.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-01-21
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
const errors = require("iotdb-errors")

/**
 */
const fill = _.promise(self => {
    _.promise.validate(self, fill)

    const result = _.d.clone.deep(self.template)

    _.mapObject(self.filld, (from_key, to_key) => {
        const value = _.d.first(self, from_key)
        if (_.is.JSON(value)) {
            _.d.set(result, to_key, value)
        }
    })

    console.log(result)
})

fill.method = "templates.fill"
fill.description = ``
fill.requires = {
    template: _.is.Dictionary,
    filld: _.is.Dictionary,
}
fill.accepts = {
    variable: _.is.String,
}
// fill.produces = {} // changes depending on variable
fill.params = {
    filld: _.p.normal,
    variable: _.p.normal,
}
fill.p = _.p(fill)

/**
 *  API
 */
exports.fill = fill

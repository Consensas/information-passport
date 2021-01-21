/*
 *  tools/templates/by_name.js
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
const by_name = _.promise(self => {
    _.promise.validate(self, by_name)

    self.template = self.templated[self.name]

    if (!self.template) {
        throw new errors.NotFound(`template "${self.name}" not found`)
    }
})

by_name.method = "templates.by_name"
by_name.description = ``
by_name.requires = {
    templated: _.is.Dictionary,
    name: _.is.String,
}
by_name.accepts = {
}
by_name.produces = {
    template: _.is.Dictionary,
}
by_name.params = {
    name: _.p.normal,
}
by_name.p = _.p(by_name)

/**
 *  API
 */
exports.by_name = by_name

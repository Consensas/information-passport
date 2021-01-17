/*
 *  tools/tools/required.js
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
const errors = require("iotdb-errors")

/**
 */
const required = _.promise(self => {
    if (!self.project) {
        throw new errors.NotFound("project not found")
    }
})

required.method = "projects.required"
required.description = ``
required.requires = {
}
required.accepts = {
}
required.produces = {
}

/**
 *  API
 */
exports.required = required

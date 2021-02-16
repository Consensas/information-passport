/*
 *  tools/tools/by_data_type.js
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

/**
 */
const by_data_type = _.promise(self => {
    _.promise.validate(self, by_data_type)

    self.schema = self.schemas.find(schema => schema.data_type === self.data_type) || null
})

by_data_type.method = "schemas.by_data_type"
by_data_type.description = ``
by_data_type.requires = {
    schemas: _.is.Array,
    data_type: _.is.String,
}
by_data_type.accepts = {
}
by_data_type.produces = {
    schema: _.is.Dictionary,
}
by_data_type.params = {
    data_type: _.p.normal,
}
by_data_type.p = _.p(by_data_type)


/**
 *  API
 */
exports.by_data_type = by_data_type

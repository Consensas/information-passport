/*
 *  tools/tools/lint.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-02-16
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
const _lint_Text = (node, value, lints) => {
}

/**
 */
const _lint_Integer = (node, value, lints) => {
}

/**
 */
const _lint_Date = (node, value, lints) => {
    if (!_.is.String(value)) {
        lints.push({
            id: node.id,
            issue: `field was expected to be a string`
        })
        return
    }

    let match
    if (match = value.match(/^(\d\d\d\d)$/)) {
    } else if (match = value.match(/^(\d\d\d\d)-(\d\d)$/)) {
    } else if (match = value.match(/^(\d\d\d\d)-(\d\d)-(\d\d)$/)) {
    } else if (match = value.match(/^(\d\d\d\d)-(\d\d)-(\d\d)[T ]/)) {
    } else {
        lints.push({
            id: node.id,
            issue: `field value (${value}) did not match any known date formats`,
        })
    }
}

/**
 */
const _lint_XXX = (node, value, lints) => {
}

/**
 *  This doesn't deal with arrays very well
 */
const lint = _.promise(self => {
    const lints = []

    _.d.list(self.schema, "groups", []).forEach(group => {
        _.d.list(group, "nodes", []).forEach(node => {
            const values = _.d.list(self.verified.claim, node.id)
            if (!values) {
                if (node.required) {
                    lints.push({
                        id: node.id,
                        issue: "field is required but is missing",
                    })
                } else if (node.recommended) {
                    lints.push({
                        id: node.id,
                        issue: "field is recommended but is missing",
                    })
                /*
                } else if (node.expected) {
                    lints.push({
                        id: node.id,
                        issue: "field had expected value but is missing",
                    })
                    */
                }

                return
            }

            values.forEach(value => {
                if (node.expected) {
                    const xs = _.coerce.list(node.expected)
                    if (xs.indexOf(value) === -1) {
                        lints.push({
                            id: node.id,
                            issue: `field value (${value}) not expected (expected: ${xs.join(", ")})`,
                        })
                    }
                }

                switch (node.data_type || "schema:Text") {
                case "schema:Text": _lint_Text(node, value, lints); break
                case "schema:Integer": _lint_Integer(node, value, lints); break
                case "schema:Date": _lint_Date(node, value, lints); break
                }
            })
        })
        
    })

    self.verified.lints = lints
})

lint.method = "schemas.lint"
lint.description = ``
lint.requires = {
    schema: _.is.Dictionary,
    verified: {
        claim: _.is.Dictionary,
    },
}
lint.accepts = {
}
lint.produces = {
    verified: {
        lints: _.is.Array,
    },
}

/**
 *  API
 */
exports.lint = lint

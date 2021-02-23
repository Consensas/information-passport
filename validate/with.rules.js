/*
 *  validate/with.rules.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-02-02
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

const _ = require("lodash")

const _coerce_list = v => {
    if (_.isNull(v)) {
        return []
    } else if (_.isUndefined(v)) {
        return []
    } else if (_.isArray(v)) {
        return v
    } else {
        return [ v ]
    }
}
/**
 *  This will return a new verified, with
 *  "rule_accepts" (rules that accept this payload)
 *  and "rule_rejects" (rules that reject this payload)
 *
 *  rule.credential 
 *  - can be value or array
 *  - if present, at least one of the VC @type/type has to match
 *
 */
const with_rules = async (verified, rules) => {
    const ip = require("..")
    const sift = require("sift")

    verified = Object.assign({}, verified)
    verified.rule_accepts = []
    verified.rule_rejects = []

    const payload = verified.payload || {}

    for (let rule of rules) {
        if (rule.credential) {
            const payload_credentials = _coerce_list(payload["@type"] || payload.type)
            const rule_credentials = _coerce_list(rule.credential)

            if (!_.intersection(payload_credentials, rule_credentials).length) {
                continue
            }
        }

        const payload_subject = payload["vc:credentialSubject"]
        const rule_subject = rule.credentialSubject || {}

        const paramd = {
            operations: ip.validate.operations,
        }

        const outs = [ payload_subject ].filter(sift(rule_subject, paramd))
        if (outs.length === 0) {
            continue
        }

        if (rule.reject) {
            verified.rule_rejects.push(rule)
        } else {
            verified.rule_accepts.push(rule)
        }
        
    }

    // console.log("with rules called", rules)

    return verified
}

/**
 *  API
 */
exports.rules = with_rules

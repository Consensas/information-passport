/*
 *  validate/operations.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-01-28
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

const sift = require("sift")
const fns = require("date-fns")
const duration = require("iso8601-duration")

const _util = require("./_util")

/**
 */
const _gte$days = (date, rule, value) => {
    let when = fns.addDays(_util.make_now(), -rule)
    when = fns.startOfDay(when)
    when = fns.formatISO(when)
    when = when.substring(0, 10)

    return value >= when
}

/**
 */
const $gte$days = (rule, query, options) => {
    return sift.createEqualsOperation(
        value => _gte$days(new Date(), rule, value),
        query,
        options
    )
}

$gte$days.underlying = _gte$days

/**
 *  API
 */
exports.operations = {
    $gte$days: $gte$days,
}

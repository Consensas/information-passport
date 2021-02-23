/**
 *  is/_util.js
 *
 *  David Janes
 *  Consensas
 *  2021-02-23
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
const _util = require("./_util")
const errors = require("../errors")

/**
 */
const is = (o, test, name) => {
    if (test(o)) {
        return
    }

    throw new errors.DataError(null, name, o)
}

/**
 */
const or = (...tests) => o => {
    for (let test of tests) {
        if (test(o)) {
            return true
        }
    }

    return false
}


/**
 */
const isAtomic = o => {
    if (_.isNull(o)) {
        return true
    } else if (_.isString(o)) {
        return true
    } else if (_.isNumber(o)) {
        return true
    } else if (_.isBoolean(o)) {
        return true
    } else {
        return false
    }
}

/**
 */
const isJSON = o => {
    if (_.isPlainObject(o)) {
        return !_.findKey(o, so => !isJSON(so))
    } else if (_.isArray(o)) {
        for (let so of o) {
            if (!isJSON(so)) {
                return false
            }
        }

        return true
    } else if (isAtomic(o)) {
        return true
    } else {
        return false
    }
}

/**
 */
const isArrayOf = test => o => {
    if (!_.isArray(o)) {
        return false
    }

    for (let so of o) {
        if (!test(so)) {
            return false
        }
    }

    return true
}

/**
 */
exports.is = is
exports.or = or
exports.isJSON = isJSON
exports.isArrayOf = isArrayOf

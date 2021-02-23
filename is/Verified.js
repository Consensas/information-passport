/**
 *  is/Verified.js
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

/**
 */
exports.Verified = verified => {
    _util.is(verified, _.isPlainObject, "Verified")
    _util.is(verified.proof, _util.or(_.isPlainObject, _.isNull), "Verified.proof")
    _util.is(verified.json, _util.isJSON, "Verified.json")
    _util.is(verified.credentialTypes, _util.isArrayOf(_.isString), "Verified.credentialTypes")
    _util.is(verified.chain, _util.isArrayOf(_.isPlainObject), "Verified.json")
}

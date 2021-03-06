/*
 *  index.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-01-12
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

module.exports = {
    errors: require("./errors"),
    crypto: require("./crypto"),
    validate: require("./validate"),
    is: require("./is"),
}

module.exports.context = {
    "schema": "http://schema.org/",
    "vc": "https://www.w3.org/2018/credentials/v1/",
}

module.exports.level = {
    TRACE: 10,
    DEBUG: 20,
    INFO: 30,
    WARN: 40,
    ERROR: 50,
    FATAL: 60,
}

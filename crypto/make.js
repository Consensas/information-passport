/**
 *  crypto/make.js
 *
 *  David Janes
 *  Consensas
 *  2021-02-17
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

const _util = require("./_util")
const jsonld = require("jsonld")

/**
 */
const make = async (paramd) => {
    const ip = require("..")

    paramd = Object.assign({}, paramd || {})
    paramd.context = paramd.context ?? ip.context

    const vc = {
        "@context": paramd.context,
        "@type": _util.coerce.list(paramd.credentialTypes, [ "vc:VerifiableCredential" ]),
        "vc:issuer": paramd.issuer ?? "https://passport.consensas.com",
        "vc:issuanceDate": paramd.issuanceDate ?? _util.make_timestamp(),
        "vc:credentialSubject": await jsonld.compact(paramd.credentialSubject, paramd.context),
    }

    return vc
}

/**
 */
exports.make = make

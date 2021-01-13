/*
 *  bin/validate.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-01-13
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
const fs = require("iotdb-fs")
const fetch = require("iotdb-fetch")
const ip = require("..")

const path = require("path")
const jose = require("node-jose")

_.logger.levels({
    debug: false,
    trace: false,
})

_.promise()
    .then(fetch.json.get("https://consensas.world/did/did:cns:ABHEZDOYLE?action_type=sign&action_id=signed"))
    .make(async sd => {
        const v = await ip.jws.verify(sd.json, async proof => {
            const result = await _.promise({})
                .then(fetch.document.get(proof.verificationMethod))

            const public_pem = result.document
            const public_key = await jose.JWK.asKey(public_pem, 'pem');

            return public_key
        })
        console.log(JSON.stringify(v, null, 2))
    })
    .except(error => {
        delete error.self
        console.log(error)

        console.log("#", _.error.message(error))
    })

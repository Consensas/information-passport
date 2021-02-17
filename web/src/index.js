/*
 *  web/src/index.js
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

import _ from 'lodash';
import ip from "../..";
import fetch from "node-fetch";
import $ from "jquery";

const DID_EXAMPLE = "https://passport.consensas.com/"
const didd = {
    "did:cns:": "https://consensas.world/",
    "did:example:": DID_EXAMPLE,
}

// import Html5QrcodeScanner from "../qr/html5-qrcode-scanner.js";

const mapping = {
    'id': "ID",
    'patient/givenName': "First Name",
    'patient/additionalName': "Middle Name",
    'patient/familyName': "Last Name",
    'patient/birthDate': "DOB",
    'patient/healthCard/identifier-healthCard': "Health Card",
    'patient/healthCard/issuedBy': "Issuer",
    'patient/healthCard/validUntil': "Expiry",
    'primaryPrevention/name': "Treatment",
    'immunizationDate': "Treatment Date",
}

const flatten = o => {
    const d = {}

    const _flatten = (o, p) => {
        while (_.isArray(o)) {
            o = o[0]
        }

        if (_.isObject(o)) {
            _.mapValues(o, (value, key) => {
                _flatten(value, [].concat(p, [ key.replace(/^.*:/, "") ]))
            })
        } else if (_.isString(o)) {
            d[p.join("/")] = o
        }
    }

    _flatten(o, [])

    return d
}

const validate = async url => {
    console.log("URL", url)

    try {
        console.log("-", "fetch json", url)

        const response = await fetch(url, {
            headers: {
                accept: "application/vc+ld+json",
            },
        })
        const json = await response.json();
        const verified = await ip.crypto.verify(json, {
            fetch_chain: async proof => {
                console.log("-", "fetch verification", proof.verificationMethod)
                const vresponse = await fetch(proof.verificationMethod)
                const vtext = await vresponse.text()

                return vtext
            },
        })

        // hack - should be just "vc:credentialSubject"
        console.log("-", "display verified")
        const fd = flatten(verified.payload["vc:credentialSubject"] || verified.payload)
        const dl = $("dl")
        dl.empty()

        _.mapValues(mapping, (name, key) => {
            const value = fd[key]
            if (value) {
                dl.append($("<dt class='col-sm-3'>").text(name))
                dl.append($("<dd class='col-sm-9'>").text(value))
            }
        })

        if (verified.chain.length) {
            const root = verified.chain[verified.chain.length - 1]
            if (root.O) {
                dl.append($("<dt class='col-sm-3'>").text("Approved By"))
                dl.append($("<dd class='col-sm-9'>").text(root.O))
            }
        }

        $("#verified").show()
    }
    catch (error) {
        console.log(error)
        alert("sorry, can't verify: " + url + ": " + error)
    }
}

const _build_scanner = function() {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    scanner.render(async function(url) {
        /*
        const did = code.replace(/^.*:/, "").trim()
        $("#did").val(did)
        */

        try {
            await validate(url)
        } catch (error) {
            console.log("#", error)
        }

        await scanner.clear()
        _build_scanner()
    })
}

$(document).ready(function() {
    $("#verified-close").on("click", function() {
        $("#verified").hide()
    })

    /*
     *  Form
     */
    $("#verifier").on("submit", async function(e) {
        e.preventDefault()
        const did_prefix = $("#prefix").val().trim()
        const did = $("#did").val().replace(/^.*:/, "").trim()
        $("#did").val(did)

        const did_url = didd[did_prefix]
        if (!did_url) {
            alert("weird: can't figure out: " + did_prefix)
            return
        }

        try {
            await validate(did_url + did_prefix + did)
        } catch (error) {
            console.log("#", error)
        }
    })

    /**
     *  QR codes
     */
    _build_scanner()
})

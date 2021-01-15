import _ from 'lodash';
import ip from "../..";
import fetch from "node-fetch";

// import Html5QrcodeScanner from "../qr/html5-qrcode-scanner.js";

const mapping = {
    'id': "ID",
    'patient/givenName': "First Name",
    'patient/additionalName': "Middle Name",
    'patient/familyName': "Last Name",
    'patient/birthDate': "DOB",
    'permit-healthCard/identifier-healthCard': "Health Card",
    'permit-healthCard/issuedBy': "Issuer",
    'permit-healthCard/validUntil': "Expiry",
    'primaryPrevention/name': "Treatment",
    treatmentDate: "Treatment Date",
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
        const response = await fetch(url, {
            headers: {
                accept: "application/vc+ld+json",
            },
        })
        const json = await response.json();
        const verified = await ip.jws.verify(json, async proof => {
            const vresponse = await fetch(proof.verificationMethod)
            const vtext = await vresponse.text()

            return vtext
        })

        const fd = flatten(verified.payload)
        const dl = $("dl")
        dl.empty()

        _.mapValues(mapping, (name, key) => {
            const value = fd[key]
            if (value) {
                dl.append($("<dt class='col-sm-3'>").text(name))
                dl.append($("<dd class='col-sm-9'>").text(value))
            }
        })

        $("#verified").show()
    }
    catch (error) {
        console.log(error)
        alert("sorry, can't verify: " + url)
    }
}

const _build_scanner = function() {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    scanner.render(async function(code) {
        const did = code.replace(/^.*:/, "").trim()
        $("#did").val(did)

        try {
            await validate("https://consensas.world/did/did:cns:" + did)
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
        const did = $("#did").val().replace(/^.*:/, "").trim()
        $("#did").val(did)

        try {
            await validate("https://consensas.world/did/did:cns:" + did)
        } catch (error) {
            console.log("#", error)
        }
    })

    /**
     *  QR codes
     */
    _build_scanner()
})

/**
 *  samples/sign.js
 *
 *  David Janes
 *  Consensas
 *  2021-01-11
 */

"use strict"

const ip = require("..")

const fs = require("fs")
const jose = require("node-jose")
const path = require("path")

const FOLDER = path.join(__dirname, "..", "test", "data")

const minimist = require("minimist")
const ad = minimist(process.argv.slice(2), {
    boolean: [
        "verbose", "trace", "debug",

        "rsa",
        "bbs",
        "canonical",
    ],
    string: [
        "_",
        "in",
        "key",
        "verification",
        "suite", // CanonicalRSA2021 BbsBlsSignature2020 RsaSignature2018
    ],
    alias: {
    },
    default: {
        "in": null,
        "verification": "https://example.com/i/pat/keys/5",
        "private": path.join(FOLDER, "private.key.pem"),
        "public": path.join(FOLDER, "public.key.pem"),
        "suite": "ConsensasRSA2021",
    },
});

if (ad.rsa) {
    ad.suite = "RsaSignature2018"
} else if (ad.bbs) {
    ad.suite = "BbsBlsSignature2020"
} else if (ad.canonical) {
    ad.suite = "CanonicalRSA2021"
}

const run = async (ad) => {
    const message = {
        "@context": {
            "schema": "http://schema.org/",
        },
        "schema:name": "hello, world",
    }
    if (ad.in !== null) {
        message = JSON.parse(await fs.promises.readFile(ad.in, "r"))
    }

    const private_pem = await fs.promises.readFile(ad.private, "utf-8")
    const public_pem = await fs.promises.readFile(ad.public, "utf-8")

    const signed = await ip.crypto.sign({
        payload: message, 
        private_key: private_pem, 
        public_key: public_pem,
        verification: ad.verification,
        suite: ad.suite,
    })
    console.log(JSON.stringify(signed, null, 2))
}

run(ad).catch(error => {
    console.log(error)
})


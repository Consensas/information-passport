/**
 *  lib/sign_test.js
 *
 *  David Janes
 *  Consensas
 *  2021-01-11
 */

"use strict"


/* ---------------- */
const fs = require("fs")
const jose = require("node-jose")
const path = require("path")

const FOLDER = path.join(__dirname, "..", "test", "data")

const sign = require("./sign").sign

const run = async (files) => {
    const private_pem = await fs.promises.readFile(path.join(FOLDER, "private.key.pem"))
    const private_key = await jose.JWK.asKey(private_pem, 'pem');

    const message = {
        "hello": "world",
    }
    const verifier = "https://example.com/i/pat/keys/5"

    const signed = await sign(message, private_key, verifier)
    console.log(JSON.stringify(signed, null, 2))
}

run(process.argv.slice(2)).catch(error => {
    console.log(error)
})


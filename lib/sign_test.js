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
    const keystore = jose.JWK.createKeyStore()

    await keystore.add(await fs.promises.readFile(path.join(FOLDER, "private.key.pem")), "pem")
    // await keystore.add(await fs.promises.readFile(path.join(FOLDER, "public.cer.pem")), "pem")
    
    // console.log(JSON.stringify(keystore.toJSON(true), null, 2))
    const keys = keystore.all({
        use: "enc",
    })

    const message = {
        "hello": "world",
    }
    const verifier = "https://example.com/i/pat/keys/5"

    const signed = await sign(message, keys, verifier)
    console.log(JSON.stringify(signed, null, 2))
}

run(process.argv.slice(2)).catch(error => {
    console.log(error)
})


/**
 *  samples/verify.js
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

const signed = require("./signed.json")

const run = async (files) => {
    const v = await ip.jws.verify(signed, async proof => {
        return fs.promises.readFile(path.join(FOLDER, "public.cer.pem"), "utf8")
    })
    console.log(JSON.stringify(v, null, 2))
}

run(process.argv.slice(2)).catch(error => {
    console.log(error)
})


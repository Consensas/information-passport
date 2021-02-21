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

const minimist = require("minimist")
const ad = minimist(process.argv.slice(2), {
    boolean: [
        "verbose", "trace", "debug",
    ],
    string: [
        "_",
        "in",
        "public",
        "private",
    ],
    alias: {
    },
    default: {
        "in": null,
        "private": path.join(FOLDER, "private.key.pem"),
        "public": path.join(FOLDER, "public.cer.pem"),
    },
})

const run = async file => {
    const signed = JSON.parse(await fs.promises.readFile(file, "utf-8"))
    const v = await ip.crypto.verify(signed, {
        fetch_chain: async proof => {
            return fs.promises.readFile(path.join(FOLDER, "public.combined.pem"), "utf8")
        },
    })
    console.log(JSON.stringify(v, null, 2))
}

run(ad.in || "signed.json").catch(error => {
    console.log(error)
})


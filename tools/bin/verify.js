/**
 *  tools/bin/verify.js
 *
 *  David Janes
 *  Consensas
 *  2021-01-11
 */

"use strict"

const _ = require("iotdb-helpers")
const ip = require("../..")

const fs = require("fs")
const jose = require("node-jose")
const path = require("path")

const _util = require("./_util")

const minimist = require("minimist")
const ad = minimist(process.argv.slice(2), {
    boolean: [
        "verbose", "trace", "debug",
    ],
    string: [
        "_",
        "file",
        "verifier",
    ],
    alias: {
    },
    default: {
    },
});

const help = message => {
    const name = "verify"

    if (message) {
        console.log(`${name}: ${message}`)
        console.log()
    }

    console.log(`\
usage: ${name} [options] [--file <file.json>] [--verifier <url>]

options:

--in <file.json>             json file to verify (otherwise stdin)
--verifier <public-key.pem>  use this public key PEM as the verifier
`)

    process.exit(message ? 1 : 0)
}

_.logger.levels({
    debug: ad.debug || ad.verbose,
    trace: ad.trace || ad.verbose,
})

const run = async (files) => {
    const message = JSON.parse(ad.file ? await fs.promises.readFile(ad.file) : await _util.read_stdin())

    const signed = await ip.jws.verify(message, async proof => {
        return fs.promises.readFile(ad.verifier ? ad.verifier : proof, "utf8")
    })

    console.log(JSON.stringify(signed, null, 2))
}

run().catch(error => {
    console.log(error)
})


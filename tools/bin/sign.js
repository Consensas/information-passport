/**
 *  tools/bin/sign.js
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

const minimist = require("minimist")
const ad = minimist(process.argv.slice(2), {
    boolean: [
        "verbose", "trace", "debug",
    ],
    string: [
        "_",
        "file",
        "key",
        "verifier",
    ],
    alias: {
    },
    default: {
    },
});

const help = message => {
    const name = "sign"

    if (message) {
        console.log(`${name}: ${message}`)
        console.log()
    }

    console.log(`\
usage: ${name} [options] --in <file.json> --key <private-key.pem> [--verifier <url>]

Required:

--in <file.json>        json file to sign
--key <private-key.pem> private key PEM

Options:

--verifier <url>        url to public key chain. If not used, you'll get output
                        but it will be tricky to verify / validate!
`)

    process.exit(message ? 1 : 0)
}

if (!ad.in) {
    help("--in argument is required")
}
if (!ad.key) {
    help("--key argument is required")
}

_.logger.levels({
    debug: ad.debug || ad.verbose,
    trace: ad.trace || ad.verbose,
})

const FOLDER = path.join(__dirname, "..", "..", "test", "data")

const run = async (files) => {
    const private_pem = await fs.promises.readFile(ad.key)
    const message = JSON.parse(await fs.promises.readFile(ad.in))

    const signed = await ip.jws.sign(message, private_pem, ad.verifier)
    console.log(JSON.stringify(signed, null, 2))
}

run(process.argv.slice(2)).catch(error => {
    console.log(error)
})


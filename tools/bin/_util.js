/**
 *  tools/bin/_util.js
 *
 *  David Janes
 *  Consensas
 *  2021-01-19
 */

"use strict"

const _ = require("iotdb-helpers")
const ip = require("../..")

/**
 */
const read_stdin = () => {
    return new Promise((resolve, reject) => {
        process.stdin.resume()
        process.stdin.setEncoding("utf8")

        let buffer = ""

        process.stdin.on("data", chunk => buffer += chunk)
        process.stdin.on("end", () => resolve(buffer))
    })
}

/**
 */
exports.read_stdin = read_stdin

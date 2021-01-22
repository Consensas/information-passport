/*
 *  web/serve.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-01-15
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

const express = require("express")
const fs = require("fs")
const path = require("path")

const app = express();

app.get("/", async (request, response) => {
    const document = await fs.promises.readFile(
        path.join(__dirname, "dist", "index.html"))

    response.type("text/html")
    response.send(document)
})

app.get("/main.js", async (request, response) => {
    const document = await fs.promises.readFile(
        path.join(__dirname, "dist", "main.js"))

    response.type("application/json")
    response.send(document)
})

const server = app.listen(3004, "0.0.0.0", function () {
    const host = server.address().address
    const port = server.address().port

    console.log("http://%s:%s", host, port)
})

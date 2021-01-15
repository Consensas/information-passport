const express = require("express");
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

const server = app.listen(3004, function () {
    const host = server.address().address
    const port = server.address().port

    console.log("http://%s:%s", host, port)
})

import list from "express-list-endpoints"
import mongoose from "mongoose"
import server, { app } from "./server"

// import dotenv from "dotenv"
// dotenv.config()

process.env.TS_NODE_DEV && require("dotenv").config()

const port = process.env.PORT || 3030

const { ATLAS_TEST_URL } = process.env

if (!ATLAS_TEST_URL) throw new Error("No Atlas URL specified")

mongoose
    .connect(ATLAS_TEST_URL, { useNewUrlParser: true })
    .then(() => {
        console.log("Connected to mongo")
        // Listen using the httpServer -
        // listening with the express instance will start a new one!!
        server.listen(port, () => {
            console.log(list(app))
            console.log("Server listening on port " + port)
        })
    })
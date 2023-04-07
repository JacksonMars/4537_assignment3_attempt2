const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require('mongoose');
const AccessTimes = require("./models/accessTimes")
const EndpointAccess = require("./models/endpointAccess")
const Error = require("./models/Error")

const app = express();

app.use(express.json());
app.use(morgan(":method"));
app.use(cors({exposedHeaders: ['Authorization']}));

app.listen(3001, async () => {
    console.log("Server started on port 3001")
    await mongoose.connect('mongodb+srv://dbUser:dbUser1@cluster0.ha92a.mongodb.net/pokemon');
})

app.post("/recordEndpointAccess", async (req, res) => {
    try {
        await EndpointAccess.insertMany({"username": req.body.username, "time": new Date(), "endpoint": req.body.endpoint})
        return res.status(200).json({"status": "OK"})
    } catch(error) {
        await Error.insertMany({"error": error._message, "time": new Date(), "endpoint": req.body.endpoint})
        return res.status(500).json({"error": error})
    }
})

app.get("/getUniqueUsers", async (req, res) => {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const times = await AccessTimes.find({"lastAccess": {"$gte": yesterday, "$lte": today}})

    if(times === undefined) {
        return res.status(200).json({"count": 0})
    }
    return res.status(200).json({"count": times.length})
})

app.get("/topUsers", async (req, res) => {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const recentUsers = await AccessTimes.find({"lastAccess": {"$gte": yesterday, "$lte": today}})
    
    let highIndex = -1
    let currentHigh = -1
    for(let i = 0; i < recentUsers.length; i++) {
        let recentAccesses = await EndpointAccess.find({"username": recentUsers[i].username})
        if(recentAccesses.length > currentHigh) {
            currentHigh = recentAccesses.length
            highIndex = i
        }
    }

    return res.status(200).json({"username": recentUsers[highIndex].username, "count": currentHigh})
})

app.get("/topUsersByEndpoint", async (req, res) => {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const recentUsers = await AccessTimes.find({"lastAccess": {"$gte": yesterday, "$lte": today}})

    let highIndexGetAll = -1
    let currentHighGetAll = -1
    for(let i = 0; i < recentUsers.length; i++) {
        const result = await EndpointAccess.aggregate([
            {$match: {"username": recentUsers[i].username, "endpoint": "Get all pokemon", "time": {"$gte": yesterday, "$lte": today}}}
        ]).exec()

        if(result.length > currentHighGetAll) {
            currentHighGetAll = result.length
            highIndexGetAll = i
        }
    }

    let highIndexGetOne = -1
    let currentHighGetOne = -1
    for(let i = 0; i < recentUsers.length; i++) {
        const result = await EndpointAccess.aggregate([
            {$match: {"username": recentUsers[i].username, "endpoint": "Get pokemon details", "time": {"$gte": yesterday, "$lte": today}}}
        ]).exec()

        if(result.length > currentHighGetOne) {
            currentHighGetOne = result.length
            highIndexGetOne = i
        }
    }

    return res.status(200).json({"getAll": {"username": recentUsers[highIndexGetAll].username, "count": currentHighGetAll}, "getDetails": {"username": recentUsers[highIndexGetOne].username, "count": currentHighGetOne}})
})

app.get("/errorsByEndpoint", async (req, res) => {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    let allErrors = await Error.find({"time": {"$gte": yesterday, "$lte": today}})
    let getAllErrors = ""
    let getDetailErrors = ""

    for(let i = 0; i < allErrors.length; i++) {
        if(allErrors[i].endpoint === "Get all pokemon") {
            getAllErrors = getAllErrors + "Endpoint: " + allErrors[i].endpoint + ", time: " + allErrors[i].time + ", error: " + allErrors[i].error + ", "
        } else {
            getDetailErrors = getDetailErrors + "Endpoint: " + allErrors[i].endpoint + ", time: " + allErrors[i].time + ", error: " + allErrors[i].error + ", "
        }

        if(getAllErrors === "") {
            getAllErrors = "No recent errors"
        }
        if(getDetailErrors === "") {
            getDetailErrors = "No recent errors"
        }
    }

    return res.status(200).json({"getAll": getAllErrors, "getDetails": getDetailErrors})
})
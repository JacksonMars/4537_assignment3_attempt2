const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require('mongoose');
const AccessTimes = require("./models/accessTimes")
const EndpointAccess = require("./models/endpointAccess")

const app = express();

app.use(express.json());
app.use(morgan(":method"));
app.use(cors({exposedHeaders: ['Authorization']}));

app.listen(3001, async () => {
    console.log("Server started on port 3001")
    await mongoose.connect('mongodb+srv://dbUser:dbUser1@cluster0.ha92a.mongodb.net/pokemon');
})

app.post("/recordEndpointAccess", async (req, res) => {
    await EndpointAccess.insertMany({"username": req.body.username, "time": new Date(), "endpoint": req.body.endpoint})
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
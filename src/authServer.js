const express = require("express");
const userModel = require("./models/user.js");
const refreshTokenModel = require("./models/refreshToken.js");
const AccessTimes = require("./models/accessTimes.js")
const cors = require("cors");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

const start = async () => {
    app.listen(5000, async () => {
        console.log("Server started on port 5000");
        await mongoose.connect('mongodb+srv://dbUser:dbUser1@cluster0.ha92a.mongodb.net/pokemon');
    });
}
// Uncomment this line to run the server normally. It is commented because supertest cannot run if the server is listening on any ports.
start();

app.use(express.json());
app.use(cors({
    exposedHeaders: ['auth-token-access', 'auth-token-refresh']
}));

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userWithHashedPassword = { username: username, password: hashedPassword };
        const user = await userModel.create(userWithHashedPassword);

        const existingAccessTime = await AccessTimes.findOne({"username": username})
        if(existingAccessTime == null) {
            await AccessTimes.insertMany({"username": username, "lastAccess": new Date()})
        } else {
            await AccessTimes.updateOne({"username": username}, {"lastAccess": new Date()})
        }

        return res.status(201).json({"user": user});
    } catch(err) {
        return res.status(500).json({"message": "An error occured.", "error": err})
    }
});

app.get('/requestNewAccessToken', async (req, res) => {
    const header = req.header('Authorization')
    if(!header) {
        return res.status(400).json({"error": "No token found in header."});
    }
    
    const token = req.header('Authorization').split(" ")
    if(token[0] != "Refresh" || token.length != 2) {
        return res.status(400).json({"message": "a refresh token needs to be provided in the request header."})
    }

    const refreshToken = token[1];
    refreshTokenModel.findOne({"token": refreshToken}, async (err, token) => {
        if (!token) {
            return res.status(400).json({"message": "the provided refresh token could not be found."})
        }

        try {
            const payload = await jwt.verify(refreshToken, "assignmentrefresh")
            const accessToken = jwt.sign({ user: payload.user }, "assignmentaccess", { expiresIn: '10s' })
            res.header('auth-token-access', accessToken)
            return res.status(201).json({"message": "new token created"})
        } catch (error) {
            return res.status(400).json({"message": "invalid refresh token."})
        }
    });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body

    if (!password || !username) {
        return res.status(400).json({"message": "please provide a username and password."})
    }

    const user = await userModel.findOne({ username })
    if (!user) {
        return res.status(404).json({"message": "username not found."})
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
        return res.status(400).json({"message": "incorrect password."})
    }

    const accessToken = jwt.sign({ user: user }, "assignmentaccess", { expiresIn: '10s' })
    const refreshToken = jwt.sign({ user: user }, "assignmentrefresh")
    await refreshTokenModel.deleteMany({"username": username});
    await refreshTokenModel.create({"token": refreshToken, "username": username});

    res.header('auth-token-access', accessToken)
    res.header('auth-token-refresh', refreshToken)

    const existingAccessTime = await AccessTimes.findOne({"username": user.username})
    if(existingAccessTime == null) {
        await AccessTimes.insertMany({"username": username, "lastAccess": new Date()})
    } else {
        await AccessTimes.updateOne({"username": username}, {"lastAccess": new Date()})
    }

    return res.status(200).json({"user": user})
})

app.post('/logout', async(req, res) => {
    const { username } = req.body
    await refreshTokenModel.deleteMany({"username": username});
    return res.status(200).json({"message": "Logged out."})
})

module.exports = app;
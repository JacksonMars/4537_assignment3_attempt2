import React from "react";
import Report from "./Report";
import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard({ accessToken, setAccessToken, refreshToken, setViewPokemon }) {
    const [uniqueUsers, setUniqueUsers] = useState(0)
    const [topUser, setTopUser] = useState({"username": "No active users", "count": 0})

    useEffect(() => {
        async function fetchData() {
            const uniqueUsers = await axios.get("http://localhost:3001/getUniqueUsers")
            setUniqueUsers(uniqueUsers.data.count)

            const topUsers = await axios.get("http://localhost:3001/topUsers")
            setTopUser({"username": topUsers.data.username, "count": topUsers.data.count})
        }
        fetchData()
    }, [])

    return (
        <div>
            {console.log(uniqueUsers)}
            <button onClick={() => setViewPokemon(true)}>Back</button>
            <h1>Dashboard</h1>
            <p>Unique users over the past 24 hours: {uniqueUsers}</p>
            <p>Top API user over the past 24 hours: {topUser.username}, {topUser.count} accesses</p>
        </div>
    )
}

export default Dashboard;
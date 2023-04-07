import React from "react";
import Report from "./Report";
import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard({ accessToken, setAccessToken, refreshToken, setViewPokemon }) {
    const [uniqueUsers, setUniqueUsers] = useState(0)
    const [topUser, setTopUser] = useState({"username": "No active users", "count": 0})
    const [topUsersEndpoint, setTopUsersEndpoint] = useState({"getAll": {"username": "No active users", "count": 0}, "getDetails": {"username": "No active users", "count": 0}})

    useEffect(() => {
        async function fetchData() {
            const uniqueUsers = await axios.get("http://localhost:3001/getUniqueUsers")
            setUniqueUsers(uniqueUsers.data.count)

            const topUsers = await axios.get("http://localhost:3001/topUsers")
            setTopUser({"username": topUsers.data.username, "count": topUsers.data.count})

            const topEndpointUsers = await axios.get("http://localhost:3001/topUsersByEndpoint")
            setTopUsersEndpoint(topEndpointUsers.data)
        }
        fetchData()
    }, [])

    return (
        <div>
            {console.log(uniqueUsers)}
            <button onClick={() => setViewPokemon(true)}>Back</button>
            <h1>Dashboard</h1>
            <h3>Unique users over the past 24 hours: {uniqueUsers}</h3>
            <h3>Top API user over the past 24 hours: {topUser.username}, {topUser.count} calls</h3>
            <h3>Top users for each endpoint:</h3>
            <ul>
                <li>Get all pokemon: {topUsersEndpoint.getAll.username}, {topUsersEndpoint.getAll.count} calls</li>
                <li>Get pokemon details: {topUsersEndpoint.getDetails.username}, {topUsersEndpoint.getDetails.count} calls</li>
            </ul>
        </div>
    )
}

export default Dashboard;
import React from "react";
import Report from "./Report";
import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard({ accessToken, setAccessToken, refreshToken, setViewPokemon }) {
    const [uniqueUsers, setUniqueUsers] = useState(0)

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get("http://localhost:3001/getUniqueUsers")
            console.log(response)
            setUniqueUsers(response.data.count)
        }
        fetchData()
    }, [])

    return (
        <div>
            {console.log(uniqueUsers)}
            <button onClick={() => setViewPokemon(true)}>Back</button>
            <h1>Dashboard</h1>
            <p>Unique users over the past 24 hours: {uniqueUsers}</p>
        </div>
    )
}

export default Dashboard;
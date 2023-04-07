import React from "react";
import Report from "./Report";
import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

function Dashboard({ accessToken, setAccessToken, refreshToken, setViewPokemon }) {
    const axiosJWT = axios.create()

    axiosJWT.interceptors.request.use(async (config) => {
        const decodedToken = jwt_decode(accessToken);
        console.log(decodedToken)
        if (decodedToken.exp <= Date.now() / 1000) {
            const res = await axios.get('http://localhost:5000/requestNewAccessToken', {
                headers: {
                    'Authorization': `Refresh ${refreshToken}`
                }
            })
            setAccessToken(res.headers['auth-token-access'])
            config.headers['Authorization'] = `Bearer ${res.headers['auth-token-access']}`
        }
        console.log(config)
        return config;
    }, (error) => {
            return Promise.reject(error);
        }
    );

    const [uniqueUsers, setUniqueUsers] = useState(0)
    const [topUser, setTopUser] = useState({"username": "No active users", "count": 0})
    const [topUsersEndpoint, setTopUsersEndpoint] = useState({"getAll": {"username": "No active users", "count": 0}, "getDetails": {"username": "No active users", "count": 0}})
    const [errorsByEndpoint, setErrorsByEndpoint] = useState({"getAll": "No recent errors", "getDetails": "No recent errors"})

    useEffect(() => {
        async function fetchData() {
            const uniqueUsers = await axiosJWT.get("http://localhost:3001/getUniqueUsers", {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })
            setUniqueUsers(uniqueUsers.data.count)

            const topUsers = await axiosJWT.get("http://localhost:3001/topUsers", {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })
            setTopUser({"username": topUsers.data.username, "count": topUsers.data.count})

            const topEndpointUsers = await axiosJWT.get("http://localhost:3001/topUsersByEndpoint", {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })
            setTopUsersEndpoint(topEndpointUsers.data)

            const errorsGetAll = await axiosJWT.get("http://localhost:3001/errorsByEndpoint", {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })
            setErrorsByEndpoint(errorsGetAll.data)
        }
        fetchData()
    }, [])

    return (
        <div>
            <button onClick={() => setViewPokemon(true)}>Back</button>
            <h1>Dashboard</h1>
            <h3>Unique users over the past 24 hours: {uniqueUsers}</h3>
            <h3>Top API user over the past 24 hours: {topUser.username}, {topUser.count} calls</h3>
            <h3>Top users for each endpoint:</h3>
            <ul>
                <li>Get all pokemon: {topUsersEndpoint.getAll.username}, {topUsersEndpoint.getAll.count} calls</li>
                <li>Get pokemon details: {topUsersEndpoint.getDetails.username}, {topUsersEndpoint.getDetails.count} calls</li>
            </ul>
            <h3>Errors by endpoint:</h3>
            <ul>
                <li><h4>Get all pokemon:</h4></li>
                <li>{errorsByEndpoint.getAll}</li>
                <li><h4>Get pokemon details:</h4></li>
                <li>{errorsByEndpoint.getDetails}</li>
            </ul>
        </div>
    )
}

export default Dashboard;
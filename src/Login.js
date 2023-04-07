import React from "react";
import { useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard"

function Login({user, setUser, refreshToken, setRefreshToken, accessToken, setAccessToken}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3001/login", { username, password });
            setAccessToken(res.headers["auth-token-access"]);
            setRefreshToken(res.headers["auth-token-refresh"]);
            setUser(res.data.user);
        } catch (err) {
            console.log(err);
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3001/register", { username, password });
            setAccessToken(res.headers["auth-token-access"]);
            setRefreshToken(res.headers["auth-token-refresh"]);
            setUser(res.data.user);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            {
                (!isRegister && !isLogin) &&
                <div>
                    <button onClick={() => setIsLogin(true)}>Login</button>
                    <button onClick={() => setIsRegister(true)}>Register</button>
                </div>
            }
            {
                (isRegister) &&
                <form onSubmit={handleRegister}>
                    <input type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)} />
                    <input type="text" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Register</button>
                </form>
            }
            {/* {
                (user?.username) &&
                <>
                    <Dashboard accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />
                </>
            } */}
            {
                // (!user || !user?.username) &&
                (isLogin) &&
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)} />
                    <input type="text" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Login</button>
                </form>
            }
        </div>
    )
}

export default Login;
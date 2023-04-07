import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import jwt_decode from "jwt-decode";

function Page({currentPokemon, currentPage, setCurrentImage, setSelectedPokemon, user, accessToken, setAccessToken, refreshToken}) {
    const axiosJWT = axios.create()

    axiosJWT.interceptors.request.use(async (config) => {
        const decodedToken = jwt_decode(accessToken);
        if (decodedToken.exp <= Date.now() / 1000) {
            const res = await axios.get('http://localhost:3001/requestNewAccessToken', {
                headers: {
                    'Authorization': `Refresh ${refreshToken}`
                }
            })
            setAccessToken(res.headers['auth-token-access'])
            config.headers['Authorization'] = `Bearer ${res.headers['auth-token-access']}`
        }
        return config;
    }, (error) => {
            return Promise.reject(error);
        }
    );

    const getId = (id) => {
        if (id < 10) return `00${id}`
        if (id < 100) return `0${id}`
        return id
    }

    const changeImage = async (id) => {
        setCurrentImage(`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${getId(id)}.png`)
        setSelectedPokemon(id)
        await axiosJWT.post("http://localhost:3001/recordEndpointAccess", {
            "Authorization": `Bearer ${accessToken}`,
            "username": user.username,
            "endpoint": "Get pokemon details"
        })
    }

    return (
        <div>
            <h1>Page number: {currentPage}</h1>
            <div className="pokemonList">
                {
                    currentPokemon.map(poke => (
                        <>
                            <img src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${getId(poke.id)}.png`} onClick={() => changeImage(poke.id)} />
                        </>
                    ))
                }
            </div>
        </div>
    );
}

export default Page;
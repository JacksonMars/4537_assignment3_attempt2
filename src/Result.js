import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Page from "./Page";
import Pagination from "./Pagination";
import PokemonDetails from "./PokemonDetails";
import jwt_decode from "jwt-decode";

function Result({selectedTypes, currentPage, setCurrentPage, accessToken, refreshToken, setAccessToken, setRefreshToken, user}) {
    const axiosJWT = axios.create()

    axiosJWT.interceptors.request.use(async (config) => {
        // const decodedToken = jwt_decode(accessToken);
        // if (decodedToken.exp < Date.now() / 1000) {
        //     const res = await axios.get('http://localhost:5000/requestNewAccessToken', {
        //         headers: {
        //             'Authorization': `Refresh ${refreshToken}`
        //         }
        //     })
        //     setAccessToken(res.headers['auth-token-access'])
        //     config.headers['Authorization'] = `Bearer ${res.headers['auth-token-access']}`
        // }
        console.log(config)
        return config;
    }, (error) => {
            return Promise.reject(error);
        }
    );

    const [pokemon, setPokemon] = useState([])
    const [pokemonPerPage] = useState(10)
    const [selectedPokemon, setSelectedPokemon] = useState(null)
    const [currentImage, setCurrentImage] = useState("")

    useEffect(() => {
        async function fetchData() {
            const response = await axiosJWT.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json")
            // const response = await axiosJWT.get("http://localhost:3000/api/v1/pokemons", {
            //     headers: {
            //         "Authorization": `Bearer ${accessToken}`,
            //         "user": user.username
            //     }
            // })
            setPokemon(response.data)
        }
        fetchData()
    }, [])

    let lastIndex = currentPage * pokemonPerPage;
    let firstIndex = lastIndex - pokemonPerPage;
    let allCurrentPokemon = pokemon.slice(firstIndex, lastIndex)
    let numberOfPages = Math.ceil(pokemon.length / pokemonPerPage);
    let newPokemon = []

    return (
        <div>
            {
                pokemon.map(poke => {
                    if(selectedTypes.length === 0 || selectedTypes.length > 2) {
                        lastIndex = 0
                        firstIndex = 0
                        allCurrentPokemon = pokemon.slice(firstIndex, lastIndex)
                        numberOfPages = 0
                        return
                    } else if(selectedTypes.every(type => poke.type.includes(type))) {
                        newPokemon.push(poke)
                    }
                })
            }

            {
                newPokemon.map(poke => {
                    lastIndex = currentPage * pokemonPerPage;
                    firstIndex = lastIndex - pokemonPerPage;
                    allCurrentPokemon = newPokemon.slice(firstIndex, lastIndex)
                    numberOfPages = Math.ceil(newPokemon.length / pokemonPerPage);
                })
            }

            <Page currentPokemon={allCurrentPokemon} currentPage={currentPage} setSelectedPokemon={setSelectedPokemon} setCurrentImage={setCurrentImage} />
            <Pagination numberOfPages={numberOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />

            {
                (selectedPokemon !== null) &&
                <PokemonDetails pokemon={pokemon} selectedPokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon} currentImage={currentImage} />
            }
        </div>
    )
}

export default Result;
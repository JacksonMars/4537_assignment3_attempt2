import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'

function Page({currentPokemon, currentPage, setCurrentImage, setSelectedPokemon, user}) {
    // useEffect(() => {
    //     console.log("Setting up page")
    // }, [currentPokemon])

    const getId = (id) => {
        if (id < 10) return `00${id}`
        if (id < 100) return `0${id}`
        return id
    }

    const changeImage = async (id) => {
        setCurrentImage(`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${getId(id)}.png`)
        setSelectedPokemon(id)
        await axios.post("http://localhost:3001/recordEndpointAccess", {
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
import React from 'react'
import { useEffect } from 'react'

function Page({currentPokemon, currentPage, setCurrentImage, setSelectedPokemon}) {
    useEffect(() => {
        console.log("Setting up page")
    }, [currentPokemon])

    const getId = (id) => {
        if (id < 10) return `00${id}`
        if (id < 100) return `0${id}`
        return id
    }

    const changeImage = (id) => {
        setCurrentImage(`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${getId(id)}.png`)
        setSelectedPokemon(id)
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
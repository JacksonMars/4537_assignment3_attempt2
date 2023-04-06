import React, { useState } from "react";

function PokemonDetails({pokemon, selectedPokemon, setSelectedPokemon, currentImage}) {
    let selectedTypes = ""

    const setTypes = function(types) {
        if(types.length === 1) {
            selectedTypes = types[0]
        } else {
            selectedTypes = types[0] + ", " + types[1]
        }
    }

    return (
        <div>
            {
                (selectedPokemon != undefined) &&
                <div>
                    {setTypes(pokemon[selectedPokemon - 1].type)}
                    <button onClick={() => setSelectedPokemon(null)}>Remove</button>
                    <img src={currentImage} />
                    <h2>Name: {pokemon[selectedPokemon - 1].name.english}</h2>
                    <p>Pokedex Number: {selectedPokemon}</p>
                    <p>Type: {selectedTypes}</p>
                    <p>HP: {pokemon[selectedPokemon - 1].base.HP}</p>
                    <p>Attack: {pokemon[selectedPokemon - 1].base.Attack}</p>
                    <p>Defense: {pokemon[selectedPokemon - 1].base.Defense}</p>
                    <p>Special Attack: {pokemon[selectedPokemon - 1].base['Sp. Attack']}</p>
                    <p>Special Defense: {pokemon[selectedPokemon - 1].base['Sp. Defense']}</p>
                    <p>Speed: {pokemon[selectedPokemon - 1].base.Speed}</p>
                </div>
            }
        </div>
    )
}

export default PokemonDetails;
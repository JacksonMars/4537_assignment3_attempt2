import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

function Search({selectedTypes, setSelectedTypes, setCurrentPage}) {
    const [types, setTypes] = useState([])

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json')
            setTypes(response.data.map(type => type.english))
        }
        fetchData()
    }, [])

    const handleChange = (e) => {
        const {value, checked} = e.target
        if(checked) {
            setSelectedTypes([...selectedTypes, value])
        } else {
            setSelectedTypes(selectedTypes.filter(type => type !== value))
        }
    }

    return (
        <div>
            {
                types.map(type => 
                    <div key={type}>
                        <input 
                            type='checkbox' 
                            value={type} 
                            id={type}
                            onChange={handleChange}
                            onClick={() => setCurrentPage(1)} />
                        <label htmlFor={type}>{type}</label>
                    </div>)
            }
        </div>
    )
}

export default Search;
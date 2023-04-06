import React from 'react'
import "./style.css"

function Pagination({numberOfPages, currentPage, setCurrentPage}) {
    const pageNumbers = []
    for(let i = 1; i <= numberOfPages; i++) {
        pageNumbers.push(i)
    }

    return (
        <div>
            {
                (currentPage !== 1 && numberOfPages !== 0) &&
                <button onClick={() => {
                    if(currentPage > 1)
                        setCurrentPage(currentPage - 1)
                }}>Prev.</button>
            }

            {
                pageNumbers.map(pageNum => {
                    if (pageNum < currentPage + 6 && pageNum > currentPage - 6) {
                        return (
                            <button onClick={() => setCurrentPage(pageNum)} className={(pageNum == currentPage) ? 'btnActive' : ''}>{pageNum}</button>
                        )
                    }
                })
            }

            {
                (currentPage !== numberOfPages && numberOfPages !== 0) &&
                <button onClick={() => {
                    if(currentPage < 81)
                        setCurrentPage(currentPage + 1)
                }}>Next</button>
            }
        </div>
    );
}

  export default Pagination;
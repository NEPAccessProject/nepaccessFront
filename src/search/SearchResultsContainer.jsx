import React from 'react';

export default function SearchResultsContainer(props) {
    return (
        <div className="search-results-container">
            {props.children}
        </div>
    );
}
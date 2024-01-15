import React from 'react';

import Pair from './Pair.jsx';

export default class Pairs extends React.Component {
    render() {
            return (
                <Pair 
                    message="Strict pairs (2 actual file documents on file server per pair).  Data may take a bit to load and show up, please be patient."
                    url="test/match_all_pairs_two"
                />
            );
    }
}
import React from 'react';

import ProfessionUpgrade from "../components/ProfessionUpgrade";
import CharacterSection from "../components/CharacterSection";

const Park = React.createClass({
    render: function() {
        return (
            <div>
                <h1>You're at Humboldt Park!</h1>
                &nbsp;
                <CharacterSection place="park" />
                <ProfessionUpgrade type='park' />
            </div>
        );
    }
});


export default Park;
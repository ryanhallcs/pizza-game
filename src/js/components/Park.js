import React from 'react';

import ProfessionUpgrade from "../components/ProfessionUpgrade";

const Park = React.createClass({
    render: function() {
        return (
            <div>
                <h1>You're at Humboldt Park!</h1>
                &nbsp;
                <ProfessionUpgrade eventManager={this.props.eventManager} type='park' />
            </div>
        );
    }
});


export default Park;
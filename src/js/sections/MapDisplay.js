import React from 'react';

import { Well, Row, Col, Button } from 'react-bootstrap'

const MapDisplay = React.createClass({
    render: function() {
        var availablePlaces = this.props.places.filter(function(place, i) { return place.enabled; });
        var colWidth = Math.floor(12.0 / availablePlaces.length);
        return (
            <div>
                {availablePlaces.map(function(place, i) {
                    return (
                        <Col key={place.id} md={colWidth}>
                            <Button bsStyle="warning" bsSize="small" onClick={() => this.props.changeInteractionDisplay(place.id)}> {place.text} </Button>
                        </Col>
                    );
                }.bind(this))}
       	    </div>
        );
    }
});

export default MapDisplay;
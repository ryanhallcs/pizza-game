import React from 'react';

import { Well, Row, Col, Button } from 'react-bootstrap'

const MapDisplay = React.createClass({
    render: function() {
        var availablePlaces = this.props.places;
        var colWidth = Math.floor(12.0 / availablePlaces.length);
        return (
            <Row className='map main-layout-border'>
                {this.props.places.map(place => {
                    return (
                        <Col key={place.id} md={colWidth}>
                            <Button bsStyle="warning" bsSize="small" onClick={() => this.props.stackManager.changeToDisplay(place.id)}> {place.text} </Button>
                        </Col>
                    );
                })}
       	    </Row>
        );
    }
});

export default MapDisplay;
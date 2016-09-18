import React from 'react';

import { Row, Col, Button } from 'react-bootstrap';
import DisplayActions from "../actions/DisplayActions";
import MapStore from "../stores/MapStore";

const MapDisplay = React.createClass({
    getInitialState: function() {
        return {
            places: MapStore.getAllPlaces()
        };
    },
    pushDisplay: function(name) {
        DisplayActions.pushDisplay(name, null, true);
    },
    componentDidMount: function() {
        MapStore.addChangeListener(this._onChangeMap);
    },
    componentWillUnmount: function() {
        MapStore.removeChangeListener(this._onChangeMap);
    },
    _onChangeMap: function() {
        this.state.places = MapStore.getAllPlaces();
        this.setState(this.state);
    },
    render: function() {
        var availablePlaces = this.state.places;
        var colWidth = Math.floor(12.0 / availablePlaces.length);
        return (
            <Row className='map main-layout-border'>
                {availablePlaces.map(place => {
                    return (
                        <Col key={place.id} md={colWidth}>
                            <Button bsStyle="warning" bsSize="small" onClick={() => this.pushDisplay(place.id)}> {place.text} </Button>
                        </Col>
                    );
                })}
       	    </Row>
        );
    }
});

export default MapDisplay;
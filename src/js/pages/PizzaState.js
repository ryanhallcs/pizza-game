import React from 'react';

import ResourceDisplay from "../sections/ResourceDisplay";
import EventDisplay from "../sections/EventDisplay";
import MapDisplay from "../sections/MapDisplay";
import { InteractionDisplay } from "../sections/InteractionDisplay";
import { Row, Col } from 'react-bootstrap';

import ResourceStore from "../stores/ResourceStore";
import TriggerStore from "../stores/TriggerStore";
import DisplayActions from "../actions/DisplayActions";

const PizzaState = React.createClass({
    getInitialState: function() {
        DisplayActions.pushDisplay('home');
        setInterval(ResourceStore.tick.bind(ResourceStore), 100); // updates per tenth second
        setInterval(TriggerStore.tick.bind(TriggerStore), 500);
        return {};
    },
    render: function() {
        return (
            <Row className='full-height'>
                <Col md={3}>
                    <ResourceDisplay />
                </Col>
                <Col md={4}>
                    <InteractionDisplay />
                </Col>
                <Col md={5}>
                    <Row className='interaction main-layout-border'>
                        <Col md={12}>
                            <EventDisplay />
                        </Col>
                    </Row>
                    <MapDisplay />
                </Col>
            </Row>
        );
    }
});

export default PizzaState;
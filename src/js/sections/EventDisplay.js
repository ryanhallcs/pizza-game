import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import EventStore from "../stores/EventStore";

const EventDisplay = React.createClass({
    getInitialState: function() {
        return {
            events: EventStore.getAllEvents()
        }
    },
    componentDidMount: function() {
        EventStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        EventStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.state.events = EventStore.getAllEvents();
        this.setState(this.state);
    },
    render: function() {
        var events = this.state.events;
        return (
            <ListGroup>
                {events.map(function(event, i) {
                    return (<ListGroupItem bsStyle={event.type} key={event.id}> [{event.type}] {event.body} </ListGroupItem>)
                })}
       	    </ListGroup>
        )
    }
});

export default EventDisplay;
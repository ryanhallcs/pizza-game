import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap'

const EventDisplay = React.createClass({
    render: function() {
        var events = this.props.events;
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
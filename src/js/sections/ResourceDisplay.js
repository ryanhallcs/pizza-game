import React from 'react';
import { Button } from 'react-bootstrap';
import SingleResource from "../components/SingleResource";

const ResourceDisplay = React.createClass({
    eatPizza: function() {
        this.props.resourceManager.alterResourceAmount('pizza', -1);
        this.props.eventManager.broadcast('eat-pizza');
    },
    render: function() {
        var allResources = this.props.resourceManager.getAllResources();
        var alterResourceRate = this.props.resourceManager.alterResourceRate;

        var buttons = [];
        if (allResources['pizza'].amount > 0) {
            buttons.push(<Button key='eat-pizza' onClick={this.eatPizza}>Eat Pizza</Button>);
        }

        var devMode = true;
        var flags = [];
        if (devMode) {
            flags = Object.keys(this.props.eventManager.flags).filter(function(flagName) {
                return this.props.eventManager.flags[flagName];
            }.bind(this));
        }

        return (
            <div>
                {Object.keys(allResources).map(function(resourceKey, i) {
                    var resource = allResources[resourceKey];
                    return (<SingleResource key={resource.name} resource={resource} resourceManager={this.props.resourceManager} />)
                }.bind(this))}
                {buttons.map(function(button) {
                    return button;
                })}
                <br />
                <br />
                <br />
                <br />
                {flags.map(function(flag) {
                    return <p key={flag}> {flag} is set! </p>
                })}
       	    </div>
        )
    }
});

export default ResourceDisplay;
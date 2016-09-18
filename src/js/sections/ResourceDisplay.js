import React from 'react';
import { Row, Col, Button, Table } from 'react-bootstrap';
import SingleResource from "../components/SingleResource";
import ResourceStore from "../stores/ResourceStore";
import ResourceActions from "../actions/ResourceActions";
import TriggerStore from "../stores/TriggerStore";
import FlagStore from "../stores/FlagStore";

const ResourceDisplay = React.createClass({
    getInitialState: function() {
        return {
            resources: ResourceStore.getAllResources()
        };
    },
    componentDidMount: function() {
        ResourceStore.addChangeListener(this._onChangeResource);
    },
    componentWillUnmount: function() {
        ResourceStore.removeChangeListener(this._onChangeResource);
    },
    _onChangeResource: function() {
        this.state.resources = ResourceStore.getAllResources();
        this.setState(this.state);
    },
    eatPizza: function() {
        ResourceActions.alterResourceAmount('pizza', -1);
        TriggerStore.pushGameEvent('eat-pizza');
    },
    render: function() {
        var allResources = this.state.resources;

        var buttons = [];
        var pizzaResource = allResources.find(res => res.name == 'pizza');
        if (pizzaResource.amount > 0) {
            buttons.push(<Button key='eat-pizza' onClick={this.eatPizza} >Eat Pizza</Button>);
        }

        var devMode = true;
        var flags = [];
        if (devMode) {
            flags = Object.keys(FlagStore.getAllFlags()).filter(function(flagName) {
                return FlagStore.getFlag(flagName);
            }.bind(this));
        }

        return (
            <Row className='fill main-layout-border full-height'> <Col md={12}>
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>Resource</th>
                            <th>Amount</th>
                            <th>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.resources.map(resource =>
                        <SingleResource key={resource.name} resource={resource} />
                    )}
                    </tbody>
                </Table>
                {buttons}
                <br />
                <br />
                {flags.map(function(flag) {
                    return <p key={flag}> {flag} is set! </p>
                })}
       	    </Col> </Row>
        )
    }
});

export default ResourceDisplay;
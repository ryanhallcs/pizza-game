import React from 'react';
import { Row, Col, Button, Table } from 'react-bootstrap';
import SingleResource from "../components/SingleResource";
import ResourceStore from "../stores/ResourceStore";
import ResourceActions from "../actions/ResourceActions";
import TriggerStore from "../stores/TriggerStore";
import FlagStore from "../stores/FlagStore";
import InventoryStore from "../stores/InventoryStore";

const ResourceDisplay = React.createClass({
    getInitialState: function() {
        return {
            resources: ResourceStore.getAllResources(),
            inventory: InventoryStore.getInventory()
        };
    },
    componentDidMount: function() {
        ResourceStore.addChangeListener(this._onChangeResource);
        InventoryStore.addChangeListener(this._onChangeInventory);
    },
    componentWillUnmount: function() {
        ResourceStore.removeChangeListener(this._onChangeResource);
        InventoryStore.removeChangeListener(this._onChangeInventory);
    },
    _onChangeResource: function() {
        this.state.resources = ResourceStore.getAllResources();
        this.setState(this.state);
    },
    _onChangeInventory: function() {
        this.state.inventory = InventoryStore.getInventory();
        this.setState(this.state);
    },
    eatPizza: function() {
        ResourceActions.alterResourceAmount('pizza', -1);
        TriggerStore.pushNewGameEvent('eat-pizza');
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
                <h2>Inventory</h2>
                {this.state.inventory.map(item => {
                    return <p key={item.name}>{item.name}</p>
                })}
                <br />
                <br />
                <h2>Debug: Flags</h2>
                {flags.map(function(flag) {
                    return <p key={flag}> {flag} is set! </p>
                })}
       	    </Col> </Row>
        )
    }
});

export default ResourceDisplay;
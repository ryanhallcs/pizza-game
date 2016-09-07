import React from 'react';

import { Jumbotron, Button, Row, Col, Table } from 'react-bootstrap'
import ProgressButton, {STATE} from 'react-progress-button'
import ResourceStore from "../stores/ResourceStore";
import ProfessionUpgrade from "../components/ProfessionUpgrade";
import Park from "../components/Park";
import CharacterSection from "../components/CharacterSection";

var moment = require('moment');
var numeral = require('numeral');

const Home1 = React.createClass({
    getInitialState: function() {
        return {
            makePizzaState: STATE.NOTHING
        };
    },
    shareWorkPizza: function() {
        this.props.eventManager.publishLog('Your roommate thanks you', 'info');
        this.props.resourceManager.alterResourceAmount('pizza', -1);
    },
    shareWarehousePizza: function() {
        this.props.resourceManager.alterResourceAmount('pizza', -1);
        this.props.resourceManager.alterResourceAmount('helper', 1, false);
        this.props.eventManager.broadcast('add-roommate');
        this.props.eventManager.setFlag('first-roommate');
    },
    makePizza: function() {
        this.setState({
            makePizzaState: STATE.LOADING
        });
        
        this.props.resourceManager.alterResourceAmount('pizza', 1);

        if (this.props.eventManager.flags['warehouse-ingredients']) {
            this.props.eventManager.setFlag('warehouse-pizza');
        }
        else {
            this.props.eventManager.setFlag('work-pizza');
        }

        setTimeout(() => {
            this.state.makePizzaState = STATE.NOTHING;
            this.setState(this.state);
        }, 500);
    },
    render: function() {
        var hasMadeWorkPizza = this.props.eventManager.flags['work-pizza'];
        var hasMadeWarehousePizza = this.props.eventManager.flags['warehouse-pizza'];
        var havePizzas = this.props.resourceManager.getResource('pizza').amount >= 1;

        var havePizzaIngredients = this.props.resourceManager.canMakeResource('pizza', 1);

        var makePizzaButton = <p></p>;
        if (havePizzaIngredients) {
            makePizzaButton = <ProgressButton state={this.state.makePizzaState} onClick={this.makePizza}>Make Pizza</ProgressButton>
        }

        var shareButton = <p></p>;
        if (hasMadeWarehousePizza && havePizzas) {
            shareButton = <Button onClick={this.shareWarehousePizza}>Share Pizza with Roomates</Button>;
        }
        else if (hasMadeWorkPizza && havePizzas) {
            shareButton = <Button onClick={this.shareWorkPizza}>Share Pizza with Roomates</Button>;
        }

        return (
            <div>
                <h1> You're home! </h1>
                {makePizzaButton}
                {shareButton}
            </div>);
    }
});

const Home2 = React.createClass({
    addProfession: function(name, count) {
        this.props.eventManager.publishLog('adding ' + count + ' helpers to ' + name, 'info');
        this.props.resourceManager.assignHelpers(name, count);
    },
    removeProfession: function(name, count) {
        this.props.eventManager.publishLog('removing ' + count + ' helpers from ' + name, 'info');
        this.props.resourceManager.assignHelpers(name, -count);
    },
    addHelper: function() {
        this.props.resourceManager.alterResourceAmount('helper', 1);
    },
    componentDidMount: function() {
        ResourceStore.addChangeListener(this._onChangeResource);
    },
    componentWillUnmount: function() {
        ResourceStore.removeChangeListener(this._onChangeResource);
    },
    _onChangeResource: function() {
        this.setState(this.state);
    },
    render: function() {
        var total = Object.keys(this.props.resourceManager.professions).reduce( (a, b) =>
            a + this.props.resourceManager.professions[b].amount
        , 0);
        var helperResource = this.props.resourceManager.getResource('helper');
        var helpers = helperResource.amount;
        var unassigned = helpers - total;
        var canBuyHelper = this.props.resourceManager.canMakeResource('helper', 1);
        var helperCost = numeral(helperResource.cost.pizza).format('0.00');
        return (
            <Row> <Col md={12}>
                <Row> <Col md={12}> <h1> You're home! </h1> </Col> </Row> 
                <CharacterSection place='home' stackManager={this.props.stackManager} />
                <Row> 
                    <Col md={6}> <h3> Unassigned: {unassigned} </h3> </Col>
                    <Col md={6}> <Button disabled={!canBuyHelper} onClick={this.addHelper}> Convert helper ({helperCost} pizzas) </Button> </Col>
                </Row> 
                <Row>
                    <Col md={12}>
                        <Table striped bordered condensed hover>
                            <thead>
                                <tr>
                                    <th>Profession</th>
                                    <th>Assigned</th>
                                    <th>Add</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(this.props.resourceManager.professions).filter((prof) =>
                                     this.props.resourceManager.professions[prof].enabled
                                ).map((prof) =>
                                    <tr>
                                        <td>{this.props.resourceManager.professions[prof].name}</td>
                                        <td>{this.props.resourceManager.professions[prof].amount}</td>
                                        <td><Button disabled={unassigned <= 0} onClick={this.addProfession.bind(this, this.props.resourceManager.professions[prof].name, 1)}>+</Button></td>
                                        <td><Button disabled={this.props.resourceManager.professions[prof].amount <= 0} onClick={this.removeProfession.bind(this, this.props.resourceManager.professions[prof].name, 1)}>-</Button></td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <ProfessionUpgrade eventManager={this.props.eventManager} type='home' />
             </Col> </Row>);
    }
});

const Pappys = React.createClass({
    getInitialState: function() {
        return {
            makePizzaState: STATE.NOTHING
        };
    },
    addResource: function (resourceName) {
        this.props.resourceManager.alterResourceAmount(resourceName, 1);
        this.props.eventManager.setFlag('work-ingredients');
    },
    componentDidMount: function() {
        ResourceStore.addChangeListener(this._onChangeResource);
    },
    componentWillUnmount: function() {
        ResourceStore.removeChangeListener(this._onChangeResource);
    },
    _onChangeResource: function() {
        this.setState(this.state);
    },
    makePizzaClick: function() {
        this.setState({makePizzaState: STATE.LOADING});
        this.props.eventManager.setFlag('work-pizza');

        setTimeout(() => {
            this.setState({makePizzaState: STATE.NOTHING});
            this.addResource('pizza');
        }, 500);
    },
    render: function() {
        
        var disableMakePizza = !ResourceStore.canMakeResource('pizza', 1);

        var makePizzaState = this.state.makePizzaState;
        if (disableMakePizza && makePizzaState == STATE.NOTHING) {
            makePizzaState = STATE.DISABLED;
        }

        return (
            <div> 
                <p>Pappy’s Hometown Pizza</p>
                
                <Button bsSize="small" onClick={() => this.addResource('ingredients')}>Get Ingredients</Button>
                <ProgressButton state={makePizzaState} onClick={this.makePizzaClick}>Make a Pizza</ProgressButton>
            </div>
        );
    }
});

const Warehouse = React.createClass({
    getInitialState: function() {
        return {
            suppliesStart: null,
            suppliesState: STATE.NOTHING
        };
    },
    gatherResources: function() {
        this.props.resourceManager.alterResourceAmount('ingredients', 10);
        this.props.eventManager.publishLog('You loot some pizza supplies!', 'success');
        this.props.eventManager.setFlag('warehouse-ingredients');

        this.setState({
            suppliesStart: moment(),
            suppliesState: STATE.LOADING
        });

        setTimeout(() => {
            this.state.suppliesStart = null;
            this.state.suppliesState = STATE.NOTHING;
            this.setState(this.state);
        }, 2000);
    },
    render: function() {
        return (
            <div> 
                <p> You're at the warehouse! </p>
                <ProgressButton state={this.state.suppliesState} onClick={this.gatherResources} >Gather materials from Dumpster</ProgressButton>
            </div>);
    }
});

const InteractionDisplay = React.createClass({
    getInitialState: function() {
        return {
            resources: ResourceStore.getAllResources(),
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
    render: function() {
        var child = this.props.stackManager.currentDisplay();
        var childDisplay = child == null ? '' : child.display;
        
        return (
            <Row className='main-layout-border full-height'>
                {childDisplay}
            </Row>
        );
    }
});

module.exports = {
    InteractionDisplay,
    Home1,
    Home2,
    Warehouse,
    Pappys
};

export default InteractionDisplay;
import React from 'react';

import { Jumbotron, Button, Row, Col, Table } from 'react-bootstrap'
import ProgressButton, {STATE} from 'react-progress-button'
import ResourceStore from "../stores/ResourceStore";
import ResourceActions from "../actions/ResourceActions";
import ProfessionUpgrade from "../components/ProfessionUpgrade";
import Park from "../components/Park";
import CharacterSection from "../components/CharacterSection";
import DisplayStore from "../stores/DisplayStore";
import FlagActions from "../actions/FlagActions";
import TriggerStore from "../stores/TriggerStore";
import FlagStore from "../stores/FlagStore";
import EventActions from "../actions/EventActions";

var moment = require('moment');
var numeral = require('numeral');

const Home1 = React.createClass({
    getInitialState: function() {
        return {
            makePizzaState: STATE.NOTHING
        };
    },
    shareWorkPizza: function() {
        EventActions.publish('Your roommate thanks you', 'info');
        ResourceActions.alterResourceAmount('pizza', -1);
    },
    shareWarehousePizza: function() {
        ResourceActions.alterResourceAmount('pizza', -1);
        ResourceActions.alterResourceAmount('helper', 1, false);
        TriggerStore.pushNewGameEvent('add-roommate');
        FlagActions.setFlag('first-roommate');
    },
    makePizza: function() {
        this.setState({
            makePizzaState: STATE.LOADING
        });
        
        ResourceActions.alterResourceAmount('pizza', 1);

        if (FlagStore.getFlag('warehouse-ingredients')) {
            FlagActions.setFlag('warehouse-pizza');
        }
        else {
            FlagActions.setFlag('work-pizza');
        }

        setTimeout(() => {
            this.state.makePizzaState = STATE.NOTHING;
            this.setState(this.state);
        }, 500);
    },
    render: function() {
        var hasMadeWorkPizza = FlagStore.getFlag('work-pizza');
        var hasMadeWarehousePizza = FlagStore.getFlag('warehouse-pizza');
        var havePizzas = ResourceStore.getResource('pizza').amount >= 1;

        var havePizzaIngredients = ResourceStore.canMakeResource('pizza', 1);

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
    getInitialState: function() {
        return {
            professions: ResourceStore.getAllProfessions()
        };
    },
    addProfession: function(name, count) {
        EventActions.publish('adding ' + count + ' helpers to ' + name, 'info');
        ResourceActions.assignHelpers(name, count);
    },
    removeProfession: function(name, count) {
        EventActions.publish('removing ' + count + ' helpers from ' + name, 'info');
        ResourceActions.assignHelpers(name, -count);
    },
    addHelper: function() {
        ResourceActions.alterResourceAmount('helper', 1);
    },
    componentDidMount: function() {
        ResourceStore.addChangeListener(this._onChangeResource);
    },
    componentWillUnmount: function() {
        ResourceStore.removeChangeListener(this._onChangeResource);
    },
    _onChangeResource: function() {
        this.state.professions = ResourceStore.getAllProfessions();
        this.setState(this.state);
    },
    render: function() {
        var total = Object.keys(this.state.professions).reduce( (a, b) =>
             a + this.state.professions[b].amount
        , 0);
        var helperResource = ResourceStore.getResource('helper');
        var helpers = helperResource.amount;
        var unassigned = helpers - total;
        var canBuyHelper = ResourceStore.canMakeResource('helper', 1);
        var helperCost = numeral(helperResource.cost.pizza).format('0.00');
        var imagePrefix = "../../images/";
        return (
            <Row> <Col md={12}>
                <Row> <Col md={12}> <h1> You're home! </h1> </Col> </Row> 
                <CharacterSection place='home' />
                <Row> 
                    <Col md={6}> <h3> Unassigned: {unassigned} </h3> </Col>
                    <Col md={6}> <Button disabled={!canBuyHelper} onClick={this.addHelper}> Convert helper ({helperCost} pizzas) </Button> </Col>
                </Row> 
                <Row className="single-resource">
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
                                {Object.keys(this.state.professions).filter((prof) =>
                                     this.state.professions[prof].enabled
                                ).map((prof) =>
                                    <tr>
                                        <td>
                                            {this.state.professions[prof].name}
                                            <br />
                                            <img src={imagePrefix + this.state.professions[prof].name + ".png"} />  
                                        </td>
                                        <td>{this.state.professions[prof].amount}</td>
                                        <td><Button disabled={unassigned <= 0} onClick={this.addProfession.bind(this, this.state.professions[prof].name, 1)}>+</Button></td>
                                        <td><Button disabled={this.state.professions[prof].amount <= 0} onClick={this.removeProfession.bind(this, this.state.professions[prof].name, 1)}>-</Button></td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <ProfessionUpgrade type='home' />
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
        ResourceActions.alterResourceAmount(resourceName, 1);
        FlagActions.setFlag('work-ingredients');
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
        FlagActions.setFlag('work-pizza');

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
            suppliesState: STATE.NOTHING
        };
    },
    gatherResources: function() {
        ResourceActions.alterResourceAmount('ingredients', 10);
        EventActions.publish('You loot some pizza supplies!', 'success');
        FlagActions.setFlag('warehouse-ingredients');

        this.setState({
            suppliesState: STATE.LOADING
        });

        setTimeout(() => {
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
const PlaceMap = {
                'home': Home1,
                'home2': Home2,
                'pappy': Pappys,
                'warehouse': Warehouse,
                'park': Park
            };
    
const InteractionDisplay = React.createClass({
    getInitialState: function() {
        var displayPeek = this.getPeek();
        return {
            resources: ResourceStore.getAllResources(),
            display: displayPeek
        };
    },
    componentDidMount: function() {
        ResourceStore.addChangeListener(this._onChangeResource);
        DisplayStore.addChangeListener(this._onChangeDisplay);
    },
    componentWillUnmount: function() {
        ResourceStore.removeChangeListener(this._onChangeResource);
        DisplayStore.removeChangeListener(this._onChangeDisplay);
    },
    _onChangeResource: function() {
        this.state.resources = ResourceStore.getAllResources();
        this.setState(this.state);
    },
    getPeek: function() {
        var result = DisplayStore.peek();
        if (result.display == null) {
            var DisplayType = PlaceMap[result.name];
            result.display = <DisplayType />;
        }
        return result;
    },
    _onChangeDisplay: function() {
        this.state.display = this.getPeek();
        this.setState(this.state);
    },
    render: function() {
        var child = this.state.display;
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
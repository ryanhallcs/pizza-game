import React from 'react';

import { Jumbotron, Button } from 'react-bootstrap'
import ProgressButton, {STATE} from 'react-progress-button'

var moment = require('moment');

const Home = React.createClass({
    getInitialState: function() {
        return {
            makePizzaState: STATE.NOTHING
        };
    },
    shareWorkPizza: function() {
        this.props.eventManager.publishLog('Your roomate thanks you', 'info');
        this.props.resourceManager.alterResourceAmount('pizza', -1);
    },
    shareWarehousePizza: function() {
        this.props.resourceManager.alterResourceAmount('pizza', -1);
        this.props.eventManager.publishLog('Your roomate has a sudden urge to assist in pizza making', 'success');
        this.props.eventManager.broadcast('add-roomate');
    },
    makePizza: function() {
        this.setState({
            makePizzaState: STATE.LOADING
        });
        
        this.props.resourceManager.alterResourceAmount('pizza', 1);

        if (this.props.eventManager.flags['warehouse-ingredients']) {
            this.props.eventManager.broadcast('warehouse-pizza');
        }
        else {
            this.props.eventManager.broadcast('work-pizza');
        }

        setTimeout(() => {
            this.setState({
                makePizzaState: STATE.NOTHING
            });
        }, 2000);
    },
    render: function() {
        var hasMadeWorkPizza = this.props.eventManager.flags['work-pizza'];
        var hasMadeWarehousePizza = this.props.eventManager.flags['warehouse-pizza'];
        var havePizzas = this.props.resourceManager.getResource('pizza').amount >= 1;

        var havePizzaIngredients = this.props.resourceManager.getResource('dough').amount >= 1
                            &&  this.props.resourceManager.getResource('cheese').amount >= 1
                            &&  this.props.resourceManager.getResource('sauce').amount >= 1;

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
                <p> You're home! </p>
                {makePizzaButton}
                {shareButton}
            </div>);
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
        this.props.eventManager.broadcast('work-ingredients');
    },
    makePizzaClick: function() {
        this.setState({makePizzaState: STATE.LOADING});
        this.props.eventManager.broadcast('work-pizza');

        setTimeout(() => {
            this.setState({makePizzaState: STATE.NOTHING});
            this.addResource('pizza');
        }, 500);
    },
    render: function() {
        var disableMakePizza = !(this.props.resourceManager.getResource('dough').amount >= 1
                            &&  this.props.resourceManager.getResource('cheese').amount >= 1
                            &&  this.props.resourceManager.getResource('sauce').amount >= 1);

        var makePizzaState = this.state.makePizzaState;
        if (disableMakePizza && makePizzaState == STATE.NOTHING) {
            makePizzaState = STATE.DISABLED;
        }

        return (
            <div> 
                <p>Pappy’s Hometown Pizza</p>
                
                <Button bsSize="small" onClick={() => this.addResource('dough')}>Get Dough</Button>
                <Button bsSize="small" onClick={() => this.addResource('sauce')}>Get Sauce</Button>
                <Button bsSize="small" onClick={() => this.addResource('cheese')}>Get Cheese</Button>
                <ProgressButton state={makePizzaState} onClick={this.makePizzaClick}>Make a Pizza</ProgressButton>
            </div>
        );
    }
});

const Warehouse = React.createClass({
    getInitialState: function() {
        return {
            suppliesStart: null,
            suppliesState: STATE.NOTHING,
            suppliesCooldown: 2000
        };
    },
    // componentWillMount : function() {
    //     if (this.state.suppliesStart != null) {
    //         var currentTime = moment();

    //         var elapsedMs = currentTime.milliseconds() - this.state.suppliesStart.milliseconds();

    //         if (elapsedMs >= this.state.suppliesCooldown) {
    //             this.state.suppliesStart = null;
    //             this.state.suppliesState = STATE.NOTHING;
    //             this.setState(this.state);
    //         } else {
    //             setTimeout(() => {
    //                 this.state.suppliesStart = null;
    //                 this.state.suppliesState = STATE.NOTHING;
    //                 this.setState(this.state);
    //             }, this.state.suppliesCooldown - elapsedMs);
    //         }
    //     }
    // },
    gatherResources: function() {
        this.props.resourceManager.alterResourceAmount('dough', 10);
        this.props.resourceManager.alterResourceAmount('sauce', 10);
        this.props.resourceManager.alterResourceAmount('cheese', 10);
        this.props.eventManager.publishLog('You loot some pizza supplies!', 'info');
        this.props.eventManager.broadcast('warehouse-ingredients');

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
            displays: {
                'home': Home,
                'pappy': Pappys,
                'warehouse': Warehouse
            }
        };
    },
    render: function() {
        var Child = this.state.displays[this.props.currentDisplay];

        return (
            <Child eventManager={this.props.eventManager} resourceManager={this.props.resourceManager} />
        );
    }
});

export default InteractionDisplay;
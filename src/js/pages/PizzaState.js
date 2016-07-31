import React from 'react';

import ResourceDisplay from "../sections/ResourceDisplay";
import EventDisplay from "../sections/EventDisplay"
import InteractionDisplay from "../sections/InteractionDisplay"
import MapDisplay from "../sections/MapDisplay"
import PizzaStream from "../components/PizzaStream";
import TriggerSystem from "../components/TriggerSystem";
import { Row, Col } from 'react-bootstrap';

const Resources = [
    {
        name: 'dough',
        enabled: false,
    },
    {
        name: 'sauce',
        enabled: false,
    },
    {
        name: 'cheese',
        enabled: false,
    },
    {
        name: 'pizza',
        enabled: false,
        cost: {
            dough: 1,
            sauce: 1,
            cheese: 1
        }
    },
];

const Triggers = [
    /*
        {
            resources: {},
            currentDisplay: '',
            stats: {
                ??? todo
            },
            result: '',
            hasTriggered: bool,
            type: '',
            repeatable: bool
        }
    */
    {
        resources: {
            pizza: 2
        },
        currentDisplay: 'home',
        result: 'get-warehouse',
        resultContext: 'You run into a warehouse between work and home!',
        hasTriggered: false,
        type: 'resource'
    },
    {
        result: 'publish-stream',
        resultContext: 'Yum!',
        type: 'customEvent',
        typeContext: 'eat-pizza',
        repeatable: true
    }
];

const Flags = {
    'work-ingredients': false,
    'work-pizza': false,
    'warehouse-ingredients': false,
    'warehouse-pizza': false,
    'add-roomate': false
}

const Places = [
    {
        id: 'home',
        enabled: true,
        text: "Home",
        position: 0
    },
    {
        id: 'warehouse',
        enabled: false,
        text: "Warehouse",
        position: 1
    },
    {
        id: 'pappy',
        enabled: true,
        text: "Pappy's Pizza",
        position: 2
    },
];

const Events = {
    'get-warehouse': function(trigger, pizzaState) {
        var warehousePlace = pizzaState.places.filter(function(place) {
            return place.id == 'warehouse';
        }); 
        warehousePlace[0].enabled = true;
        trigger.hasTriggered = true;

        pizzaState.pizzaStream.publish(trigger.resultContext, 'success');
    },
    'publish-stream': function(trigger, pizzaState) {
        pizzaState.pizzaStream.publish(trigger.resultContext, 'info');
    },
    'set-flag': function(trigger, pizzaState) {
        pizzaState.flags[trigger.resultContext.id] = trigger.resultContext.value;
        trigger.hasTriggered = true;
    },
}

const PizzaState = React.createClass({
    getInitialState: function() {
        var resourceDictionary = {};
        Resources.forEach(function(resource) {
            resourceDictionary[resource.name] = this.resourceFactory(resource);
        }.bind(this));

        var flagTriggers = Object.keys(Flags).map(function(flagName) {
            return  {
                    result: 'set-flag',
                    resultContext: {
                        id: flagName,
                        value: true
                    },
                    type: 'customEvent',
                    typeContext: flagName,
                    hasTriggered: false,
                };
        });

        setInterval(this.intervalTenthSecondRunner, 100); // updates per tenth second
        setInterval(this.intervalTriggerRunner, 500);

        return {
            pizzaStream: new PizzaStream(),
            triggerSystem: new TriggerSystem(),
            resources: resourceDictionary,
            interactionDisplay: 'home',
            triggerList: Triggers.concat(flagTriggers),
            flags: Flags,
            places: Places,
            possibleEvents: Events,
            newEvents: []
        }
    },
    resourceFactory: function(resource) {
        return {
            name: resource.name,
            enabled: resource.enabled,
            ratePerSecond: 0.0,
            amount: 0.0,
            cost: resource.cost
        }
    },
    alterResourceRate: function(resourceName, rateDelta, enabled = true) {
        var state = this.state;

        var targetResource = state.resources[resourceName];
        targetResource.ratePerSecond += rateDelta;
        targetResource.enabled = enabled;
        
        this.setState(state);

        var body = 'Changed ' + resourceName + ' rate by ' + rateDelta + '!';
        var type = 'info'
        this.publishLog(body, type);
    },
    alterResourceAmount: function(resourceName, amountDelta, considerCost = true) {
        if (!this.canMakeResource(resourceName, amountDelta) || amountDelta == 0) {
            return;
        }

        var targetResource = this.state.resources[resourceName];
        targetResource.amount += amountDelta;
        
        if (targetResource.amount < 0) {
            targetResource.amount = 0;
        }

        if (amountDelta > 0) {
            targetResource.enabled = true;
        }

        if (targetResource.cost != null && considerCost && amountDelta > 0) {   
            for (var resourceCostName in targetResource.cost) {
                // don't create cycles :)
                this.alterResourceAmount(resourceCostName, -targetResource.cost[resourceCostName] * amountDelta);
            }
        }
        
        this.state.resources[resourceName] = targetResource;
        this.setState(this.state);
    },
    canMakeResource: function(resourceName, amount) {
        var resource = this.state.resources[resourceName];
        if (resource.cost == null || amount < 0) {
            return true;
        }
        
        return Object.keys(resource.cost).every(function (resourceCostName) {
            var haveOfRequirement = this.state.resources[resourceCostName].amount;
            var need = resource.cost[resourceCostName] * amount;
            return haveOfRequirement >= amount;
        }.bind(this));
    },
    getAllResources: function() {
        return this.state.resources;
    },
    getResource: function(resourceName) {
        return this.state.resources[resourceName];
    },
    intervalTriggerRunner: function() {
        var newTriggers = this.state.triggerSystem.checkTriggers(this.state.triggerList, this.state);
        if (newTriggers.length != 0) {
            newTriggers.forEach(function(newTrigger) {
                this.state.possibleEvents[newTrigger.result](newTrigger, this.state);
            }.bind(this));

            // get all customEvents and remove new events that have been triggered
            var customEventTriggers = newTriggers.filter(function(newTrigger) {
                return newTrigger.type == 'customEvent';
            });

            this.state.newEvents = this.state.newEvents.filter(function(newEvent) {
                return !customEventTriggers.some(function(customEventTrigger) {
                    return customEventTrigger.customEventId == newEvent.id;
                });
            });

            this.setState(this.state);
        }
    },
    intervalTenthSecondRunner: function() {
        for (var key in this.state.resources) {
            var resource = this.state.resources[key];

            var delta = resource.ratePerSecond / 10.0;
            this.alterResourceAmount(key, delta);
        }
    },
    publishLog: function(body, type) {
        this.state.pizzaStream.publish(body, type);
        this.setState(this.state);
    },
    changeInteractionDisplay: function(newDisplay) {
        if (newDisplay != this.state.interactionDisplay) {
            this.state.interactionDisplay = newDisplay;
            this.setState(this.state);
            this.publishLog('New destination: ' + newDisplay, 'info');
        }
    },
    resourceManagerFactory: function () {
        return {
            getResource: this.getResource,
            alterResourceAmount: this.alterResourceAmount,
            alterResourceRate: this.alterResourceRate,
            getAllResources: this.getAllResources
        };
    },
    broadcast: function(eventName, id) {
        this.state.newEvents.push({
            name: eventName,
            id: this.state.pizzaStream.generateId()
        });
        this.setState(this.state);
    },
    eventManagerFactory: function() {
        return {
            publishLog: this.publishLog,
            broadcast: this.broadcast,
            flags: this.state.flags
        };
    },
    render: function() {
        return (
            <Row className="show-grid">
                <Col md={3}>
                    <ResourceDisplay eventManager={this.eventManagerFactory()} resourceManager={this.resourceManagerFactory()} />
                </Col>
                <Col md={9}>
                    <Row className="show-grid">
                        <Col md={6}>
                            <InteractionDisplay eventManager={this.eventManagerFactory()} resourceManager={this.resourceManagerFactory()} currentDisplay={this.state.interactionDisplay} />
                        </Col>
                        <Col md={6}>
                            <EventDisplay events={this.state.pizzaStream.events} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <MapDisplay places={this.state.places} changeInteractionDisplay={this.changeInteractionDisplay} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
});

export default PizzaState;
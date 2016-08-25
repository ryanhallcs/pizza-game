import React from 'react';

import ResourceDisplay from "../sections/ResourceDisplay";
import EventDisplay from "../sections/EventDisplay"
import InteractionDisplay from "../sections/InteractionDisplay"
import MapDisplay from "../sections/MapDisplay"
import TriggerSystem from "../components/TriggerSystem";
import { Row, Col } from 'react-bootstrap';

import ResourceStore from "../stores/ResourceStore";
import ResourceActions from "../actions/ResourceActions";
import FlagStore from "../stores/FlagStore";
import FlagActions from "../actions/FlagActions";
import MapStore from "../stores/MapStore";
import MapActions from "../actions/MapActions";
import EventActions from "../actions/EventActions";

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
        result: 'add-roommate',
        type: 'customEvent',
        typeContext: 'add-roommate',
        hasTriggered: false,
    },
    {
        result: 'publish-stream',
        resultContext: 'Yum!',
        type: 'customEvent',
        typeContext: 'eat-pizza',
        repeatable: true
    }
];

const Events = {
    'get-warehouse': function(trigger, pizzaState) {
        MapActions.enablePlace('warehouse');
        trigger.hasTriggered = true;

        EventActions.publish(trigger.resultContext, 'success');
    },
    'publish-stream': function(trigger, pizzaState) {
        EventActions.publish(trigger.resultContext, 'info');
    },
    'add-roommate': function(trigger, pizzaState) {
        trigger.hasTriggered = true;
        //pizzaState.helpers[0].enabled = true;
        pizzaState.interactionDisplay = 'home2';
        MapActions.changePlace('home', 'home2');
        EventActions.publish('Wow, this pizza is great! You need help making more?', 'success');
    }
}

function generateId() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

const PizzaState = React.createClass({
    getInitialState: function() {

        setInterval(ResourceStore.tick, 100); // updates per tenth second
        setInterval(this.intervalTriggerRunner, 500);

        return {
            triggerSystem: new TriggerSystem(),
            interactionDisplay: 'home',
            triggerList: Triggers,
            possibleEvents: Events,
            newEvents: [],
            //helpers: Helpers,

            resources: ResourceStore.getAllResources().reduce((a,b) => {
                a[b.name] = b;
                return a;
            }, {}),
            flags: FlagStore.getAllFlags(),
            places: MapStore.getAllPlaces(),
            professions: ResourceStore.getAllProfessions()
        }
    },

    componentDidMount: function() {
        //ResourceStore.addChangeListener(this._onChangeResource);
        FlagStore.addChangeListener(this._onChangeFlag);
        MapStore.addChangeListener(this._onChangeMap);
    },
    componentWillUnmount: function() {
        //ResourceStore.removeChangeListener(this._onChangeResource);
        FlagStore.removeChangeListener(this._onChangeFlag);
        MapStore.removeChangeListener(this._onChangeMap);
    },
    _onChangeResource: function() {
        this.state.resources = ResourceStore.getAllResources().reduce((a,b) => {
                a[b.name] = b;
                return a;
            }, {});
        this.setState(this.state);
    },
    _onChangeFlag: function() {
        this.state.flags = FlagStore.getAllFlags();
        this.setState(this.state);
    },
    _onChangeMap: function() {
        this.state.places = MapStore.getAllPlaces();
        this.setState(this.state);
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
    changeInteractionDisplay: function(newDisplay) {
        if (newDisplay != this.state.interactionDisplay) {
            this.state.interactionDisplay = newDisplay;
            this.setState(this.state);
        }
    },
    unlockUpgrade(type, name) {
        // switch (type) {
        //     case 'helper':
        //         var upgrade = this.state.helpers.find(helper => helper.name == name);
        //         if (upgrade == null) {
        //             console.log('could not find helper ' + name);
        //             return;
        //         }
        // }
    },
    resourceManagerFactory: function () {
        return {
            getResource: ResourceStore.getResource,
            alterResourceAmount: ResourceActions.alterResourceAmount,
            getResourceRate: ResourceStore.getResourceRate,
            getAllResources: ResourceStore.getAllResources,
            canMakeResource: ResourceStore.canMakeResource,
            professions: this.state.professions,
            assignHelpers: ResourceActions.assignHelpers
        };
    },
    broadcast: function(eventName, id) {
        this.state.newEvents.push({
            name: eventName,
            id: generateId()
        });
        this.setState(this.state);
    },
    eventManagerFactory: function() {
        return {
            publishLog: EventActions.publish,
            broadcast: this.broadcast,
            setFlag: FlagActions.setFlag,
            flags: this.state.flags
        };
    },
    render: function() {
        return (
            <Row className='full-height'>
                <Col md={3}>
                    <ResourceDisplay eventManager={this.eventManagerFactory()} resourceManager={this.resourceManagerFactory()} />
                </Col>
                <Col md={4}>
                    <InteractionDisplay eventManager={this.eventManagerFactory()} resourceManager={this.resourceManagerFactory()} currentDisplay={this.state.interactionDisplay} />
                </Col>
                <Col md={5}>
                    <Row className='interaction main-layout-border'>
                        <Col md={12}>
                            <EventDisplay />
                        </Col>
                    </Row>
                    <MapDisplay places={this.state.places} changeInteractionDisplay={this.changeInteractionDisplay} />
                </Col>
            </Row>
        );
    }
});

export default PizzaState;
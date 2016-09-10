import React from 'react';

import ResourceDisplay from "../sections/ResourceDisplay";
import EventDisplay from "../sections/EventDisplay";
import MapDisplay from "../sections/MapDisplay";
import TriggerSystem from "../components/TriggerSystem";
import { Row, Col } from 'react-bootstrap';

import ResourceStore from "../stores/ResourceStore";
import ResourceActions from "../actions/ResourceActions";
import FlagStore from "../stores/FlagStore";
import FlagActions from "../actions/FlagActions";
import MapStore from "../stores/MapStore";
import MapActions from "../actions/MapActions";
import EventActions from "../actions/EventActions";

import { Home1, Home2, Pappys, Warehouse, InteractionDisplay } from "../sections/InteractionDisplay";
import Park from "../components/Park";
import CharacterSection from "../components/CharacterSection";
import SingleCharacter from "../components/SingleCharacter";

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
    'add-roommate': function(trigger, pizzaState, stackManager) {
        trigger.hasTriggered = true;
        //pizzaState.helpers[0].enabled = true;
        MapActions.changePlace('home', 'home2');
        stackManager.changeToDisplay('home2');
        EventActions.publish('Wow, this pizza is great! You need help making more?', 'success');
    }
}

const _placeMap = {
                'home': Home1,
                'home2': Home2,
                'pappy': Pappys,
                'warehouse': Warehouse,
                'park': Park
            };

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
        console.log('setting state');
        return {
            triggerSystem: new TriggerSystem(),
            triggerList: Triggers,
            possibleEvents: Events,
            newEvents: [],
            displayStack: [],

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
        ResourceStore.addChangeListener(this._onChangeResource);
        this.pushDisplayStack('home');

        FlagStore.addChangeListener(this._onChangeFlag);
        MapStore.addChangeListener(this._onChangeMap);
    },
    componentWillUnmount: function() {
        ResourceStore.removeChangeListener(this._onChangeResource);
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
        var newTriggers = this.state.triggerSystem.checkTriggers(this.state.triggerList, this.state, this.stackManagerFactory());
        if (newTriggers.length != 0) {
            newTriggers.forEach(function(newTrigger) {
                this.state.possibleEvents[newTrigger.result](newTrigger, this.state, this.stackManagerFactory());
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
    pushDisplayStack: function(name, display = null, context = null) {
        console.log('pushing: ' + name + ' to stack');
        if (this.state.displayStack.length > 0) {
            var current = this.state.displayStack[this.state.displayStack.length - 1];
            if (current.name == name) {
                return;
            }
        }

        var DisplayType = display;
        if (DisplayType == null) {
            DisplayType = _placeMap[name];
        }

        var displayElement = <DisplayType resourceManager={this.resourceManagerFactory()} stackManager={this.stackManagerFactory()} eventManager={this.eventManagerFactory()} context={context} />
        this.state.displayStack.push({
            name: name,
            display: displayElement
        });
        this.setState(this.state);
    },
    changeToDisplay: function(name, display = null) {
        this.state.displayStack.pop();
        this.pushDisplayStack(name, display);
    },
    popDisplayStack: function() {
        console.log('poppin stack!');
        this.state.displayStack.pop();
        this.setState(this.state);
    },
    currentDisplay: function() {
        if (this.state.displayStack.length == 0) {
            return null;
        }
        return this.state.displayStack[this.state.displayStack.length - 1];
    },
    stackManagerFactory: function() {
        return {
            pushDisplay: this.pushDisplayStack,
            changeToDisplay: this.changeToDisplay,
            popDisplay: this.popDisplayStack,
            currentDisplay: this.currentDisplay
        }
    },
    resourceManagerFactory: function () {
        return {
            getResource: ResourceStore.getResource,
            alterResourceAmount: ResourceActions.alterResourceAmount,
            getResourceRate: ResourceStore.getResourceRate,
            getAllResources: ResourceStore.getAllResources,
            canMakeResource: ResourceStore.canMakeResource,
            professions: this.state.professions,
            assignHelpers: ResourceActions.assignHelpers,
            getRateDetails: ResourceStore.getRateDetails
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
                    <InteractionDisplay stackManager={this.stackManagerFactory()} eventManager={this.eventManagerFactory()} resourceManager={this.resourceManagerFactory()} />
                </Col>
                <Col md={5}>
                    <Row className='interaction main-layout-border'>
                        <Col md={12}>
                            <EventDisplay />
                        </Col>
                    </Row>
                    <MapDisplay places={this.state.places} stackManager={this.stackManagerFactory()} />
                </Col>
            </Row>
        );
    }
});

export default PizzaState;
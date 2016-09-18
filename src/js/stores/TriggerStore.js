var PizzaDispatcher = require('../dispatcher/PizzaDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var PizzaConstants = require('../constants/PizzaConstants');
var EventStore = require('./EventStore');
var MapStore = require('./MapStore');
var ResourceStore = require('./ResourceStore');
import DisplayStore from "./DisplayStore";

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
    'get-warehouse': function(trigger) {
        trigger.hasTriggered = true;

        MapStore.enablePlace('warehouse');
        MapStore.emitChange();

        EventStore.publish(trigger.resultContext, 'success');
        EventStore.emitChange();
    },
    'publish-stream': function(trigger) {
        EventStore.publish(trigger.resultContext, 'info');
        EventStore.emitChange();
    },
    'add-roommate': function(trigger) {
        trigger.hasTriggered = true;

        MapStore.changePlace('home', 'home2');
        DisplayStore.changeToDisplay('home2');
        MapStore.emitChange();
        DisplayStore.emitChange();
        
        EventStore.publish('Wow, this pizza is great! You need help making more?', 'success');
        EventStore.emitChange();
    }
};

var CHANGE_EVENT = 'change';

var TriggerStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    newEvents: [],

    generateId: function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },

    pushNewGameEvent: function(name) {
        this.newEvents.push({name: name, id: this.generateId()});
    },

    tick: function() {
        var newTriggers = this.checkTriggers();
        if (newTriggers.length != 0) {
            newTriggers.forEach(function(newTrigger) {
                Events[newTrigger.result](newTrigger);
            }.bind(this));

            // get all customEvents and remove new events that have been triggered
            var customEventTriggers = newTriggers.filter(function(newTrigger) {
                return newTrigger.type == 'customEvent';
            });

            this.newEvents = this.newEvents.filter(function(newEvent) {
                return !customEventTriggers.some(function(customEventTrigger) {
                    return customEventTrigger.customEventId == newEvent.id;
                });
            });

            if (this.newEvents.length > 0) {
                this.emitChange();
            }
        }
    },

    checkTriggers: function() {

        // return all triggers 
        return Triggers.filter(function(trigger) {
            return !trigger.hasTriggered 
                && this.checkResources(trigger)
                && this.checkDisplay(trigger)
                && this.checkStats(trigger)
                && this.checkNewEvents(trigger);
        }.bind(this));
    },

    checkResources: function(trigger) {
        if (trigger.resources == null) {
            return true;
        }

        var notMet = Object.keys(trigger.resources).filter(function(requiredResourceName) {
            var numberRequired = trigger.resources[requiredResourceName];
            var have = ResourceStore.getResource(requiredResourceName).amount;
            return numberRequired > have;
        });

        return notMet.length == 0;
    },

    checkDisplay: function(trigger, pizzaState, stackManager) {
        if (trigger.currentDisplay == null || trigger.currentDisplay == '') {
            return true;
        }
        return trigger.currentDisplay == DisplayStore.peek().name;
    },

    checkStats: function(trigger, pizzaState, stackManager) {
        return true; // todo
    },

    checkNewEvents: function(trigger, pizzaState, stackManager) {
        if (trigger.type != 'customEvent') {
            return true;
        }

        return this.newEvents.some(function(newEvent) {
            if (newEvent.name == trigger.typeContext) {
                trigger.customEventId = newEvent.id;
                return true;
            }
        }, this);
    }
});

// PizzaDispatcher.register(function(action) {

//     switch (action.actionType) {

//     }
// })

export default TriggerStore;
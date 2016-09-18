var PizzaDispatcher = require('../dispatcher/PizzaDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var PizzaConstants = require('../constants/PizzaConstants');

var DisplayStack = [];

var CHANGE_EVENT = 'change';

var DisplayStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    pushDisplayStack: function(name, display, clearStack) {
        if (DisplayStack.length > 0) {
            var current = DisplayStack[DisplayStack.length - 1];
            if (current.name == name) {
                return;
            }
        }

        if (clearStack) {
            DisplayStack = [];
        }
        
        console.log('pushing: ' + name + ' to stack');
        DisplayStack.push({
            name: name,
            display: display
        });
    },
    changeToDisplay: function(name, display) {
        DisplayStack.pop();
        this.pushDisplayStack(name, display);
    },
    popDisplayStack: function() {
        console.log('poppin stack!');
        DisplayStack.pop();
    },
    peek: function() {
        if (DisplayStack.length == 0) {
            return null;
        }
        return DisplayStack[DisplayStack.length - 1];
    },
});

PizzaDispatcher.register(function(action) {

    switch(action.actionType) {
        case PizzaConstants.DisplayActionTypes.PUSH_DISPLAY:
            DisplayStore.pushDisplayStack(action.name, action.display, action.clearStack);
            DisplayStore.emitChange();
        break;
        case PizzaConstants.DisplayActionTypes.POP_DISPLAY:
            DisplayStore.popDisplayStack();
            DisplayStore.emitChange();
        break;
        case PizzaConstants.DisplayActionTypes.CHANGE_DISPLAY:
            DisplayStore.changeToDisplay(action.name, action.display);
            DisplayStore.emitChange();
        break;
        default:
        // no op
    }
});

export default DisplayStore;
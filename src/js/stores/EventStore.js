    
var PizzaDispatcher = require('../dispatcher/PizzaDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var PizzaConstants = require('../constants/PizzaConstants');
var moment = require('moment');

var _events = [];
var _maxSize = 5;

function publish(body, type) {
    _events.push({
        body: body,
        type: type,
        id: generateId(),
        timestamp: moment()
    });

    while (_events.length > _maxSize) {
        _events.shift();
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

var CHANGE_EVENT = 'change';

var EventStore = assign({}, EventEmitter.prototype, {

    getAllEvents: function() {
        return _events;
    },
  
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
  }
});

// Register callback to handle all updates
PizzaDispatcher.register(function(action) {

  switch(action.actionType) {
    case PizzaConstants.EventActionTypes.PUBLISH_EVENT:
        publish(action.body, action.type);
        EventStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = EventStore;
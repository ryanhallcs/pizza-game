    
var PizzaDispatcher = require('../dispatcher/PizzaDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var PizzaConstants = require('../constants/PizzaConstants');

var _flags = {
    'work-ingredients': false,
    'work-pizza': false,
    'warehouse-ingredients': false,
    'warehouse-pizza': false,
    'first-roommate': false
};
var CHANGE_EVENT = 'change';

function setFlag(flagName, value = true) {
    _flags[flagName] = value;
}

var FlagStore = assign({}, EventEmitter.prototype, {

  /**
   * Get specific resource.
   * @return {object}
   */
  getFlag: function(flag) {
    return _flags[flag];
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAllFlags: function() {
    return _flags;
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
    case PizzaConstants.FlagActionTypes.SET_FLAG:
        setFlag(action.flagName);
        FlagStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = FlagStore;
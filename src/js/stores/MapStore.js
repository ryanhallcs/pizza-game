    
var PizzaDispatcher = require('../dispatcher/PizzaDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var PizzaConstants = require('../constants/PizzaConstants');

var _places = {
    home: {
        id: 'home',
        enabled: true,
        text: "Home",
        position: 0
    },
    warehouse: {
        id: 'warehouse',
        enabled: false,
        text: "Warehouse",
        position: 1
    },
    pappy: {
        id: 'pappy',
        enabled: true,
        text: "Pappy's Pizza",
        position: 2
    },
    park: {
      id: 'park',
      enabled: true,
      text: "Humboldt Park",
      position: 3
    }
};

var CHANGE_EVENT = 'change';

function enablePlace(placeName) {
    _places[placeName].enabled = true;
}

function changePlace(placeName, newId) {
    _places[placeName].id = newId;
}

var MapStore = assign({}, EventEmitter.prototype, {

  /**
   * Get specific resource.
   * @return {object}
   */
  getPlace: function(place) {
    return _places[place];
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAllPlaces: function(onlyEnabled = true) {
      var array = Object.keys(_places).map(place => _places[place]);
      if (onlyEnabled) {
          return array.filter(place => place.enabled);;
      }
      
      return array;
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
    case PizzaConstants.MapActionTypes.ENABLE_PLACE:
        enablePlace(action.placeName);
        MapStore.emitChange();
      break;

      case PizzaConstants.MapActionTypes.CHANGE_PLACE:
        changePlace(action.placeName, action.newId);
        MapStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = MapStore;
    
var PizzaDispatcher = require('../dispatcher/PizzaDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var PizzaConstants = require('../constants/PizzaConstants');
import ResourceStore from "../stores/ResourceStore";
import ResourceActions from "../actions/ResourceActions";

var _professions = {
    gatherer: {
        name: 'gatherer',
        amount: 0,
        resources: [
            'ingredients'
        ],
        enabled: true
    },
    baker: {
        name: 'baker',
        amount: 0,
        resources: [
            'pizza'
        ],
        enabled: true
    },
    evangelist: {
        name: 'evangelist',
        amount: 0,
        resources: [
            'helpers'
        ],
        enabled: false
    },
    researcher: {
        name: 'researcher',
        amount: 0,
        resources: [
            'science'
        ],
        enabled: false
    }
};

var CHANGE_EVENT = 'change';

function enableProfession(placeName) {
    _professions[placeName].enabled = true;
}

function assignHelpers(professionName, amount) {
    var assigned = Object.keys(_professions).reduce((a, b) => {
        return a + _professions[b].amount;
    }, 0);
    var helpers = ResourceStore.getResource('helper').amount;
    var allowed = Math.min(helpers - assigned, amount);
    _professions[professionName].amount += allowed;

    // var activeHelpers = this.state.helpers.filter(helper => helper.enabled == true);
    // var latestHelper = activeHelpers[activeHelpers.length - 1];
    var productionRate = 0.2;
    var rateDelta = productionRate * amount;
    var resourcesAffected = _professions[professionName].resources;
    resourcesAffected.forEach(res => {
        console.log('altering rate of ' + res + ' by ' + rateDelta);
        ResourceActions.alterResourceRate(res, rateDelta);
    });
}

var ProfessionStore = assign({}, EventEmitter.prototype, {

  /**
   * Get specific resource.
   * @return {object}
   */
  getProfession: function(name) {
    return _professions[name];
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAllProfessions: function(onlyEnabled = true) {
      if (onlyEnabled) {
        var array = Object.keys(_professions).map(name => _professions[name]);
          return array.filter(prof => prof.enabled).reduce((a,b) => {
              a[b.name] = b;
              return a;
          }, {});
      }
      
      return _professions;
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
    case PizzaConstants.ProfessionActionTypes.ENABLE_PROFESSION:
        enableProfession(action.professionName);
        ProfessionStore.emitChange();
      break;

      case PizzaConstants.ProfessionActionTypes.ASSIGN_HELPERS:
        assignHelpers(action.professionName, action.amount);
        ProfessionStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = ProfessionStore;
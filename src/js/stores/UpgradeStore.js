var PizzaDispatcher = require('../dispatcher/PizzaDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var PizzaConstants = require('../constants/PizzaConstants');

var _upgrades = [
    {
        name: 'boltcutters',
        affectedResources: [
            'ingredients'
        ],
        enabled: false,
        multiple: false
    },
    {
        name: 'microwave',
        affectedResources: [
            'pizza'
        ],
        enabled: false,
        multiple: true
    }
];

/*

*/
var _helpers = [
    { 
        name:"Neighbor",
        initialCost: 10,
        enabled: true,
        bought: false,
        professions: [
            'baker',
            'gatherer'
        ],
        increaseRate: 2,
    },
    { 
        name:"Farmer",
        initialCost: 100,
        enabled: false,
        bought: false,
        professions: [
            'baker',
            'gatherer'
        ],
        increaseRate: 2,
    },
    { 
        name:"Mushroom Farmer",
        initialCost: 400,
        enabled: false,
        bought: false,
        professions: [
            'baker',
            'gatherer'
        ],
        increaseRate: 2,
    },
    { 
        name:"Food Cart",
        initialCost: 500,
        enabled: false,
        bought: false,
        professions: [
            'baker',
            'gatherer'
        ],
        increaseRate: 2,
    },
    { 
        name:"Butcher",
        initialCost: 1000,
        enabled: false,
        bought: false,
        professions: [
            'baker',
            'gatherer'
        ],
        increaseRate: 2,
    },
    { 
        name:"Food truck",
        initialCost: 10000,
        enabled: false,
        bought: false,
        professions: [
            'baker',
            'gatherer'
        ],
        increaseRate: 2,
    },
    { 
        name:"Famers' Market Stall",
        initialCost: 0,
        enabled: false,
        bought: false,
        professions: [
            'baker',
            'gatherer'
        ],
        increaseRate: 2,
    },
    { 
        name:"Pappy's Takeover",
        initialCost: 0,
        enabled: false,
        bought: false,
        professions: [
            'baker',
            'gatherer'
        ],
        increaseRate: 2,
    },
    { 
        name:"Scientist",
        initialCost: 0,
        enabled: false,
        bought: false,
        professions: [
            'baker',
            'gatherer'
        ],
        increaseRate: 2,
    },  
];

var CHANGE_EVENT = 'change';

function enableHelper(helperName) {
    _helpers.find(helper => helper.name == helperName).enabled = true;
}
function buyHelper(helperName) {
    _helpers.find(helper => helper.name == helperName).bought = true;
}

var UpgradeStore = assign({}, EventEmitter.prototype, {

  /**
   * Get specific resource.
   * @return {object}
   */
  getHelperUpgrade: function(helperName) {
    return _helpers.find(helper => helper.name == helperName);
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAllHelperUpgrades: function(onlyEnabled = true) {
      if (onlyEnabled) {
          return _helpers.filter(helper => helper.enabled);;
      }
      
      return _helpers;
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
    case PizzaConstants.UpgradeActionTypes.ENABLE_HELPER:
        enableHelper(action.helperName);
        UpgradeStore.emitChange();
      break;

    case PizzaConstants.UpgradeActionTypes.BUY_HELPER:
        buyHelper(action.helperName);
        UpgradeStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = UpgradeStore;
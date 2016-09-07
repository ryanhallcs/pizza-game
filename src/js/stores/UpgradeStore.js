var PizzaDispatcher = require('../dispatcher/PizzaDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var PizzaConstants = require('../constants/PizzaConstants');


var _helpers = [

    {
        name: 'boltcutters',
        type: 'park',
        professions: [
            'gatherer'
        ],
        enabled: false,
        increaseRate: 2,
        cost: {
            pizza: 50,
            ingredients: 20
        },
        bought: false,
    },
    {
        name: 'microwave',
        type: 'park',
        professions: [
            'baker'
        ],
        enabled: false,
        increaseRate: 2,
        cost: {
            pizza: 500,
            ingredients: 400
        },
        bought: false,
    },
    {
        name: 'wheelbarrow',
        type: 'park',
        professions: [
            'gatherer'
        ],
        enabled: false,
        increaseRate: 2,
        cost: {
            pizza: 6000,
            ingredients: 6500
        },
        bought: false
    },
    
    {
        name: 'Tote bags',
        type: 'old-jared',
        professions: [ 'gatherer' ],
        enabled: false,
        increaseRate: 2,
        cost: {
            pizza: 100,
            ingredients: 500
        },
        bought: false
    },
    {
        name: 'Backpacks',
        type: 'laura-washington',
        professions: [ 'gatherer' ],
        enabled: false,
        increaseRate: 2,
        cost: {
            pizza: 600,
            ingredients: 850
        },
        bought: false
    },
    {
        name: 'Bicycles',
        type: 'old-jared',
        professions: [ 'gatherer' ],
        enabled: false,
        increaseRate: 2,
        cost: {
            pizza: 1000,
            ingredients: 5000
        },
        bought: false
    },
    {
        name: 'Drones',
        type: 'laura-washington',
        professions: [ 'gatherer' ],
        enabled: false,
        increaseRate: 2,
        cost: {
            pizza: 9000,
            ingredients: 7500
        },
        bought: false
    },
    {
        name: 'Dumptrucks',
        type: 'old-jared',
        professions: [ 'gatherer' ],
        enabled: false,
        increaseRate: 2,
        cost: {
            pizza: 10000,
            ingredients: 50000
        },
        bought: false
    },

    { 
        name:"Neighbor",
        type: 'home',
        cost: {
            pizza: 10
        },
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
        type: 'home',
        cost: {
            pizza: 100
        },
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
        type: 'home',
        cost: {
            pizza: 1000
        },
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
        type: 'home',
        cost: {
            pizza: 10000
        },
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
        type: 'home',
        cost: {
            pizza: 100000
        },
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
        type: 'home',
        cost: {
            pizza: 1000000
        },
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
        type: 'home',
        cost: {
            pizza: 10000000
        },
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
        type: 'home',
        cost: {
            pizza: 100000000
        },
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
        type: 'home',
        cost: {
            pizza: 1000000000
        },
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

    getVisibleUpgrades: function(resources, type) {
        // update based on rates upon request
        _helpers.filter(helper => !helper.enabled).forEach(helper => {
            var allCostsMet = true;
            Object.keys(helper.cost).forEach(costKey => {
                if (resources[costKey].amount >= helper.cost[costKey] || resources[costKey].rate * 60 * 60 > helper.cost[costKey]) {
                    allCostsMet = allCostsMet && true;
                }
                else {
                    allCostsMet = false;
                }
            });

            if (allCostsMet) {
                helper.enabled = true;
            }
        });

        return _helpers.filter(helper => {
            if (type != undefined && helper.type != type) {
                return false;
            }
            return helper.enabled;
        }).map(helper => {
            helper.canBuy = Object.keys(helper.cost).reduce((result, costKey) => result && resources[costKey].amount > helper.cost[costKey], true);
            return helper;
        });;
    },

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
  getAllHelperUpgrades: function(type, onlyEnabled = true) {
      var resultHelpers = _helpers.filter(helper => helper.type == type);
      if (onlyEnabled) {
          return resultHelpers.filter(helper => helper.enabled);
      }
      
      return resultHelpers;
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
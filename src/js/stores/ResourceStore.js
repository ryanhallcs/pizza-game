    
var PizzaDispatcher = require('../dispatcher/PizzaDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var PizzaConstants = require('../constants/PizzaConstants');

var _resources = {
    ingredients: {
        name: 'ingredients',
        enabled: false,
        ratePerSecond: 0.0,
        amount: 0.0,
    },
    pizza: {
        name: 'pizza',
        enabled: false,
        cost: {
            ingredients: 3
        },
        ratePerSecond: 0.0,
        amount: 0.0,
    },
    helper: {
        name: 'helper',
        enabled: false,
        cost: {
            pizza: 3
        },
        passiveCost: {
            pizza: 0.05
        },
        ratePerSecond: 0.0,
        amount: 0.0,
    }
};

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

function alterResourceRate(resourceName, rateDelta, enabled = true) {
        console.log('altering ' + resourceName + ' by ' + rateDelta);
        var targetResource = _resources[resourceName];
        targetResource.ratePerSecond += rateDelta;
        targetResource.enabled = enabled;
}

function alterResourceAmount(resourceName, amountDelta, considerCost = true) {
        if (!canMakeResource(resourceName, amountDelta) || amountDelta == 0) {
            return;
        }

        var targetResource = _resources[resourceName];
        targetResource.amount += amountDelta;
        
        if (targetResource.amount < 0) {
            targetResource.amount = 0;
        }

        if (amountDelta > 0) {
            targetResource.enabled = true;
        }

        if (targetResource.cost != null && considerCost && amountDelta > 0) {   
            for (var resourceCostName in targetResource.cost) {
                // don't create cycles :)
                alterResourceAmount(resourceCostName, -targetResource.cost[resourceCostName] * amountDelta);
            }
        }
}

function canMakeResource(resourceName, amount) {
        var resource = _resources[resourceName];

        if (resource.cost == null || amount < 0) {
            return true;
        }
        
        return Object.keys(resource.cost).every(resourceCostName => {
            var haveOfRequirement = _resources[resourceCostName].amount;
            var need = resource.cost[resourceCostName] * amount;
            return haveOfRequirement >= need;
        });
}

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
        alterResourceRate(res, rateDelta);
    });
}

var ResourceStore = assign({}, EventEmitter.prototype, {

  /**
   * Get specific resource.
   * @return {object}
   */
  getResource: function(resourceName) {
    return _resources[resourceName];
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAllResources: function() {
    return Object.keys(_resources).map(key => _resources[key]);
  },

  canMakeResource: function(resourceName, amount) {
      return canMakeResource(resourceName, amount);
  },

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
    case PizzaConstants.ResourceActionTypes.ALTER_RESOURCE_AMOUNT:
        alterResourceAmount(action.resourceName, action.amountDelta);
        ResourceStore.emitChange();
      break;

    case PizzaConstants.ResourceActionTypes.ALTER_RESOURCE_RATE:
        alterResourceRate(action.resourceName, action.rateDelta);
        ResourceStore.emitChange();
      break;

    case PizzaConstants.ProfessionActionTypes.ENABLE_PROFESSION:
        enableProfession(action.professionName);
        ResourceStore.emitChange();
      break;

    case PizzaConstants.ProfessionActionTypes.ASSIGN_HELPERS:
        assignHelpers(action.professionName, action.amount);
        ResourceStore.emitChange();
        break;

    default:
      // no op
  }
});

module.exports = ResourceStore;
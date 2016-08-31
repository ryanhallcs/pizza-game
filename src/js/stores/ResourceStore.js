    
var PizzaDispatcher = require('../dispatcher/PizzaDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var PizzaConstants = require('../constants/PizzaConstants');

var _resources = {
    ingredients: {
        name: 'ingredients',
        enabled: false,
        amount: 0.0,
    },
    pizza: {
        name: 'pizza',
        enabled: false,
        cost: {
            ingredients: 3
        },
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
        costIncrease: {
            pizza: function(currentCost) {
                var n = Math.sqrt(currentCost * 2);
                return Math.pow(n + 1, 2) / 2;
            }
        },
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
        ratePerSecond: 0.2,
        modifiers: [],
        enabled: true
    },
    baker: {
        name: 'baker',
        amount: 0,
        resources: [
            'pizza'
        ],
        ratePerSecond: 0.2,
        modifiers: [],
        enabled: true
    },
    evangelist: {
        name: 'evangelist',
        amount: 0,
        resources: [
            'helpers'
        ],
        ratePerSecond: 0.2,
        modifiers: [],
        enabled: false
    },
    researcher: {
        name: 'researcher',
        amount: 0,
        resources: [
            'science'
        ],
        ratePerSecond: 0.2,
        modifiers: [],
        enabled: false
    }
};

var CHANGE_EVENT = 'change';

function alterResourceAmount(resourceName, amountDelta, considerCost = true) {
        if (considerCost && (!canMakeResource(resourceName, amountDelta) || amountDelta == 0)) {
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

        if (targetResource.costIncrease != null) {
            for (var key in targetResource.costIncrease) {
                targetResource.cost[key] = targetResource.costIncrease[key](targetResource.cost[key]);
            };
        }
}

function alterProfessionRate(professionName, rateFactor) {
    var profession = _professions[professionName];
    profession.ratePerSecond *= rateFactor;
}

function addModifier(modifierName, professionName, rateFactor) {
    var profession = _professions[professionName];
    profession.modifiers.push({ 
        modifierName: modifierName,
        rateFactor: rateFactor
    });
    alterProfessionRate(professionName, rateFactor);
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
    var profession = _professions[professionName];
    profession.amount += allowed;
}

var ResourceStore = assign({}, EventEmitter.prototype, {

  /**
   * Get specific resource.
   * @return {object}
   */
  getResource: function(resourceName) {
    var result = _resources[resourceName];
    result.calculatedRate = ResourceStore.getResourceRate(resourceName);
    return result;
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAllResources: function() {
    return Object.keys(_resources).map(key => ResourceStore.getResource(key));
  },

  canMakeResource: function(resourceName, amount) {
      return canMakeResource(resourceName, amount);
  },

  getResourceRate: function(resourceName) {
        var result = 0;
        Object.keys(_professions).forEach(profName => {
            var profession = _professions[profName];
            var relevantResource = profession.resources.find(res => res == resourceName);
            if (relevantResource != undefined && profession.amount != 0) {
                result += profession.ratePerSecond * profession.amount;
            }
        });
        return result;
  },

  getResourcesSimple: function() {
      return Object.keys(_resources).reduce((obj, resKey) => {
          var res = _resources[resKey];
          obj[res.name] = {
              amount: res.amount,
              rate: this.getResourceRate(res.name)
          };
          return obj;
      }, {});
  },

  /**
   * Get specific resource.
   * @return {object}
   */
  getProfession: function(name) {
        return _professions[name];
  },

  tick: function() {
        Object.keys(_professions).forEach(profName => {
            var profession = _professions[profName];
            if (profession.enabled && profession.amount != 0) {
                profession.resources.forEach(resource => {
                    var delta = (profession.ratePerSecond * profession.amount) / 10.0;

                    if (delta != 0) {
                        alterResourceAmount(resource, delta);
                    }
                });
            }
        });
        ResourceStore.emitChange();
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
        alterResourceAmount(action.resourceName, action.amountDelta, action.considerCost);
        ResourceStore.emitChange();
      break;

    case PizzaConstants.ResourceActionTypes.ADD_PROFESSION_MODIFIER:
        addModifier(action.modifierName, action.professionName, action.rateFactor);
        ResourceStore.emitChange();
      break;

    case PizzaConstants.ResourceActionTypes.ENABLE_PROFESSION:
        enableProfession(action.professionName);
        ResourceStore.emitChange();
      break;

    case PizzaConstants.ResourceActionTypes.ASSIGN_HELPERS:
        assignHelpers(action.professionName, action.amount);
        ResourceStore.emitChange();
        break;

    default:
      // no op
  }
});

module.exports = ResourceStore;
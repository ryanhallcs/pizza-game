
import PizzaDispatcher from "../dispatcher/PizzaDispatcher";
import PizzaConstants from "../constants/PizzaConstants";

var ResourceActions = {
    alterResourceAmount: function(resourceName, amountDelta) {
        PizzaDispatcher.dispatch({
            actionType: PizzaConstants.ResourceActionTypes.ALTER_RESOURCE_AMOUNT,
            resourceName: resourceName,
            amountDelta: amountDelta,
        });
    },
    alterResourceRate: function(resourceName, rateDelta) {
        PizzaDispatcher.dispatch({
            actionType: PizzaConstants.ResourceActionTypes.ALTER_RESOURCE_RATE,
            resourceName: resourceName,
            rateDelta: rateDelta
        });
    },
    addProfessionModifier: function(modifierName, professionName, rateFactor) {
        PizzaDispatcher.dispatch({
            actionType: PizzaConstants.ResourceActionTypes.ADD_PROFESSION_MODIFIER,
            modifierName: modifierName,
            professionName: professionName,
            rateFactor: rateFactor
        });
    },
    enablePlace: function(professionName) {
        PizzaDispatcher.dispatch({
            actionType: PizzaConstants.ResourceActionTypes.ENABLE_PROFESSION,
            professionName: professionName,
        });
    },
    assignHelpers: function(professionName, amount) {
        PizzaDispatcher.dispatch({
            actionType: PizzaConstants.ResourceActionTypes.ASSIGN_HELPERS,
            professionName: professionName,
            amount: amount
        });
    }
};

module.exports = ResourceActions;
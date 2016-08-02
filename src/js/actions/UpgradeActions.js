
import PizzaDispatcher from "../dispatcher/PizzaDispatcher";
import PizzaConstants from "../constants/PizzaConstants";

var UpgradeActions = {
    enableHelper: function(helperName) {
        PizzaDispatcher.dispatch({
            actionType: PizzaConstants.UpgradeActionTypes.ENABLE_HELPER,
            helperName: helperName,
        });
    },
    buyHelperUpgrade: function(helperName) {
        PizzaDispatcher.dispatch({
            actionType: PizzaConstants.UpgradeActionTypes.BUY_HELPER,
            helperName: helperName,
        });
    }
};

module.exports = UpgradeActions;
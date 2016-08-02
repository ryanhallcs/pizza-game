
import PizzaDispatcher from "../dispatcher/PizzaDispatcher";
import PizzaConstants from "../constants/PizzaConstants";

var FlagActions = {
    setFlag: function(flagName) {
        PizzaDispatcher.dispatch({
            actionType: PizzaConstants.FlagActionTypes.SET_FLAG,
            flagName: flagName,
        });
    }
};

module.exports = FlagActions;
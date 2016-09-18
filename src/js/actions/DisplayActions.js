import PizzaDispatcher from "../dispatcher/PizzaDispatcher";
import PizzaConstants from "../constants/PizzaConstants";

var DisplayActions = {
    pushDisplay: function(name, display = null, clearStack = false) {
        PizzaDispatcher.dispatch({
            actionType: PizzaConstants.DisplayActionTypes.PUSH_DISPLAY,
            name: name,
            display: display,
            clearStack: clearStack
        });
    },

    popDisplay: function() {
        PizzaDispatcher.dispatch({
            actionType: PizzaConstants.DisplayActionTypes.POP_DISPLAY
        });
    },

    changeToDisplay: function(name, display) {
        PizzaDispatcher.dispatch({
            actiontype: PizzaConstants.DisplayActionTypes.CHANGE_DISPLAY,
            name: name,
            display: display
        });
    }
};

module.exports = DisplayActions;
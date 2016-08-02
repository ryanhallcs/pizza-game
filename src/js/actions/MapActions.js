
import PizzaDispatcher from "../dispatcher/PizzaDispatcher";
import PizzaConstants from "../constants/PizzaConstants";

var MapActions = {
    enablePlace: function(placeName) {
        PizzaDispatcher.dispatch({
            actionType: PizzaConstants.MapActionTypes.ENABLE_PLACE,
            placeName: placeName,
        });
    },
    changePlace: function(placeName, newId) {
        PizzaDispatcher.dispatch({
            actionType: PizzaConstants.MapActionTypes.CHANGE_PLACE,
            placeName: placeName,
            newId: newId
        });
    }
};

module.exports = MapActions;
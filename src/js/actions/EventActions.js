
import PizzaDispatcher from "../dispatcher/PizzaDispatcher";
import PizzaConstants from "../constants/PizzaConstants";

var EventActions = {
    publish: function(body, type) {
        PizzaDispatcher.dispatch({
            actionType: PizzaConstants.EventActionTypes.PUBLISH_EVENT,
            body: body,
            type: type,
        });
    }
};

module.exports = EventActions;
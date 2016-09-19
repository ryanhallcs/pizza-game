import PizzaDispatcher from "../dispatcher/PizzaDispatcher";
import PizzaConstants from "../constants/PizzaConstants";

var CharacterActions = {
    toggleCharacter: function(name, enabled = true) {
        PizzaDispatcher.dispatch({
            actionType: PizzaConstants.CharacterActionTypes.TOGGLE_CHARACTER,
            name: name,
            enabled: enabled
        });
    },

    giveResource: function(characterName, resourceName, amount) {
        PizzaDispatcher.dispatch({
            actionType: PizzaConstants.CharacterActionTypes.GIVE_RESOURCE,
            characterName: characterName,
            resourceName: resourceName,
            amount: amount
        });
    },
};

module.exports = CharacterActions;
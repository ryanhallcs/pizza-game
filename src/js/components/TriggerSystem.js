
class TriggerSystem {
    checkTriggers(triggerList, pizzaState) {

        // return all triggers 
        return triggerList.filter(function(trigger) {
            return !trigger.hasTriggered 
                && this.checkResources(trigger, pizzaState)
                && this.checkDisplay(trigger, pizzaState)
                && this.checkStats(trigger, pizzaState)
                && this.checkNewEvents(trigger, pizzaState);
        }.bind(this));
    }

    checkResources(trigger, pizzaState) {
        if (trigger.resources == null) {
            return true;
        }

        var notMet = Object.keys(trigger.resources).filter(function(requiredResourceName) {
            var numberRequired = trigger.resources[requiredResourceName];
            var have = pizzaState.resources[requiredResourceName].amount;
            return numberRequired > have;
        });

        return notMet.length == 0;
    }

    checkDisplay(trigger, pizzaState) {
        if (trigger.currentDisplay == null || trigger.currentDisplay == '') {
            return true;
        }
        return trigger.currentDisplay == pizzaState.interactionDisplay;
    }

    checkStats(trigger, pizzaState) {
        return true; // todo
    }

    checkNewEvents(trigger, pizzaState) {
        if (trigger.type != 'customEvent') {
            return true;
        }


        return pizzaState.newEvents.some(function(newEvent) {
            if (newEvent.name == trigger.typeContext) {
                trigger.customEventId = newEvent.id;
                return true;
            }
        }, this);
    }
}

export default TriggerSystem;
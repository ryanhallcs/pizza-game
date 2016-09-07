
class TriggerSystem {
    checkTriggers(triggerList, pizzaState, stackManager) {

        // return all triggers 
        return triggerList.filter(function(trigger) {
            return !trigger.hasTriggered 
                && this.checkResources(trigger, pizzaState, stackManager)
                && this.checkDisplay(trigger, pizzaState, stackManager)
                && this.checkStats(trigger, pizzaState, stackManager)
                && this.checkNewEvents(trigger, pizzaState, stackManager);
        }.bind(this));
    }

    checkResources(trigger, pizzaState, stackManager) {
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

    checkDisplay(trigger, pizzaState, stackManager) {
        if (trigger.currentDisplay == null || trigger.currentDisplay == '') {
            return true;
        }
        return trigger.currentDisplay == pizzaState.displayStack[pizzaState.displayStack.length - 1].name;
    }

    checkStats(trigger, pizzaState, stackManager) {
        return true; // todo
    }

    checkNewEvents(trigger, pizzaState, stackManager) {
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
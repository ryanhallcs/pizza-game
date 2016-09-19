var PizzaDispatcher = require('../dispatcher/PizzaDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var PizzaConstants = require('../constants/PizzaConstants');

var CHANGE_EVENT = 'change';

const Inventory = [
    {
        name: 'boltcutters',
        owned: false
    }
];

var InventoryStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getInventory: function(ownedOnly = true) {
        return Inventory.filter(function(item) { return !ownedOnly || item.owned});
    },
    ownItem: function(name) {
        var item = Inventory.find(function(item) { return item.name == name; });
        if (item != null) {
            item.owned = true;
        }
    }
});

PizzaDispatcher.register(function(action) {

    switch(action.actionType) {
        case PizzaConstants.InventoryActionTypes.OWN_ITEM:
            InventoryStore.ownItem(action.name);
            InventoryStore.emitChange();
        break;
        default:
        // no op
    }
});

export default InventoryStore;
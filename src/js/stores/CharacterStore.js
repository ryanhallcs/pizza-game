var PizzaDispatcher = require('../dispatcher/PizzaDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var PizzaConstants = require('../constants/PizzaConstants');


var _characters = [

    {
        name: 'laura-washington',
        description: 'A friendly parkgoer',
        place: 'park',
        sayings: [
          {
            id: 'lw-hi-1',
            text: 'Hi',
            enabled: true,
            type: 'greeting'
          },
          {
            id: 'lw-hi-2',
            text: "What's up",
            enabled: true,
            type: 'greeting'
          },
          {
            id: 'lw-hi-3',
            text: 'What are you up to?',
            enabled: true,
            type: 'greeting'
          },
        ],
        enabled: true,
    },
    {
        name: 'old-jared',
        description: 'A curmudgeonly old man',
        place: 'park',
        sayings: [
          {
            id: 'oj-hi-1',
            text: 'Hi.',
            enabled: true,
            type: 'greeting'
          },
          {
            id: 'oj-hi-2',
            text: "What do you want?",
            enabled: true,
            type: 'greeting'
          },
          {
            id: 'oj-hi-3',
            text: 'Why are you talking to me?',
            enabled: true,
            type: 'greeting'
          },
        ],
        enabled: true,
    },
    {
        name: 'bonnie-wreck',
        description: 'Your roommate for better or worse',
        place: 'home',
        sayings: [
          {
            id: 'bw-hi-1',
            text: 'Yo',
            enabled: true,
            type: 'greeting'
          },
          {
            id: 'bw-hi-2',
            text: "Got a smoke?",
            enabled: true,
            type: 'greeting'
          },
        ],
        enabled: true,
    },
];

var CHANGE_EVENT = 'change';

function enableCharacter(name) {
    _characters.find(character => character.name == name).enabled = true;
}

var CharacterStore = assign({}, EventEmitter.prototype, {

  getCharacters: function(place, enabled = true) {
    return _characters.filter(character => (!enabled || character.enabled) && character.place == place);
  },

  getCharacterGreeting: function(person) {
    var greetings = person.sayings.filter(s => s.enabled && s.type == 'greeting');

    var index = Math.floor(Math.random() * greetings.length);
    return greetings[index].text;
  },
  
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
PizzaDispatcher.register(function(action) {

  switch(action.actionType) {
    case PizzaConstants.CharacterActionTypes.ENABLE_CHARACTER:
        enableCharacter(action.name);
        CharacterStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = CharacterStore;
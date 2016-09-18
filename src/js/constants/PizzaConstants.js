var keyMirror = require('keyMirror');

module.exports = {

  ResourceActionTypes: keyMirror({
    ALTER_RESOURCE_AMOUNT: null,
    ALTER_RESOURCE_RATE: null,
    ADD_PROFESSION_MODIFIER: null,
    ENABLE_PROFESSION: null,
    ASSIGN_HELPERS: null
  }),

  FlagActionTypes: keyMirror({
      SET_FLAG: null
  }),

  MapActionTypes: keyMirror({
      ENABLE_PLACE: null,
      CHANGE_PLACE: null
  }),

  EventActionTypes: keyMirror({
      PUBLISH_EVENT: null
  }),

  UpgradeActionTypes: keyMirror({
      ENABLE_HELPER: null,
      BUY_HELPER: null
  }),

  CharacterActionTypes: keyMirror({
      ENABLE_CHARACTER: null
  }),

  DisplayActionTypes: keyMirror({
      PUSH_DISPLAY: null,
      POP_DISPLAY: null,
      CHANGE_DISPLAY: null
  }),

};
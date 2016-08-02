var keyMirror = require('keyMirror');

module.exports = {

  ResourceActionTypes: keyMirror({
    ALTER_RESOURCE_AMOUNT: null,
    ALTER_RESOURCE_RATE: null
  }),

  FlagActionTypes: keyMirror({
      SET_FLAG: null
  }),

  MapActionTypes: keyMirror({
      ENABLE_PLACE: null,
      CHANGE_PLACE: null
  }),

  ProfessionActionTypes: keyMirror({
      ENABLE_PROFESSION: null,
      ASSIGN_HELPERS: null
  }),

  EventActionTypes: keyMirror({
      PUBLISH_EVENT: null
  })

};
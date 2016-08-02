var keyMirror = require('keyMirror');

module.exports = {

  ResourceActionTypes: keyMirror({
    ALTER_RESOURCE_AMOUNT: null,
    ALTER_RESOURCE_RATE: null,
    ALTER_PROFESSION_RATE: null,
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
  })

};
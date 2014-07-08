define(function(require, exports, module) {
  'use strict';

  module.exports = {
    Model: require('./model'),
    Collection: require('./collection'),

    Views: {
      Game: require('./item/game')
    }
  };
});

define(function(require, exports, module) {
  'use strict';

  module.exports = {
    Model: require('./collection'),

    Views: {
      Score: require('./item/score')
    }
  };
});

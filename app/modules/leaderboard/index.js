define(function(require, exports, module) {
  'use strict';

  module.exports = {
    Collection: require('./collection'),

    Views: {
      Page: require('./item/page')
    }
  };
});

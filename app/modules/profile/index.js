define(function(require, exports, module) {
  'use strict';

  module.exports = {
    Collection: require('./collection'),
    PageCollection: require('./pageCollection'),
    Views: {
      ProfileNav: require('./item/nav'),
      Page: require('./item/page')
    }
  };
});

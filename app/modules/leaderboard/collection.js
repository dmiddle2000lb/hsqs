define(function(require, exports, module) {
  'use strict';

  var app = require('app');

  var Collection = Backbone.Collection.extend({
    url: function(){
      return '/' + this.id + '/leaderboard/' + this.date;
    }
  });

  module.exports = Collection;
});

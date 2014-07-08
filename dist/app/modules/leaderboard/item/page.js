define(function(require, exports, module) {
  'use strict';

  var app = require('app');
  var Host = require('modules/host');
  var config = require('config');

  var Leaderboard = Backbone.View.extend({
    template: require('ldsh!./page'),
    initialize: function(){
      Host.timer.cycle(function(){
        app.router.go(Host.round);
      }, Host.get('break') );

      Host.timer.clock(Host.get('break'));

      this.model = this.collection.at(0);

    },
    serialize: function(){
      return {
        name    : this.model.get('name'),
        rank    : this.model.get('rank'),
        total   : this.model.get('total_players'),
        scores  : this.model.get('scores')
      };
    }
  });

  module.exports = Leaderboard;
});

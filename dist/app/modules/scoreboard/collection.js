define(function(require, exports, module) {
  'use strict';

  var Backbone = require('backbone');
  var app = require('app');
  var Host = require('modules/host');

  var Model = Backbone.Model.extend({
    defaults: {
      score: 0
    },
    initialize: function(){
      this.userId = app.userId;
    },

    url: function(){
      var airdate = Host.get('airdate');
      return '/user/' + this.userId + '/date/' + airdate + '/score/' + this.get('score');

    },

    updateScore: function(score){
      var current = this.get('score');
      var updated = current + score;
      //this.set('score', updated);
      this.save({ score: updated });
    }
  });

  module.exports = Model;
});

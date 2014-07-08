define(function(require, exports, module) {
  'use strict';

  var app = require('app');
  // fix path
  var Question = require('../question/view');
  var Host = require('modules/host');

  var Game = Backbone.View.extend({
    template: require('ldsh!./template'),

    initialize: function(){
      this.scoreboard = this.options.scoreboard;
      Host.set({
        airdate: this.collection.airdate,
        break: parseInt(this.collection.break) * 1000,
        question: this.collection.at(0)
      });
      this.listenTo(Host, 'change:question', this.render);
    },

    serialize: function(){
      return {
        collection: this.collection,
        gameTitle: Host.get('episode')[0].gameTitle
      };
    },

    beforeRender: function(){
      var that = this;
      this.model = Host.get('question');

      this.setView('.questions', new Question({
        model: that.model,
        collection: this.collection,
        scoreboard: that.scoreboard
      }));
    }
  });

  module.exports = Game;
});

define(function(require, exports, module) {
  'use strict';

  var app = require('app');
  var Quiz = require('modules/quiz/index');

  var Round = Backbone.View.extend({
    template: require('ldsh!./round'),

    initialize: function(){
      this.listenTo(this.collection, 'reset', this.render);
    },

    beforeRender: function(){
      // check time
      this.setViews({
        '#apple': new Quiz.Views.Game({
          collection: this.collection,
          scoreboard: this.options.scoreboard
        })
      });
    }

  });

  module.exports = Round;
});

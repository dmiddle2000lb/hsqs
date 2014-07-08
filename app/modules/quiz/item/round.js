define(function(require, exports, module) {
  'use strict';

  var app = require('app');

  var Quiz = require('modules/quiz/index');

  var Round = Backbone.View.extend({
    template: require('ldsh!./round'),
    initialize: function(){
      this.collection.fetch({ reset: true });
      this.listenTo(this.collection, 'reset', this.render);
    },
    beforeRender: function(){
      console.log('round render', this.collection.at(0));

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

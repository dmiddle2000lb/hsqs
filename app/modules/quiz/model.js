define(function(require, exports, module) {
  'use strict';

  var Backbone = require('backbone');
  var Model = Backbone.Model.extend({
    defaults: {
      guessed: false,
      isCorrect: false
    },

    shuffled: function(){
      var shuffle = [];
      this.get('a').forEach(function(answer, key){
        shuffle.push(_.zipObject([key + 1],[answer]));
      });
      return _.shuffle(shuffle);
    },

    guessed: function(answer){
      this.set({
        guessed: true,
        answered: answer
      });
    },

    index: function(){
      return this.collection.indexOf(this);
    },

    nextQuestion: function(){
      return this.collection.at(this.index() + 1);
    }
  });

  module.exports = Model;
});

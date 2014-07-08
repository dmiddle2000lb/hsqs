define(function(require, exports, module) {
  'use strict';

  var app = require('app');
  var Host = require('modules/host');
  var Model = require('modules/quiz/model');

  var Collection = Backbone.Collection.extend({
    model: Model,
    initialize: function(){
      this.round = Host.get('round');
    },

    url: function() {
      // episode/501/round/1/questions
      var episode = Host.get('episode');//[0].episode;
      return '/episode/' + episode + '/round/' + this.round + '/questions';
    },

    parse: function(data){
      this.name = data.name;
      this.break = data.break;
      this.airdate = data.airdate;
      data.questions.map(function(question){
        question.a = question.a.split(',');
        return question;
      });
      return data.questions;
    }

  });

  module.exports = Collection;
});

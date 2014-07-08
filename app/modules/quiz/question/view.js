define(function(require, exports, module) {
  'use strict';

  var app  = require('app');
  var Host = require('modules/host');
  var Timer = require('modules/timer');

  var Question = Backbone.View.extend({
    template: require("ldsh!./template"),

    events: {
      'click .answer': 'submitAnswer'
    },

    initialize: function() {
      Host.set({ready: false}, {silent: true});

      clearTimeout(this.nqDelay);

      this.scoreboard = this.options.scoreboard;
      this.question   = this.model;
      this.correct     = this.question.get('pts');
      this.incorrect = this.question.get('neg');

      this.listenTo(Host, 'change:ready', this.askQuestion);

      this.listenTo(this.model, 'change:guessed', function(){
        this.guessed.apply(this, arguments);
        this.revealAnswer.apply(this, arguments);
      });
    },

    serialize: function() {
      return {
        model   : this.model,
        answers : this.model.shuffled()
      };
    },

    guessed: function(){
      // prevent multiple answers on a single question
      this.$el.off('click', '.answer');
    },

    submitAnswer: function(e){
      var answer = this.$(e.currentTarget).data('answer');
      var score  = (answer !== 1) ? -Math.abs(this.incorrect) : this.correct;

      this.question.guessed(answer);
      this.scoreboard.updateScore(score);

    },

    revealAnswer: function(){
      var answer  = this.model.get('answered');
      var correct = this.$el.find('[data-answer="1"]');
      correct.addClass('correct');

      if (answer !== 1) {
        this.$el.find('[data-answer="'+ answer +'"]').addClass('incorrect');
      }

    },

    askQuestion: function(){
      var that = this;
      this.revealAnswer();

      if (this.question.index() !== this.collection.length - 1) {
        this.nqDelay = setTimeout(function(){
          Host.set({question: that.question.nextQuestion()});
        }, 500);
      } else {
        var nxtRound = (this.collection.round < 4) ? 'round/' + (parseInt(this.collection.round, 10) + 1) : 'game/over';
        Host.round = nxtRound;
        app.router.go('leaderboard', Host.get('airdate'));
      }
    },

    beforeRender: function(){
      var that = this;
      Host.isReady();
      Host.timer.clock(that.question.get('tq') - Host.drift());
    }

  });

  module.exports = Question;
});

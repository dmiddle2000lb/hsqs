define(function(require, exports, module) {
  'use strict';

  var app = require('app');

  var Cookie      = require('jquery.cookie');
  var Host        = require('modules/host');
  var Profile     = require('modules/profile/index');
  var Scoreboard  = require('modules/scoreboard/index');
  var Leaderboard = require('modules/leaderboard/index');
  var Quiz        = require('modules/quiz/index');
  var Round       = require('modules/round/index');
  var Clock       = require('modules/clock/view');
  var Timer       = require('modules/timer');

  // External dependencies.
  var Backbone = require('backbone');

  // Defining the application router.
  module.exports = Backbone.Router.extend({
    routes: {
      'quiz': 'index',
      '': 'index',
      '_=_': 'index',
      'login': 'login',
      'round/:round': 'round',
      'profile/:id': 'profile',
      'leaderboard/:date': 'leaderboard',
      'sync': 'sync'
    },

    go: function() {
      return this.navigate(_.toArray(arguments).join('/'), true);
    },

    initialize: function(){
      Host.gameTime();

      app.userId = $.cookie('hsqs1', function(cookie){
        var s = cookie.split(':');
        var u = s[4].split('}');
        var c = u[0].split('"').join('');
        return c;
      });

      this.quiz        = new Quiz.Collection();
      this.scoreboard  = new Scoreboard.Model();
      this.profile     = new Profile.Collection();
      this.leaderboard = new Leaderboard.Collection();

      this.profile.id = app.userId;
      this.profile.fetch({reset: true});

      this.layout = new Backbone.Layout({
        el: 'main',
        template: require('ldsh!./templates/main'),
        views: {
          '.profile-details': new Profile.Views.ProfileNav({
            collection: this.profile
          }),
          '.scoreboard': new Scoreboard.Views.Score({
            model: this.scoreboard
          }),
          '.question-timer': new Clock()
        }
      }).render();

    },

    index: function() {
      if (Host.get('gametime')) {
        this.quiz.fetch({ reset: true });
        this.layout.setViews({
          '#quiz': new Round.Views.Round({
            collection: this.quiz,
            scoreboard: this.scoreboard
          })
        });
      } else {
        app.router.go('sync');
      }
    },

    round: function(round){
      this.quiz.round = round;

      if (Host.get('gametime')) {
        this.quiz.fetch({ reset: true });
        this.layout.setViews({
          '#quiz': new Round.Views.Round({
            collection: this.quiz,
            scoreboard: this.scoreboard
          })
        });
      }
    },

    profile: function(id){
      var that = this;
      this.profilePage = new Profile.PageCollection();
      this.profilePage.id = id;
      this.profilePage.fetch({ reset: true }).success(function(){
        that.layout.setViews({
          '#quiz': new Profile.Views.Page({
            collection: that.profilePage
          })
        }).render();
        that.layout.getView('.question-timer').$el.html('<a href="/">Back</a>');
      });
    },

    leaderboard: function(date){
      var that = this;
      this.leaderboard.id = app.userId;
      this.leaderboard.date = date;
      this.leaderboard.fetch({ reset: true }).success(function(){
        that.layout.setViews({
          '#quiz': new Leaderboard.Views.Page({
            collection: that.leaderboard
          })
        }).render();
      });
    },

    sync: function(){
      this.layout.setViews({
        '#quiz': new Round.Views.Pause().render()
      });
    }
  });

});

define(function(require, exports, module) {
  'use strict';

  var app = require('app');
  var Backbone = require('backbone');
  var Timer = require('modules/timer');

  var Host = Backbone.Model.extend({
    url: function(){
      return '/gametime';
    },

    defaults: {
      ready: false
    },

    initialize: function(){
      this.timer = new Timer();
      this.listenTo(this.timer, 'change:time', this.updateClock);
      this.fetch();
    },

    isReady: function(delay){
      var that = this;
      delay = delay || (this.get('question').get('tq') - this.drift());

      this.timer.cycle(function() {
        that.set({ready: true});
      }, delay );

    },

    gameTime: function(){
      if (this.get('delay')) {
        this.doDelay();
      }
      return this.get('gametime');
    },

    doDelay: function(){
      var that = this;
      this.timer.cycle(function() {
        that.set({ gametime: true });
        app.router.go('/');
      }, this.get('delay'));
    },
    drift: function(){
      // offset for correct flash & render
      return Math.floor(Math.random() * (3000 - 1500 + 1) + 1500);
    },

    updateClock: function(){
      this.trigger('countdown', this.timer.get('time'));
    }
  });

  module.exports = new Host();
});

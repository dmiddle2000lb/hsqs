define(function(require, exports, module) {
  'use strict';

  var app = require('app');
  var Backbone = require('backbone');

  var Timer = Backbone.Model.extend({
    defaults: {
      time: 0,
      total: 0
    },

    clock: function(time) {
      this.reset(time);
      this.interval = 1000;
      this.id = setInterval(_.bind(this.updateTimeLeft, this), this.interval);
    },

    cycle: function (oncomplete, length){
      var resolution = 1;
      var steps = (length / 100) * (resolution / 10);
      var speed = length / steps;
      var count = 0;
      var start = new Date().getTime();

      function instance(){
        if (count++ >= steps){
          oncomplete(steps, count);
        } else {
          var diff = (new Date().getTime() - start) - (count * speed);
          window.setTimeout(instance, (speed - diff));
        }
      }
      window.setTimeout(instance, speed);
    },

    reset: function(time) {
      clearInterval(this.id);
      if (time < 0) return;
      if (time) this.set('total', time);
      this.set('time', this.get('total'));
    },

    updateTimeLeft: function() {
      if (this.get('time') < 500) {
        return this.reset();
      }
      var time = this.get('time');
      return this.set('time', (time - this.interval));
    }
  });

  return Timer;
});

define(function(require, exports, module) {
  'use strict';

  var Backbone = require('backbone');
  var Host = require('modules/host');

  var Clock = Backbone.View.extend({
    template: require('ldsh!./clock'),

    initialize: function(){
      Host.on('countdown', this.timeConversion, this);
    },

    serialize: function(){
      return {
        time: this.time
      };
    },

    timeConversion: function(time){
      var m, s, z = '00';
      s = ~~(time / 1000);
      //m = ~~(s / 60);
      //s = s % 60;
      s = '' + s;
      s = z.substring( 0, z.length - s.length ) + s;
      time = s;
      this.time = time;
      this.render();
    }
  });
  module.exports = Clock;
});

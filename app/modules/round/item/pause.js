define(function(require, exports, module) {
  'use strict';

  var app = require('app');
  var Host = require('modules/host');

  var Pause = Backbone.View.extend({
    template: require('ldsh!./pause'),
    initialize: function(){
      Host.timer.clock(Host.get('delay'));
    },
    beforeRender: function(){

    }

  });

  module.exports = Pause;
});

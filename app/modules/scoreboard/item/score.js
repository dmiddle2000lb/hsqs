define(function(require, exports, module) {
  'use strict';

  var app = require('app');

  var Layout = Backbone.View.extend({
    template: require('ldsh!./template'),

    initialize: function(){
      this.listenTo(this.model, 'change', this.render);
    },

    serialize: function(){
      return {
        model: this.model
      };
    }
  });

  module.exports = Layout;
});

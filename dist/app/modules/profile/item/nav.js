define(function(require, exports, module) {
  'use strict';

  var app = require('app');
  var Details = require('../item/details');

  var Nav = Backbone.View.extend({
    initialize: function(){
      this.listenTo(this.collection, 'reset', this.render);
    },
    beforeRender: function(){
      var that = this;
      this.collection.each(function(profile){
        that.setView(new Details({
          model: profile
        }));
      });
    }
  });

  module.exports = Nav;
});

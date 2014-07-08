define(function(require, exports, module) {
  'use strict';

  var app = require('app');

  var Page = Backbone.View.extend({
    template: require('ldsh!./page'),
    initialize: function(){
      this.listenTo(this.collection, 'reset', this.render);
      this.model = this.collection.at(0);
    },
    serialize: function(){
      return {
        highest : this.model.get('high_score'),
        rank    : this.model.get('rank'),
        total   : this.model.get('total_players'),
        scores  : this.model.get('scores')
      };
    }
  });

  module.exports = Page;
});

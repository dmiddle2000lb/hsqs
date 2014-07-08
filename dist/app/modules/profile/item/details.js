define(function(require, exports, module) {
  'use strict';

  var app = require('app');

  var Details = Backbone.View.extend({
    template: require('ldsh!./details'),
    className: 'details',
    events: {
      'click a.profile': 'fullProfile'
    },
    serialize: function(){
      return {
        name: this.model.get('name'),
        picture: this.model.get('picture')
      };
    },
    fullProfile: function(e){
      e.preventDefault();
      app.router.go('profile', app.userId);
    }
  });

  module.exports = Details;
});

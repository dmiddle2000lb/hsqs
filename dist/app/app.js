define(function(require, exports, module) {

  // External dependencies.
  var _ = require('underscore');
  var $ = require('jquery');
  var Backbone = require('backbone');
  var Layout = require('layoutmanager');

  // Alias the module for easier identification.
  var app = module.exports;

  // The root path to run the application through.
  app.root = '/';
  _.extend(app, Backbone.Events);
  Backbone.Layout.configure({ manage: true });
});

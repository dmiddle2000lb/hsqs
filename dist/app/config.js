// This is the runtime configuration file.  It complements the Gruntfile.js by
// supplementing shared properties.
require.config({
  paths: {
    // Make vendor easier to access.
    "vendor": "../static/js/vendor",

    // Almond is used to lighten the output filesize.
    "almond": "../static/js/vendor/bower/almond/almond",

    // Opt for Lo-Dash Underscore compatibility build over Underscore.
    "underscore": "../static/js/vendor/bower/lodash/dist/lodash.underscore",
    "lodash": "../static/js/vendor/bower/lodash/dist/lodash",
    "ldsh": "../static/js/vendor/bower/lodash-template-loader/loader",

    // Map remaining vendor dependencies.
    "jquery": "../static/js/vendor/bower/jquery/jquery",
    "fastclick": "../static/js/vendor/bower/fastclick/lib/fastclick",
    "backbone": "../static/js/vendor/bower/backbone/backbone",
    "layoutmanager": "../static/js/vendor/bower/layoutmanager/backbone.layoutmanager",
    "jquery.cookie": "../static/js/vendor/bower/jquery.cookie/jquery.cookie"
  },

  shim: {
    // This is required to ensure Backbone works as expected within the AMD
    // environment.
    "backbone": {
      // These are the two hard dependencies that will be loaded first.
      deps: ["jquery", "underscore"],

      // This maps the global `Backbone` object to `require("backbone")`.
      exports: "Backbone"
    },
    lodashLoader: {
      root: ""
    }
  }
});

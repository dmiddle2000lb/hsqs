'use strict';
var _ = require('lodash');
var db = require('./models');
var uuid = require('node-uuid');

exports = module.exports = function(app, passport) {

  var FacebookStrategy = require('passport-facebook').Strategy;
  var LocalStrategy = require('passport-local').Strategy;

  passport.use(new FacebookStrategy({
    clientID: app.get('facebook-oauth-key'),
    clientSecret: app.get('facebook-oauth-secret'),
    profileURL: 'https://graph.facebook.com/me?fields=name,first_name,last_name,link,gender,timezone,locale,picture',
    callbackURL: '/login/facebook/success'
  }, function(accessToken, refreshToken, profile, done) {
    db.User.find({ where: {id: profile._json.id} }).success(function(user){
      if (!user) {
        var pic = {
          picture: profile._json.picture.data.url
        };

        var userData = _.extend(profile._json, pic);
        db.User.create(userData).success(function(user){
          return done(null, user);
        });
      } else {
        done(null, user);
      }
    });

  }));

  passport.use(new LocalStrategy(function(username, password, done) {
    process.nextTick(function () {
      db.User.create({
        name: 'Guest',
        id: uuid.v4()
      }).success(function(user){
        return done(null, user);
      });

    });

  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

};


'use strict';
var db = require('../models');
var auth = require('../auth.js');
var moment = require('moment');

exports = module.exports = function(app, passport){
  app.get('/', function(req, res){
    res.render('splash', { user: req.user});
  });

  app.get('/quiz', auth.isAuthenticated, function(req, res){
    res.render('game', { user: req.user });
  });

  app.get('/round/*', auth.isAuthenticated, function(req, res){
    res.render('game', { user: req.user });
  });

  app.get('/account', auth.isAuthenticated, function(req, res){
    res.render('account', { user: req.user });
  });

  app.get('/login', function(req, res){
    var n = Date.now();
    // db.sequelize // UNIX_TIMESTAMP(now())
    //   .query('SELECT * FROM schedules WHERE ' + n + ' between start AND end')

    db.Schedule.findAll({
      where: ["start > ?", Date.now()],
      order: 'start ASC'
    })
      .complete(function(err, episode){
        if (!episode||!episode.length) {
          return res.render('login',{
            episode:{
              gameTitle: "Off the air"
            },
            start: null,
            gametime:false
          });
        }
        var start = moment(parseInt(episode[0].start));
        var gametime = (!episode || !episode.length) ? false : true;
        res.render('login', {
          episode: episode[0],
          start: start.format('dddd MMMM DD, YYYY h:mmA'),
          gametime: true // moment(moment().unix()).isAfter(start.unix())
        });
      });

  });

  app.post('/login/guest', passport.authenticate('local', {
    failureRedirect : '/login',
    successRedirect : '/quiz'
  }));

  app.get('/login/facebook', passport.authenticate('facebook', { display: 'touch' }));

  app.get('/login/facebook/success', passport.authenticate('facebook', {
    failureRedirect: '/login',
    successRedirect: '/quiz'
  }));

  app.get('/exit', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/leaderboard/:id', auth.isAuthenticated, function(req, res){
    res.render('game', { user: req.user });
  });

  app.get('/profile/*', auth.isAuthenticated, function(req, res){
    res.render('game', { user: req.user });
  });

  app.get('/commercial', function(req, res){
    res.redirect('/quiz');
  });

  app.get('/game/over', function(req, res){
    req.logout();
    res.redirect('/');
  });
};

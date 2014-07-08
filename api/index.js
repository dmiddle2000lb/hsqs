'use strict';

var db = require('../models');
var auth = require('../auth.js');
var async = require('async');
var _ = require('lodash');
var moment = require('moment');
var validator = require('validator');

Date.nowish = function(){
  return Date.now();
};

exports = module.exports = function(app, passport){

  app.get('/users', auth.isAuthenticated, function(req, res){
    db.User.findAll().success(function(users) {
      res.json(users);
    });
  });

  app.get('/user/:id', auth.isAuthenticated, function(req, res){
    var query = {
      where: {id: req.params.id},
      include: [{
        model: db.Score, as: 'Score'
      }]
    };

    db.User.find(query).complete(function(err, user) {
      if (err) return res.json(err, 401);
      if (!user) return res.json('no user');
      return res.json(user);
    });
  });

  app.get('/user/:id/profile', auth.isAuthenticated, function(req, res){

    // async.waterfall.
    db.Score.findAll({
      where: { userId: req.params.id },
      order: '`points` DESC'
    }).complete(function(err, score){
      if (err) return err;
      var score_date = score[0].dataValues.date;
      return db.sequelize.query('SELECT userId, points, @rank := @rank + 1 AS rank FROM' +
                         '(' +
                         'SELECT u.userId, u.points ' +
                         'FROM scores u ' +
                         'LEFT JOIN scores u2 ' +
                         'ON u.userId=u2.userId ' +
                         'AND u.`createdAt` < u2.`createdAt` ' +
                         'WHERE u2.`createdAt` IS NULL ' +
                         'ORDER BY u.points DESC' +
                         ') zz, (SELECT @rank := 0) z;')
        .complete(function(err, rank){
          if (err) return err;
          return db.Score.findAndCountAll({ where: { date: score_date }})
            .complete(function(err, count){
              if (err) return err;
              rank = _.find(rank, function(r){ return r.userId == req.params.id; });
              return res.json({
                rank: rank,
                high_score: score[0],
                total_players: count.count,
                scores: score
              });
            });
        });
    });
  });

  app.get('/gametime', function(req, res){
    var n = Date.nowish();
    db.sequelize
      .query('SELECT * FROM schedules WHERE ' + n + ' between start AND end')
      .complete(function(err, episode){
        if (err) return err;

        if (!episode.length) {
          return res.json({
            gametime: false
          });
        }
        console.log(episode[0]);
        // get the first question in the episode
        // find time diff between current time and next question time
        return db.Question.find({
          where: {
            episode: episode[0].episode,
            time: {
              gt: Date.nowish()
            }
          },
          order: 'time ASC'
        }).complete(function(err, question){
          if (!question) return res.json({
            gametime: false
          });
          //1391917649000
          var now = Date.nowish();
          var delay = (parseInt(question.time) - now); //moment(parseInt(question.time)).diff(now, 'seconds');
          return res.json({
            episode: episode[0].episode,
            gametime: false,
            delay: delay,
            round: question.round
          });
        });

      });
  });

  app.get('/episode/:episode/round/:round/questions', auth.isAuthenticated, function(req, res){
    var n = Date.nowish();
    db.sequelize // UNIX_TIMESTAMP(now())
      .query('SELECT * FROM schedules WHERE ' +n+ ' between start AND end')
    // db.Schedule.find({
    //   where: ["?", Date.now()],
    //   between: ["start AND end"]
    // })
      .complete(function(err, episode){

        if (!episode || !episode.length) {
          return res.redirect('/');
        }
        var details = episode[0];
        console.log('question episode', episode);
        db.Question.findAll({
          where: {
            episode: details.episode,
            round: req.params.round,
            time: {
              gte: Date.nowish()-5000,
              lte: details.end
            }
          }
        })
          .complete(function(err, questions){
            if (!questions || !questions.length) {
              return res.redirect('/');
            }
            var roundName;
            var round = req.params.round;
            var rounds = {
              1: 'Toss-Up',
              2: 'Head-to-Head',
              3: 'Categories',
              4: 'Lightning Round'
            };

            var brake = questions[0].break;

            if (rounds[round]) {
              roundName = rounds[round];
            }

            res.json({
              round: round,
              name: roundName,
              break: brake,
              airdate: details.start,
              gameTitle: details.gameTitle,
              questions: questions
            });
          });
      });


  });

  app.get('/:id/leaderboard/:date', auth.isAuthenticated, function(req, res){
    var guest = validator.isUUID(req.params.id);
    db.Score.findAll({
      where:
        ['date=? and name!=?', req.params.date, 'Guest'],
      include: [{
        model: db.User, as: 'Owner'
      }],
      order: 'points DESC'
    })
      .complete(function(err, scores){
        if (err) return err;

        return  db.sequelize.query('SELECT userId, points, @rank := @rank + 1 AS rank FROM' +
                                   '(' +
                                   'SELECT u.userId, u.points ' +
                                   'FROM scores u ' +
                                   'LEFT JOIN scores u2 ' +
                                   'ON u.userId=u2.userId ' +
                                   'WHERE u.date = "' + req.params.date + '"'+
                                   ' ORDER BY u.points DESC' +
                                   ') zz, (SELECT @rank := 0) z;')
          .complete(function(err, lb){
            var rank = (guest) ? [] : _.find(lb, function(r){
              return r.userId == req.params.id;
            });
            db.Score.findAll({
              where:
              ['date=?', req.params.date],
              include: [{
                model: db.User, as: 'Owner'
              }]
            }).complete(function(err, total_scores){
              res.json({
                rank: rank,
                scores: scores,
                total_players: total_scores.length
              });
            });
          });
      });
  });


  // tighter. use async.
  function updateScore(req, res){
    var params = {
      date: req.params.date,
      points: req.params.score
    };

    db.Schedule.find({where: {start: req.params.date}}).complete(function(err, schedule){
      params.game = schedule.gameTitle;
      db.User.find({
        where: { id: req.params.id }
      }).complete(function(err, user) {
        db.Score.findOrCreate({ date: params.date, userId: user.id })
          .complete(function(err, score){
            score.setOwner(user).complete(function(err, score){
              score.updateAttributes(params).complete(function(err, score){
                res.json(score);
              });
            });
          });
      });
    });
  }

  app.post('/user/:id/date/:date/score/:score', auth.isAuthenticated, function(req, res){
    updateScore(req, res);
  });

  app.put('/user/:id/date/:date/score/:score', auth.isAuthenticated, function(req, res){
    updateScore(req, res);
  });

};

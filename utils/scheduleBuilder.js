var db = require('../models');
var config = require('config').db;

var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.db_name, config.username, null, {
  dialect: 'mysql'
});

// add sched file name
var sched = require('./schedule/nesn_sched.json');
var moment = require('moment');

sched.map(function(episode){
  // format: 08/02/2014 18:00:00:00
  episode.end = moment(episode.start_date + '' + episode.start_time, ['DD/MM/YYYY H:mm:ss:SS']).add('minutes', 30).unix() * 1000;
  episode.start = moment(episode.start_date + '' + episode.start_time, ['DD/MM/YYYY H:mm:ss:SS']).unix() * 1000;
});

sequelize
  .sync({ force: true })
  .complete(function(err) {
    if (err) return err;
    db.Schedule.bulkCreate(sched, ['episode','start','end','gameTitle','channel']).success(function(epi) {
      console.log('sweet success');
    }).error(function(err){
      console.log('data error', err);
    });
  });

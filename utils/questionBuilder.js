var db = require('../models');
var config = require('config').db;

var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.db_name, config.username, null, {
  dialect: 'mysql',
  define: {
    charset: 'utf8'
  }
});

var fs = require('fs');
var moment = require('moment');
var questions = require(process.argv[2]);

var air_date = parseInt(process.argv[3]); //1391900400000

questions.map(function(question){
  var start = moment(air_date).add(moment.duration(question.start), 'ms');
  var end = moment(air_date).add(moment.duration(question.end), 'ms');
  question.time = start.unix() * 1000;
  question.tq = end.diff(start);
  return question;
});

sequelize
  .sync()
  .complete(function(err) {
    if (err) return err;
    return db.Question.bulkCreate(questions)
      .complete(function(err, questions){
        if (err) throw new Error(err);
        console.log('success');
      });
  });

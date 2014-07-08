var _ = require('lodash');
var config = require('config').db;

var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.db_name, config.username, config.password, { //'hsqs', 'root', null, {
  host: config.host,
  dialect: 'mysql'
});

var db = {};

var models = [
  'User',
  'Score',
  'Schedule',
  'Question'
];

models.forEach(function(file) {
  var model = sequelize.import(__dirname + '/' + file);
  model.sync();
  db[file] = model;
});

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].options.hasOwnProperty('associate')) {
    db[modelName].options.associate(db);
  }
});

module.exports = _.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);

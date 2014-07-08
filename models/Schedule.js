module.exports = function(sequelize, DataTypes) {
  var Sched = sequelize.define('schedule', {
    start: DataTypes.STRING,
    end: DataTypes.STRING,
    episode: DataTypes.STRING,
    gameTitle: DataTypes.STRING,
    channel: DataTypes.STRING
  });

  return Sched;
};

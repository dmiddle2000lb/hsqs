module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define('question', {
    q: DataTypes.STRING,
    a: DataTypes.STRING,
    pts: DataTypes.INTEGER,
    neg: DataTypes.INTEGER,
    ord: DataTypes.INTEGER,
    tq: DataTypes.INTEGER,
    ta: DataTypes.INTEGER,
    tl: DataTypes.INTEGER,
    time: DataTypes.STRING,
    round: DataTypes.INTEGER,
    episode: DataTypes.STRING,
    break: DataTypes.INTEGER
  });

  return Question;
};

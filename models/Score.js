module.exports = function(sequelize, DataTypes) {
  var Score = sequelize.define('score', {
    date: DataTypes.STRING,
    points: { type: DataTypes.INTEGER(4), defaultValue: 0 },
    game: DataTypes.STRING,
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
    }, {
    associate: function(models) {
      Score.belongsTo(models.User, {as: 'Owner', foreignKey: 'userId'});
    }
  });

  return Score;
};

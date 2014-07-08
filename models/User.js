module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    name: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    link: DataTypes.STRING,
    gender: DataTypes.STRING,
    timezone: DataTypes.BOOLEAN,
    locale: DataTypes.STRING,
    picture: DataTypes.STRING,
    id: DataTypes.STRING
  }, {
    associate: function(models) {
      User.hasMany(models.Score, { foreignKey: 'userId', as: 'Score' });
    }
  });

  return User;
};

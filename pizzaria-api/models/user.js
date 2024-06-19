module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        unique: true,
      },
      senha: {
        type: DataTypes.STRING(255),
      },
      tipo: {
        type: DataTypes.TINYINT,
      },
      token: {
        type: DataTypes.STRING(255),
      },
    }, {
      tableName: 'usuarios',
      timestamps: false,
    });
    return User;
  };
  
module.exports = (sequelize, DataTypes) => {
    const Pizza = sequelize.define('Pizza', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: DataTypes.STRING(100),
      },
      descricao: {
        type: DataTypes.TEXT,
      },
      valor: {
        type: DataTypes.DECIMAL(10, 2),
      },
      imagem: {
        type: DataTypes.BLOB,
      },
    }, {
      tableName: 'pizzas',
      timestamps: false,
    });
    return Pizza;
  };
  
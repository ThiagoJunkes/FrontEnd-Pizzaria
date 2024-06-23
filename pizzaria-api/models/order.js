module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
      id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },
      fk_usuario: {
          type: DataTypes.INTEGER,
      },
      valor_pago: {
          type: DataTypes.DECIMAL(10, 2),
      },
      data_pedido: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
      },
      endereco: {
          type: DataTypes.TEXT,
      },
  }, {
      tableName: 'pedidos',
      timestamps: false,
  });

  Order.associate = models => {
      Order.belongsTo(models.User, { foreignKey: 'fk_usuario' }); // Associação com o modelo de usuário
  };

  return Order;
};

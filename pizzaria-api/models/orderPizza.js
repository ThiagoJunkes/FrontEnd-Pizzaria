module.exports = (sequelize, DataTypes) => {
    const OrderPizza = sequelize.define('OrderPizza', {
      fk_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      fk_pizza: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      qtd: {
        type: DataTypes.INTEGER,
      },
      tamanho: {
        type: DataTypes.STRING(1),
      }
    }, {
      tableName: 'pedidos_pizzas',
      timestamps: false,
    });
    return OrderPizza;
  };
  
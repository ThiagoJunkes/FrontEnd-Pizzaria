const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user')(sequelize, Sequelize);
const Pizza = require('./pizza')(sequelize, Sequelize);
const Order = require('./order')(sequelize, Sequelize);
const OrderPizza = require('./orderPizza')(sequelize, Sequelize);

User.hasMany(Order, { foreignKey: 'fk_usuario' });
Order.belongsTo(User, { foreignKey: 'fk_usuario' });

Order.belongsToMany(Pizza, { through: OrderPizza, foreignKey: 'fk_pedido' });
Pizza.belongsToMany(Order, { through: OrderPizza, foreignKey: 'fk_pizza' });

sequelize.sync();

module.exports = {
  User,
  Pizza,
  Order,
  OrderPizza,
  sequelize,
};

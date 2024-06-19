const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('pizzaria_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;

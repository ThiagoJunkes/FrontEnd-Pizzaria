const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

//const sequelize = require('../config/database');

router.get('/pedidos', orderController.pedidos);

module.exports = router;

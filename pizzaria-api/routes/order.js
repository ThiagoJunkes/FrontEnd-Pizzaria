const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/pedidos', orderController.pedidos);

module.exports = router;

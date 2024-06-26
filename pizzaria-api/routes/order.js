const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/pedidos', orderController.pedidos);
router.get('/:idPedido', orderController.viewOrder);
router.post('/', orderController.addOrder);

module.exports = router;

const { Order, OrderPizza, Pizza } = require('../models');

exports.createOrder = async (req, res) => {
  const { fk_usuario, valor_pago, endereco, pizzas } = req.body;
  try {
    const order = await Order.create({
      fk_usuario,
      valor_pago,
      endereco,
    });

    const orderPizzas = pizzas.map((pizza) => ({
      fk_pedido: order.id,
      fk_pizza: pizza.id,
      qtd: pizza.qtd,
    }));

    await OrderPizza.bulkCreate(orderPizzas);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

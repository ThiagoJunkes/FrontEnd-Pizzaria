const { Pizza } = require('../models');

exports.getAllPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.findAll();
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

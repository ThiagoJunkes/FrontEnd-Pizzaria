const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user');
const pizzaRoutes = require('./routes/pizza');
const orderRoutes = require('./routes/order');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/pizzas', pizzaRoutes);
app.use('/orders', orderRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

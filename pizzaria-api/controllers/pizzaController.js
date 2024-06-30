const { sequelize } = require('../models');

exports.getAllPizzas = async (req, res) => {
  try {
      // Consulta para obter as pizzas se o ususario for 1
      const pizzasQuery = `
          SELECT * FROM pizzas
      `;

      const pizzasResult = await sequelize.query(pizzasQuery, {
        type: sequelize.QueryTypes.SELECT,
      });
  
      // Verifique se há pizzas encontradas
      if (!pizzasResult || pizzasResult.length === 0) {
        return res.status(404).json({ message: 'Nenhuma pizza encontrada' });
      }
      
      // Processar os resultados
    const formattedPizzas = pizzasResult.map((pizza) => ({
      id: pizza.id,
      nome: pizza.nome,
      descricao: pizza.descricao,
      valor: pizza.valor,
      imagem: pizza.imagem,
    }));

    // Enviar resposta JSON
    res.status(200).json(formattedPizzas);
  } catch (error) {
      console.error('Erro ao buscar pizzas:', error);
      res.status(500).json({ message: 'Erro ao buscar pizzas. Tente novamente mais tarde.' });
  }
};
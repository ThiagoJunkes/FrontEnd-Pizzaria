const { sequelize } = require('../models');

exports.getAllPizzas = async (req, res) => {
  const token = req.query.token;
  try {
      const [userIdResult] = await sequelize.query(
          'SELECT id, tipo FROM usuarios WHERE token = :token;',
          {
              replacements: { token },
              type: sequelize.QueryTypes.SELECT
          }
      );

      if (!userIdResult || userIdResult.length === 0) {
          return res.status(401).json({ message: 'Usuário não autenticado' });
      }
      
      const userTipo = userIdResult.tipo;
      if (userTipo == 0) {
        return res.status(401).json({ message: 'Usuário não autorizado' });
    }

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
      imagem: pizza.imagem,
    }));

    // Enviar resposta JSON
    res.status(200).json(formattedPizzas);
  } catch (error) {
      console.error('Erro ao buscar pizzas:', error);
      res.status(500).json({ message: 'Erro ao buscar pizzas. Tente novamente mais tarde.' });
  }
};
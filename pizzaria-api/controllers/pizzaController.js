const { sequelize, Pizza } = require('../models');
const fs = require('fs');

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

exports.addPizza = async (req, res) => {
  try {
    const token = req.query.token;
    const { nome, descricao, valor } = req.body;
    const imagem = req.file; // Obter o arquivo da requisição

    const [userIdResult] = await sequelize.query(
      'SELECT id, tipo FROM usuarios WHERE token = :token AND tipo = 1;',
      {
          replacements: { token },
          type: sequelize.QueryTypes.SELECT
      }
    );

    if (!userIdResult || userIdResult.length === 0) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    console.log("Tipo: " + userIdResult.tipo);

    if(userIdResult.tipo == 0){
      return res.status(401).json({ message: 'Usuário não autorizado' });
    }

    // Ler o arquivo de imagem como buffer
    const imageData = fs.readFileSync(imagem.path);

    // Salvar a pizza no banco de dados
    const novaPizza = await Pizza.create({
      nome,
      descricao,
      valor,
      imagem: imageData // Salvar a imagem como buffer
    });

    // Remover o arquivo do sistema de arquivos após salvar no banco de dados
    fs.unlinkSync(imagem.path);

    res.status(201).json(novaPizza); // Retornar a pizza criada
  } catch (error) {
    console.error('Erro ao adicionar pizza:', error);
    res.status(500).json({ error: 'Erro ao adicionar pizza. Tente novamente mais tarde.' });
  }
};
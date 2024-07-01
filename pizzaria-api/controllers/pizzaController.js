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

exports.editPizza = async (req, res) => {
  try {
    const token = req.query.token;
    const { nome, descricao, valor } = req.body;
    const imagem = req.file; // Obter o arquivo da requisição
    const { idPizza } = req.params;

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

    if (userIdResult.tipo === 0) {
      return res.status(401).json({ message: 'Usuário não autorizado' });
    }

    // Verificar se foi enviada uma nova imagem
    let imageData;
    if (imagem) {
      imageData = fs.readFileSync(imagem.path);
    }else{
      return res.status(401).json({ message: 'Deve ser enviada uma imagem' });
    }

    // Construir objeto com dados para atualização
    const updateData = {
      nome,
      descricao,
      valor,
    };

    // Adicionar imagem ao objeto de atualização, se existir
    if (imagem) {
      updateData.imagem = imageData;
    }

    // Atualizar a pizza no banco de dados
    const updatedPizza = await Pizza.update(updateData, {
      where: { id: idPizza },
    });

    // Remover o arquivo do sistema de arquivos após salvar no banco de dados, se existir
    if (imagem) {
      fs.unlinkSync(imagem.path);
    }

    if (updatedPizza === 0) {
      return res.status(404).json({ message: 'Pizza não foi editada' });
    }

    res.status(200).json({ message: 'Pizza atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao editar pizza:', error);
    res.status(500).json({ error: 'Erro ao editar pizza. Tente novamente mais tarde.' });
  }
};


exports.deletePizza = async (req, res) => {
  try {
    const token = req.query.token;
    const { idPizza } = req.params;

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

    if (userIdResult.tipo === 0) {
      return res.status(401).json({ message: 'Usuário não autorizado' });
    }

    // Verificar se há pedidos associados a esta pizza
    const [verificaFK] = await sequelize.query(
      'SELECT id FROM pedidos_pizzas WHERE fk_pizza = :idPizza;',
      {
        replacements: { idPizza },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (verificaFK) {
      return res.status(409).json({ message: 'Não é possível excluir a pizza porque há pedidos associados a ela' });
    }

    // Excluir a pizza no banco de dados
    const deletedPizzaCount = await Pizza.destroy({
      where: { id: idPizza },
    });

    if (deletedPizzaCount === 0) {
      return res.status(404).json({ message: 'Pizza não encontrada' });
    }

    res.status(200).json({ message: 'Pizza excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir pizza:', error);
    res.status(500).json({ error: 'Erro ao excluir pizza. Tente novamente mais tarde.' });
  }
};

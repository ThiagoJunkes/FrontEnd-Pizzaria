const { sequelize, DataTypes } = require('../models');

exports.pedidos = async (req, res) => {
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
      
      const userId = userIdResult.id;

      // Consulta para obter os pedidos do usuário com detalhes das pizzas
      const ordersQuery = `
          SELECT
              pedidos.id AS pedido_id,
              pedidos.data_pedido,
              pedidos.valor_pago,
              pp.qtd,
              pp.tamanho,
              pizzas.nome
          FROM pedidos
          JOIN pedidos_pizzas pp ON pp.fk_pedido = pedidos.id
          JOIN pizzas ON pizzas.id = pp.fk_pizza
          WHERE pedidos.fk_usuario = :userId
          ORDER BY pedidos.id
      `;

      const ordersResult = await sequelize.query(ordersQuery, 
        {
          replacements: { userId },
          type: sequelize.QueryTypes.SELECT
        });

      // Verifique se há pedidos encontrados
      if (!ordersResult || ordersResult.length === 0) {
          return res.status(404).json({ message: 'Nenhum pedido encontrado para este usuário' });
      }
      
      // Processar os resultados para agrupar por pedido_id e criar a descrição
      let formattedOrders = {};
      let descrição = "";
      let id = 0;
      ordersResult.forEach((order) => {
        if(id != order.pedido_id){
          descrição = "";
          id = order.pedido_id;
        }
        
        descrição += order.qtd + " Pizza " + order.tamanho + " " + order.nome + "; ";

        formattedOrders[order.pedido_id] = {
          pedido_id: order.pedido_id,
          data_pedido: order.data_pedido,
          valor_total: order.valor_pago,
          descricao_pizzas: descrição
        };
        
      });

      // Enviar resposta JSON
      res.status(200).json(Object.values(formattedOrders));
  } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      res.status(500).json({ message: 'Erro ao buscar pedidos. Tente novamente mais tarde.' });
  }
};

exports.viewOrder = async (req, res) => {
  const { idPedido } = req.params;
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

    const userId = userIdResult.id;
    
    const orderQuery = `
          SELECT
              pedidos.id AS pedido_id,
              pedidos.data_pedido,
              pedidos.valor_pago,
              pp.qtd,
              pp.tamanho,
              pizzas.nome,
              pedidos.endereco
          FROM pedidos
          JOIN pedidos_pizzas pp ON pp.fk_pedido = pedidos.id
          JOIN pizzas ON pizzas.id = pp.fk_pizza
          WHERE pedidos.fk_usuario = :userId
          AND pedidos.id = :idPedido
      `;

    const orderResult = await sequelize.query(orderQuery, 
      {
        replacements: { userId, idPedido },
        type: sequelize.QueryTypes.SELECT
      });

    // Verifique se há pedidos encontrados
    if (!orderResult || orderResult.length === 0) {
        return res.status(404).json({ message: 'Pedido não encontrado para este usuário' });
    }

    // Montar o JSON com a lista de pizzas
    const pizzas = orderResult.map(order => ({
      qtd: order.qtd,
      tamanho: order.tamanho,
      nome: order.nome
    }));

    const order = {
      pedido_id: orderResult[0].pedido_id,
      data_pedido: orderResult[0].data_pedido,
      valor_total: orderResult[0].valor_pago,
      endereco: orderResult[0].endereco,
      pizzas: pizzas
    };

    res.status(200).json(order);
  } catch (error) {
    console.log('Erro viewOrder: ' + error)
    res.status(500).json({ error: 'Erro ao carregar o pedido.' });
  }
};

const { sequelize } = require('../models');

exports.login = async (req, res) => {
  const { username, senha } = req.body;
  try {
    // Chama a procedure gerar_token
    await sequelize.query(
      'CALL gerar_token(:username, :senha, @token);',
      {
        replacements: { username, senha },
        type: sequelize.QueryTypes.RAW
      }
    );

    // Recupera o valor da variável de sessão @token
    const [results] = await sequelize.query(
      'SELECT @token AS token;',
      {
        type: sequelize.QueryTypes.SELECT
      }
    );

    const token = results.token;

    if (token) {
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

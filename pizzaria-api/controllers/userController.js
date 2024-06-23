const { sequelize } = require('../models');

exports.login = async (req, res) => {
  const { username, senha } = req.body;
  try {

    console.log("Login: " + username);
    // Chama a procedure gerar_token
    await sequelize.query(
      'CALL gerar_token(:username, :senha, @token);',
      {
        replacements: { username, senha },
        type: sequelize.QueryTypes.RAW
      }
    );

    // Recupera o valor da variável de sessão @token e tipo de usuário
    const [results] = await sequelize.query(
      'SELECT @token AS token, tipo FROM usuarios WHERE username = :username;',
      {
        replacements: { username },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const token = results.token;
    const tipo = results.tipo;

    if (token) {
      res.json({ token, tipo });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

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

exports.register = async (req, res) => {
  const { username, senha } = req.body;

  if (!username || !senha) {
    return res.status(400).json({ error: 'Username e senha são obrigatórios' });
  }

  try {
    console.log("Register: " + username);

    // Verifica se o username já existe
    const [validaUser] = await sequelize.query(
      'SELECT id FROM usuarios WHERE username = :username;',
      {
        replacements: { username },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (validaUser) {
      return res.status(402).json({ error: 'Username já existe' });
    }

    // Insere o novo usuário
    const [results] = await sequelize.query(
      'INSERT INTO usuarios (username, senha, tipo) VALUES (:username, :senha, 0);',
      {
        replacements: { username, senha },
        type: sequelize.QueryTypes.INSERT
      }
    );

    if (!results) {
      return res.status(402).json({ error: 'Erro ao criar usuario' });
    }

    // Redireciona para a rota de login após o registro bem-sucedido
    res.status(201).json({ message: 'Usuário criado com sucesso. Por favor, faça login.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS pizzaria_db;
USE pizzaria_db;

-- Tabela de usuários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    senha VARCHAR(255),
    tipo TINYINT,
    token VARCHAR(255)
);

-- Tabela de pizzas
CREATE TABLE pizzas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    descricao TEXT,
    imagem BLOB -- Armazenamento de arquivo de imagem
);

-- Tabela de pedidos
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_usuario INT,
    valor_pago DECIMAL(10, 2),
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    endereco TEXT,
    FOREIGN KEY (fk_usuario) REFERENCES usuarios(id)
);

-- Tabela de relação pedidos_pizzas (para registrar quais pizzas estão em cada pedido)
CREATE TABLE pedidos_pizzas (
    fk_pedido INT,
    fk_pizza INT,
    qtd INT,
    tamanho VARCHAR(1),
    PRIMARY KEY (fk_pedido, fk_pizza),
    FOREIGN KEY (fk_pedido) REFERENCES pedidos(id),
    FOREIGN KEY (fk_pizza) REFERENCES pizzas(id)
);

DELIMITER $$

CREATE PROCEDURE gerar_token(
    IN p_username VARCHAR(50),
    IN p_senha VARCHAR(255),
    OUT p_token VARCHAR(255)
)
BEGIN
    DECLARE v_count INT;
    DECLARE v_user_id INT;
    DECLARE v_random_string VARCHAR(8);

    -- Verificar se o login e senha correspondem a um usuário na tabela
    SELECT COUNT(*), id INTO v_count, v_user_id
    FROM usuarios
    WHERE username = p_username AND senha = p_senha;

    -- Se o usuário for encontrado, gerar um token
    IF v_count = 1 THEN
        -- Gerar uma string aleatória de 8 caracteres
        SET v_random_string = SUBSTRING(MD5(RAND()), 1, 8);

        -- Criar o token no formato "username-hash"
        SET p_token = CONCAT(p_username, '-', v_random_string);

        -- Atualizar a tabela usuarios com o novo token
        UPDATE usuarios
        SET token = p_token
        WHERE id = v_user_id;
    ELSE
        -- Se o usuário não for encontrado, retornar NULL
        SET p_token = NULL;
    END IF;
END $$

DELIMITER ;

-- Inserindo 3 pedidos para o usuário com id 2
INSERT INTO pedidos (fk_usuario, valor_pago, endereco)
VALUES 
(2, 25.50, 'Rua A, 123'),
(2, 30.00, 'Rua B, 456'),
(2, 45.75, 'Rua C, 789');

-- Inserindo 3 pedidos para o usuário com id 3
INSERT INTO pedidos (fk_usuario, valor_pago, endereco)
VALUES 
(3, 50.25, 'Avenida X, 101'),
(3, 60.50, 'Avenida Y, 202'),
(3, 75.00, 'Avenida Z, 303');

INSERT INTO pizzas (nome, descricao) VALUES ('Margherita', 'Molho de tomate, mussarela, manjericão');
INSERT INTO pizzas (nome, descricao) VALUES ('Pepperoni', 'Molho de tomate, mussarela, pepperoni');
INSERT INTO pizzas (nome, descricao) VALUES ('Quatro Queijos', 'Molho de tomate, mussarela, gorgonzola, parmesão, provolone');
INSERT INTO pizzas (nome, descricao) VALUES ('Calabresa', 'Molho de tomate, mussarela, calabresa, cebola');

-- Inserindo pizzas nos pedidos do usuário com id 2
INSERT INTO pedidos_pizzas (fk_pedido, fk_pizza, qtd, tamanho)
VALUES
(1, 1, 2, 'M'), -- Pedido 1: 2 pizzas Margherita tamanho Médio
(1, 2, 1, 'G'), -- Pedido 1: 1 pizza Pepperoni tamanho Grande
(2, 3, 1, 'P'), -- Pedido 2: 1 pizza Quatro Queijos tamanho Pequeno
(2, 4, 2, 'M'), -- Pedido 2: 2 pizzas Calabresa tamanho Médio
(3, 1, 3, 'G'), -- Pedido 3: 3 pizzas Margherita tamanho Grande
(3, 2, 1, 'M'); -- Pedido 3: 1 pizza Pepperoni tamanho Médio

-- Inserindo pizzas nos pedidos do usuário com id 3
INSERT INTO pedidos_pizzas (fk_pedido, fk_pizza, qtd, tamanho)
VALUES
(4, 1, 1, 'P'), -- Pedido 4: 1 pizza Margherita tamanho Pequeno
(4, 3, 2, 'G'), -- Pedido 4: 2 pizzas Quatro Queijos tamanho Grande
(5, 2, 3, 'M'), -- Pedido 5: 3 pizzas Pepperoni tamanho Médio
(5, 4, 1, 'G'), -- Pedido 5: 1 pizza Calabresa tamanho Grande
(6, 1, 2, 'M'), -- Pedido 6: 2 pizzas Margherita tamanho Médio
(6, 4, 2, 'G'); -- Pedido 6: 2 pizzas Calabresa tamanho Grande
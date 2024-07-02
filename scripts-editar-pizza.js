const url = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function() {
    // Puxar o ID da pizza do sessionStorage
    const idPizza = sessionStorage.getItem('idpizza');
  
    // Verificar se o ID da pizza está presente
    if (!idPizza) {
      console.error('ID da pizza não encontrado no sessionStorage.');
      window.location.href = './area-admin.html';
      return;
    }
  
    // Selecionar o formulário de edição de pizza
    const editPizzaForm = document.getElementById('editPizzaForm');
  
    // Carregar os dados da pizza para edição
    fetchPizzaData(idPizza);
  
    // Função para carregar os dados da pizza para edição
    async function fetchPizzaData(idPizza) {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(`${url}/pizzas/${idPizza}?token=${token}`);
        if (!response.ok) {
          throw new Error('Erro ao obter dados da pizza.');
        }
        const pizzaData = await response.json();
        populateFormFields(pizzaData);
      } catch (error) {
        console.error('Erro ao carregar dados da pizza:', error);
        // Tratar o erro conforme necessário, por exemplo, redirecionar para outra página ou mostrar uma mensagem de erro.
      }
    }
  
    // Função para preencher os campos do formulário com os dados da pizza
    function populateFormFields(pizzaData) {
      const { nome, descricao, valor, imagem } = pizzaData;
  
      // Preencher os campos do formulário com os dados da pizza
      document.getElementById('nomePizza').value = nome;
      document.getElementById('descricaoPizza').value = descricao;
      document.getElementById('valorPizza').value = valor;
  
      // Preencher a visualização da imagem atual da pizza, se houver imagem
      if (imagem) {
        const visualizacaoImagem = document.getElementById('visualizacaoImagem');
        visualizacaoImagem.src = 'pizzaria-api/'+imagem;
      }
    }
  
    // Adicionar evento de envio do formulário
    editPizzaForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevenir o envio padrão do formulário
  
      // Implementar lógica para enviar os dados atualizados da pizza para a API
      // Aqui você pode usar fetch() para enviar os dados para a rota de edição da pizza
      // Lembre-se de enviar o token de autenticação e o ID da pizza junto com os dados atualizados.
    });
  });
  
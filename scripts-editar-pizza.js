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
    editPizzaForm.addEventListener('submit', async function(event) {
      event.preventDefault(); // Prevenir o envio padrão do formulário
  
      const nomePizza = document.getElementById('nomePizza').value;
    const descricaoPizza = document.getElementById('descricaoPizza').value;
    const valorPizza = document.getElementById('valorPizza').value;
    const imagemPizza = document.getElementById('imagemPizza').files[0];

    if (!descricaoPizza) {
      alert('Por favor, preencha o campo de descrição.');
      return;
    }

    const formData = new FormData();
    formData.append('nome', nomePizza);
    formData.append('descricao', descricaoPizza);
    formData.append('valor', valorPizza);
    if (imagemPizza) {
      formData.append('imagem', imagemPizza);
    }

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${url}/pizzas/edit/${idPizza}?token=${token}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar dados da pizza.');
      }

      const result = await response.json();
      console.log('Pizza atualizada com sucesso:', result);
      // Redirecionar para a área admin ou mostrar uma mensagem de sucesso
      window.location.href = './area-admin.html';
    } catch (error) {
      console.error('Erro ao atualizar dados da pizza:', error);
      // Mostrar uma mensagem de erro ao usuário
    }
  });
  });
  
const url = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function() {
  const idPizza = sessionStorage.getItem('idpizza');

  if (!idPizza) {
    console.error('ID da pizza não encontrado no sessionStorage.');
    window.location.href = './area-admin.html';
    return;
  }

  const editPizzaForm = document.getElementById('editPizzaForm');
  fetchPizzaData(idPizza);

  async function fetchPizzaData(idPizza) {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${url}/pizzas/${idPizza}?token=${token}`);
      if (!response.ok) {
        throw new Error('Erro ao obter dados da pizza.');
      }
      const pizzaData = await response.json();
      console.log("Nome1: " + pizzaData[0].nome);
      if (Array.isArray(pizzaData) && pizzaData.length > 0) {
        const pizza = pizzaData[0];
        console.log("Nome da pizza: " + pizza.nome);

        populateFormFields(pizza);
      }
      else{
        populateFormFields(pizzaData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados da pizza:', error);
    }
  }

  function populateFormFields(pizzaData) {
    const { nome, descricao, valor, imagem } = pizzaData;

    console.log("Nome: " + nome);
    document.getElementById('nomePizza').value = nome;
    document.getElementById('descricaoPizza').value = descricao;
    document.getElementById('valorPizza').value = valor;

    if (imagem) {
      const visualizacaoImagem = document.getElementById('visualizacaoImagem');
      visualizacaoImagem.src = `data:image/jpeg;base64,${imagem}`;
      visualizacaoImagem.alt = nome;
    }
  }

  editPizzaForm.addEventListener('submit', async function(event) {
    event.preventDefault();

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
      window.location.href = './area-admin.html';
    } catch (error) {
      console.error('Erro ao atualizar dados da pizza:', error);
    }
  });
});

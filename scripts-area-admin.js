const url = 'http://localhost:3000';

function fetchPizzas() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Usuário não autenticado. Por favor, faça login.');
      window.location.href = './login.html';
      return;
    }
  
    fetch(url + `/pizzas`, {
      method: 'GET'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar pizzas.');
      }
      return response.json();
    })
    .then(pizzas => {
      const pizzaTableBody = document.getElementById('pizzaTableBody');
      pizzaTableBody.innerHTML = '';
  
      pizzas.forEach(pizza => {
        const tr = document.createElement('tr');
  
        const tdName = document.createElement('td');
        tdName.textContent = pizza.nome;
        tr.appendChild(tdName);

        const tdValue = document.createElement('td');
        tdValue.textContent = `R$ ${parseFloat(pizza.valor).toFixed(2)}`;
        tr.appendChild(tdValue);
  
        const tdDescription = document.createElement('td');
        const maxLength = 100; // Ajuste o comprimento máximo conforme necessário
        if (pizza.descricao.length > maxLength) {
            tdDescription.textContent = pizza.descricao.substring(0, maxLength) + '...';
        } else {
            tdDescription.textContent = pizza.descricao || 'Sem descrição';
        }
        tr.appendChild(tdDescription);
  
        const tdActions = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('btn', 'btn-warning', 'me-2');
        editButton.addEventListener('click', () => {
            // Adicionar lógica para editar pizza
        });
        tdActions.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.addEventListener('click', () => {
            // Adicionar lógica para excluir pizza
        });
        tdActions.appendChild(deleteButton);

        tr.appendChild(tdActions);
  
        pizzaTableBody.appendChild(tr);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar pizzas:', error);
      alert('Erro ao carregar pizzas. Tente novamente mais tarde.');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    fetchPizzas();
  
    document.getElementById('addPizzaBtn').addEventListener('click', function () {
        // Adicionar lógica para adicionar pizza
    });
  });

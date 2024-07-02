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
            editPizza(pizza.id);
        });
        tdActions.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.addEventListener('click', () => {
          const confirmed = confirm(`Tem certeza que deseja excluir a pizza ${pizza.nome}?`);
          if (confirmed) {
              deletePizza(pizza.id); // Chama a função para excluir a pizza pelo ID
          }
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

  function editPizza(pizzaId){
    sessionStorage.setItem('idpizza', pizzaId);

    window.location.href = './editar-pizza.html';
  }
  function deletePizza(pizzaId) {
    const token = sessionStorage.getItem('token');
    fetch(`${url}/pizzas/${pizzaId}?token=${token}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.status === 404) {
            return response.json().then(data => {
                throw new Error(`Erro ao excluir pizza: ${data.message}`);
            });
        }
        if (response.status === 409) {
            return response.json().then(data => {
                throw new Error(`Erro ao excluir pizza: ${data.message}`);
            });
        }
        if (!response.ok) {
            throw new Error('Erro ao excluir pizza.');
        }
        // Atualiza a lista de pizzas após a exclusão
        fetchPizzas();
    })
    .catch(error => {
        console.error('Erro ao excluir pizza:', error.message);
        alert(error.message || 'Erro ao excluir pizza. Tente novamente mais tarde.');
    });
}

  document.addEventListener('DOMContentLoaded', function () {
    fetchPizzas();
  });

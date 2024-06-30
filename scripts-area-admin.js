const url = 'http://localhost:3000';

function fetchOrders() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Usuário não autenticado. Por favor, faça login.');
      window.location.href = './login.html';
      return;
    }
  
    fetch(url + `/orders?token=${token}`, {
      method: 'GET'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar pedidos.');
      }
      return response.json();
    })
    .then(orders => {
      const ordersTableBody = document.getElementById('ordersTableBody');
      ordersTableBody.innerHTML = '';
  
      orders.forEach(order => {
        const tr = document.createElement('tr');
  
        const tdDate = document.createElement('td');
        tdDate.textContent = new Date(order.data_pedido).toLocaleDateString();
        tr.appendChild(tdDate);
  
        const tdValue = document.createElement('td');
        tdValue.textContent = `R$ ${order.valor_pago.toFixed(2)}`;
        tr.appendChild(tdValue);
  
        const tdDescription = document.createElement('td');
        tdDescription.textContent = order.descricao;
        tr.appendChild(tdDescription);
  
        ordersTableBody.appendChild(tr);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar pedidos:', error);
      alert('Erro ao carregar pedidos. Tente novamente mais tarde.');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    fetchOrders();
  
    document.getElementById('addOrderBtn').addEventListener('click', function () {
        // Adicionar lógica para adicionar pedido
    });
  });
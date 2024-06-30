import { url } from './scripts.js';

function fetchOrders() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        alert('Usuário não autenticado. Por favor, faça login.');
        window.location.href = './login.html';
        return;
    }

    console.log('Usuário logado');
  
    fetch(url + `/orders/pedidos?token=${token}`, {
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
            if (order.valor_total !== undefined && order.valor_total !== null) {
                tdValue.textContent = `R$ ${parseFloat(order.valor_total).toFixed(2)}`;
            } else {
                tdValue.textContent = 'N/A';
            }
            tr.appendChild(tdValue);
  
            const tdDescription = document.createElement('td');
            const maxLength = 50; // Ajuste o comprimento máximo conforme necessário
            if (order.descricao_pizzas.length > maxLength) {
                tdDescription.textContent = order.descricao_pizzas.substring(0, maxLength) + '...';
            } else {
                tdDescription.textContent = order.descricao_pizzas || 'Sem descrição';
            }
            tr.appendChild(tdDescription);
  
            const tdViewButton = document.createElement('td');
            const viewButton = document.createElement('button');
            viewButton.textContent = 'Visualizar';
            viewButton.classList.add('btn', 'btn-primary');
            viewButton.addEventListener('click', () => {
                window.location.href = `${url}/order/${order.pedido_id}`;
            });
            tdViewButton.appendChild(viewButton);
            tr.appendChild(tdViewButton);
  
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

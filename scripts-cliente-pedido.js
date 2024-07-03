function fetchOrderDetails() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        alert('Usuário não autenticado. Por favor, faça login.');
        window.location.href = './login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const idPedido = urlParams.get('idPedido');

    fetch(`${url}/orders/${idPedido}?token=${token}`, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Pedido não encontrado para este usuário');
        }
        return response.json();
    })
    .then(order => {
        const orderDetails = document.getElementById('orderDetails');
        orderDetails.innerHTML = `
            <p><strong>Data:</strong> ${new Date(order.data_pedido).toLocaleDateString()}</p>
            <p><strong>Valor Total:</strong> R$ ${parseFloat(order.valor_total).toFixed(2)}</p>
            <p><strong>Endereço:</strong> ${order.endereco}</p>
            <h3>Pizzas</h3>
            <ul>
                ${order.pizzas.map(pizza => `<li>${pizza.qtd} Pizza ${pizza.tamanho} ${pizza.nome}</li>`).join('')}
            </ul>
        `;
    })
    .catch(error => {
        console.error('Erro ao carregar pedido:', error);
        const orderDetails = document.getElementById('orderDetails');
        orderDetails.innerHTML = `
            <p><strong>Data:</strong> </p>
            <p><strong>Valor Total:</strong> </p>
            <p><strong>Endereço:</strong> </p>
            <h3>Pizzas</h3>
            <ul>
                <li>Sem descrição</li>
            </ul>
        `;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    fetchOrderDetails();
    document.getElementById('backBtn').addEventListener('click', function () {
        window.location.href = './area-cliente.html';
    });
});

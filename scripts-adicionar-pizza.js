const url = 'http://localhost:3000';

document.getElementById('addPizzaForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const token = sessionStorage.getItem('token');
  if (!token) {
    alert('Usuário não autenticado. Por favor, faça login.');
    window.location.href = './login.html';
    return;
  }

  const formData = new FormData(this);

  // Obter o valor do campo de valor e substituir vírgula por ponto
  let valor = formData.get('valor');
  valor = valor.replace(',', '.');
  formData.set('valor', valor);

  fetch(`${url}/pizzas?token=${token}`, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      throw new Error(data.error);
    }
    alert('Pizza adicionada com sucesso!');
    window.location.href = './area-admin.html';
  })
  .catch(error => {
    console.error('Erro ao adicionar pizza:', error);
    alert('Erro ao adicionar pizza. Tente novamente mais tarde.');
  });
});

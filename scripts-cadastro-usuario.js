async function criarUsuario(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const senha = document.getElementById('senha').value;
  const repetirSenha = document.getElementById('repetir_senha').value;
  const errorMessage = document.getElementById('error-message');

  if (!validarCadastro()) {
    return;
  }

  try {
    const response = await fetch(url + '/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Usuário criado com sucesso.');
      await loginUsuario(username, senha);
    } else if (data.error === 'Username já existe') {
      errorMessage.textContent = 'Username já existe';
    } else {
      errorMessage.textContent = 'Erro ao criar usuário. Tente novamente.';
    }
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    errorMessage.textContent = 'Erro ao criar usuário. Tente novamente.';
  }
}

async function loginUsuario(username, senha) {
  try {
    const response = await fetch(url + '/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      const { token, tipo } = data;
      sessionStorage.setItem('token', token);

      if (tipo === 1) {
        window.location.href = './area-admin.html';
      } else {
        window.location.href = './area-cliente.html';
      }
    } else {
      alert('Usuário ou senha inválidos');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    alert('Erro ao fazer login. Tente novamente mais tarde.');
  }
}

document.getElementById('formCadastro').addEventListener('submit', criarUsuario);

const url = 'http://localhost:3000';

function validarCadastro() {
    var senha = document.getElementById('senha').value;
    var repetirSenha = document.getElementById('repetir_senha').value;
    var errorMessage = document.getElementById('error-message');
  
    if (senha !== repetirSenha) {
      errorMessage.textContent = 'As senhas não coincidem.';
      return false; // Impede o envio do formulário
    } else {
      errorMessage.textContent = ''; // Limpa a mensagem de erro se as senhas coincidirem
      return true; // Permite o envio do formulário
    }
  }

async function validarLogin(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const senha = document.getElementById('senha').value;

  try {
    const response = await fetch(url+'/users/login', {
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
      sessionStorage.setItem('tipo', tipo);

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

// Função para atualizar o header com base no tipo de usuário
function updateHeaderBasedOnUserType(tipo) {
  const linkAreaLogada = document.getElementById('linkPecaPizza');

  if (tipo == 1) {
    // Usuário admin
    linkAreaLogada.textContent = 'Área do Admin';
    linkAreaLogada.href = './area-admin.html';
  } else if (tipo == 0){
    // Usuário cliente
    linkAreaLogada.textContent = 'Área do Cliente';
    linkAreaLogada.href = './area-cliente.html';
  } else{
    linkAreaLogada.href = './formulario.html';
  }

  // Verifica se estamos na página area-cliente.html para sublinhar o link
  if (window.location.pathname.includes('area-admin.html')) {
    console.log("Pagina sublinhada");
    linkAreaLogada.classList.add('underline');
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const tipo = sessionStorage.getItem('tipo');
    updateHeaderBasedOnUserType(tipo);
  } catch (e) {
    console.log(e);
  }
});
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
  
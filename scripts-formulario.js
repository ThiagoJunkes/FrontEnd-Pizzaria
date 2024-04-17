// Array com os sabores disponíveis
const sabores = [
    { nome: "Margherita", value: "margherita" },
    { nome: "Pepperoni", value: "pepperoni" },
    { nome: "Calabresa", value: "calabresa" },
    { nome: "4 Queijos", value: "4queijos" },
    { nome: "Frango e Catupiry", value: "frango-catupiry" },
    { nome: "Portuguesa", value: "portuguesa" },
    { nome: "Vegetariana", value: "vegetariana" }
  ];
  
  // Função para validar o formulário
  function validarFormulario() {
    const form = document.getElementById("formPedido");
    const nome = form.nome.value.trim();
    const telefone = form.telefone.value.trim();
    const cpf = form.cpf.value.trim();
    const endereco = form.endereco.value.trim();
    const tamanho = form.tamanho.value;
  
    // Verificando se os campos obrigatórios estão preenchidos
    if (!nome || !telefone || !endereco || !tamanho || !cpf) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }

    if(!validarCPF(cpf)){
      alert("Por favor, digite um CPF válido!");
      return false;
    }

    if(!validarTelefone(telefone)){
      alert("Por favor, digite um telefone válido!");
      return false;
    }
  
    // Verificando a quantidade de sabores escolhidos (máximo 2)
    const checkboxes = document.querySelectorAll('input[name="sabor"]:checked');
    if (checkboxes.length === 0) {
      alert("Por favor, escolha pelo menos um sabor.");
      return false;
    } else if (checkboxes.length > 2) {
      alert("Você pode escolher no máximo dois sabores.");
      return false;
    }
  
    return true;
  }
  
  function stringPedidoEnviado() {
    const form = document.getElementById("formPedido");
    const nome = form.nome.value.trim();
    const tamanho = form.tamanho.value;
  
    const saboresSelecionados = [];
    const checkboxes = document.querySelectorAll('input[name="sabor"]:checked');
    checkboxes.forEach(checkbox => {
      saboresSelecionados.push(checkbox.labels[0].textContent);
    });
  
    const listaSabores = saboresSelecionados.map(sabor => `${sabor}`).join(",\n");
  
    const dataHoraAtual = new Date();
    const dataHoraEntrega = new Date(dataHoraAtual.getTime() + 30 * 60000); // 30 minutos em milissegundos
    const horaEntrega = dataHoraEntrega.toLocaleTimeString("pt-BR", { hour: "numeric", minute: "numeric" });
    const dataEntrega = dataHoraEntrega.toLocaleDateString("pt-BR") + " às " + horaEntrega;
  
    const mensagemPedido = `${nome}, Pedido Realizado!\nSua pizza ${tamanho} sabores:\n${listaSabores}\n\nChegará em 30 minutos\n${dataEntrega}`;
  
    alert(mensagemPedido);
  }
  
  
  
  
  // Função para carregar os sabores dinamicamente
  function carregarSabores() {
    const saboresDiv = document.getElementById("sabores");
    saboresDiv.innerHTML = "";

    const row = document.createElement("div");
    row.classList.add("row");

    sabores.forEach((sabor, index) => {
      const checkboxDiv = document.createElement("div");
      checkboxDiv.classList.add("col-6", "col-md-4", "mb-3"); // Cada sabor ocupará 6 colunas em telas menores e 4 em telas médias

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = sabor.value;
      checkbox.name = "sabor";
      checkbox.value = sabor.value;

      const label = document.createElement("label");
      label.htmlFor = sabor.value;
      label.textContent = sabor.nome;

      checkboxDiv.appendChild(checkbox);
      checkboxDiv.appendChild(label);
      row.appendChild(checkboxDiv);
    });

    saboresDiv.appendChild(row);
  }

  // Chamando a função para carregar os sabores quando a página carregar
  document.addEventListener("DOMContentLoaded", carregarSabores);
  
  function validarCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');
  
    // Verifica se o CPF tem 11 dígitos
    if (cpf.length !== 11) {
      return false;
    }
  
    // Verifica se todos os dígitos são iguais, o que não é permitido em um CPF válido
    if (/^(\d)\1{10}$/.test(cpf)) {
      return false;
    }
  
    // Calcula o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;
  
    // Verifica se o primeiro dígito verificador está correto
    if (digitoVerificador1 !== parseInt(cpf.charAt(9))) {
      return false;
    }
  
    // Calcula o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;
  
    // Verifica se o segundo dígito verificador está correto
    if (digitoVerificador2 !== parseInt(cpf.charAt(10))) {
      return false;
    }
  
    // CPF válido
    return true;
  }

  function validarTelefone(telefone) {
    telefone = telefone.replace(/\D/g, '');
  
    let regex = /^(?:\d{10}|\d{11})$/;
  
    if (regex.test(telefone)) {
      return true; // Telefone válido
    } else {
      return false; // Telefone inválido
    }
  }
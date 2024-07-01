const url = 'http://localhost:3000';
let pizzas = [];
const token = sessionStorage.getItem('token');

const multiplicadores = {
  broto: 1,
  pequena: 1.4,
  media: 1.7,
  grande: 2
};

// Array com os sabores disponíveis
async function carregarPizzas() {
  try {
    const response = await fetch(`${url}/pizzas`);
    pizzas = await response.json();
  } catch (error) {
    console.error('Erro ao carregar pizzas:', error);
  }
}

// Função para validar o formulário
function validarFormulario() {
  const form = document.getElementById("formPedido");
  const endereco = form.endereco.value.trim();

  // Verificando se os campos obrigatórios estão preenchidos
  if (!endereco) {
    alert("Por favor, preencha o endereço.");
    return false;
  }

  // Verificando se todas as pizzas têm sabor e tamanho selecionados
  const pizzasSelecionadas = document.querySelectorAll('.pizza-item');
  for (let i = 0; i < pizzasSelecionadas.length; i++) {
    const pizzaItem = pizzasSelecionadas[i];
    const selectPizza = pizzaItem.querySelector('select[name="pizza"]');
    const selectTamanho = pizzaItem.querySelector('select[name="tamanho"]');

    // Verificando se o sabor e o tamanho estão selecionados
    if (selectPizza.selectedIndex === 0 || selectTamanho.selectedIndex === 0) {
      alert(`Por favor, selecione o sabor e o tamanho para a pizza ${i + 1}.`);
      return false;
    }
  }

  return true;
}

// Função para adicionar uma nova pizza ao pedido
function adicionarPizza() {
  const pizzaContainer = document.getElementById("pizzaContainer");

  const pizzaDiv = document.createElement("div");
  pizzaDiv.classList.add("pizza-item", "mb-3");

  const selectPizza = document.createElement("select");
  selectPizza.name = "pizza";
  selectPizza.classList.add("form-select", "mb-2");

  // Opção inicial "Selecionar Sabor" que não é parte do array de pizzas
  const optionDefaultPizza = document.createElement("option");
  optionDefaultPizza.disabled = true;
  optionDefaultPizza.selected = true;
  optionDefaultPizza.textContent = "Selecionar Sabor";
  selectPizza.appendChild(optionDefaultPizza);

  pizzas.forEach(pizza => {
    const option = document.createElement("option");
    option.value = pizza.id;
    option.textContent = `${pizza.nome}`;
    selectPizza.appendChild(option);
  });

  const selectTamanho = document.createElement("select");
  selectTamanho.name = "tamanho";
  selectTamanho.classList.add("form-select", "mb-2");

  // Opção inicial "Selecionar Tamanho" que não é parte do array de tamanhos
  const optionDefaultTamanho = document.createElement("option");
  optionDefaultTamanho.disabled = true;
  optionDefaultTamanho.selected = true;
  optionDefaultTamanho.textContent = "Selecionar Tamanho";
  selectTamanho.appendChild(optionDefaultTamanho);

  ["broto", "pequena", "media", "grande"].forEach(tamanho => {
    const option = document.createElement("option");
    option.value = tamanho;
    option.textContent = tamanho.charAt(0).toUpperCase() + tamanho.slice(1);
    selectTamanho.appendChild(option);
  });

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.classList.add("btn", "btn-danger", "mb-2");
  removeButton.textContent = "Remover";
  removeButton.onclick = () => pizzaDiv.remove();

  const precoPizza = document.createElement("span"); // Alterado para <span> para exibir o preço
  precoPizza.textContent = ''; // Inicialmente vazio até selecionar sabor e tamanho

  // Adicionando evento de mudança nos selects para calcular o preço
  selectPizza.addEventListener('change', () => {
    calcularPreco();
    atualizarValorTotal();
  });

  selectTamanho.addEventListener('change', () => {
    calcularPreco();
    atualizarValorTotal();
  });

  function atualizarValorTotal() {
    const valorAntigo = document.getElementById('ValorTotal').textContent;
    const pizzasSelecionadas = document.querySelectorAll('.pizza-item');
    let total = 0;
  
    pizzasSelecionadas.forEach(pizzaItem => {
      const precoTexto = pizzaItem.querySelector('span').textContent;
      const precoNumero = parseFloat(precoTexto.replace('R$ ', '').replace(',', '.'));
      if (!isNaN(precoNumero)) {
        total += precoNumero;
      }
    });
  
    if (!isNaN(total)) {
      document.getElementById('ValorTotal').textContent = total.toFixed(2).replace('.', ',');
    } else {
      document.getElementById('ValorTotal').textContent = valorAntigo;
    }
  }

  function calcularPreco() {
    const pizzaId = selectPizza.value;
    const tamanho = selectTamanho.value;

    const pizza = pizzas.find(p => p.id == pizzaId);
    if (pizza) {
      const valorPizza = pizza.valor * multiplicadores[tamanho];
      if (!isNaN(valorPizza)) {
        precoPizza.textContent = `R$ ${valorPizza.toFixed(2)}`;
      } else {
        precoPizza.textContent = '';
      }
      
    }
  }

  const espacoVazio = document.createElement("textfield");
  espacoVazio.textContent = "   ";

  pizzaDiv.appendChild(selectPizza);
  pizzaDiv.appendChild(selectTamanho);
  pizzaDiv.appendChild(removeButton);
  pizzaDiv.appendChild(espacoVazio);
  pizzaDiv.appendChild(precoPizza);

  pizzaContainer.appendChild(pizzaDiv);
}



// Função para validar o usuário logado
function validarUsuarioLogado() {
  if (!token) {
    alert('Usuário não autenticado. Por favor, faça login.');
    window.location.href = './login.html';
    return;
  }
}

// Função para enviar o formulário
async function enviarFormulario(event) {
  event.preventDefault();

  if (!validarFormulario()) {
    return;
  }

  const form = document.getElementById("formPedido");
  const pizzasSelecionadas = [];

  document.querySelectorAll('.pizza-item').forEach(pizzaItem => {
    const pizzaId = pizzaItem.querySelector('select[name="pizza"]').value;
    const tamanho = pizzaItem.querySelector('select[name="tamanho"]').value;

    // Mapear o tamanho para a letra correspondente usando switch case
    let tamanhoAbreviado;
    switch (tamanho) {
      case "broto":
        tamanhoAbreviado = "B";
        break;
      case "pequena":
        tamanhoAbreviado = "P";
        break;
      case "media":
        tamanhoAbreviado = "M";
        break;
      case "grande":
        tamanhoAbreviado = "G";
        break;
      default:
        tamanhoAbreviado = tamanho;
        break;
    }

    const pizza = pizzas.find(p => p.id == pizzaId);
    const valorPizza = pizza.valor * multiplicadores[tamanho];

    pizzasSelecionadas.push({
      id: pizza.id,
      tamanho: tamanhoAbreviado,
      valor: valorPizza
    });
  });

  const totalValor = Math.floor(pizzasSelecionadas.reduce((acc, pizza) => acc + pizza.valor, 0), -1);

  const pedido = {
    endereco: form.endereco.value.trim(),
    pizzas: pizzasSelecionadas,
    valorTotal: totalValor
  };

  console.log(JSON.stringify(pedido));

  fetch(`${url}/orders?token=${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pedido)
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      throw new Error(data.error);
    }
    alert('Pizza adicionada com sucesso!');
    window.location.href = './area-cliente.html';
  })
  .catch(error => {
    console.error('Erro ao enviar pedido:', error);
    alert('Erro ao enviar pedido. Tente novamente.');
    }); 
}

document.addEventListener("DOMContentLoaded", async () => {
  validarUsuarioLogado();
  await carregarPizzas();
  document.getElementById('formPedido').addEventListener('submit', enviarFormulario);
});

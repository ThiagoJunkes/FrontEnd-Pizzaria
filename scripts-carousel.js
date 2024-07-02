async function fetchPizzas() {
    try {
      const response = await fetch('http://localhost:3000/pizzas');
      const pizzas = await response.json();
  
      const carouselIndicators = document.getElementById('carousel-indicators');
      const carouselInner = document.getElementById('carousel-inner');
      carouselIndicators.innerHTML = '';
      carouselInner.innerHTML = '';
  
      pizzas.forEach((pizza, index) => {
        // Create indicator button
        const indicatorButton = document.createElement('button');
        indicatorButton.type = 'button';
        indicatorButton.dataset.bsTarget = '#carouselExampleIndicators';
        indicatorButton.dataset.bsSlideTo = index;
        indicatorButton.ariaLabel = `Slide ${index + 1}`;
        if (index === 0) {
          indicatorButton.classList.add('active');
          indicatorButton.ariaCurrent = 'true';
        }
        carouselIndicators.appendChild(indicatorButton);
  
        // Create carousel item
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) {
          carouselItem.classList.add('active');
        }
  
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row', 'align-items-center');
  
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('col-md-6');
        const img = document.createElement('img');
        img.classList.add('pizza-img');
        img.src = pizza.imagem ? `data:image/jpeg;base64,${pizza.imagem}` : './Imagens/Item_sem_imagem.png';
        img.alt = pizza.nome;
        imgDiv.appendChild(img);
  
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('col-md-6');
        const pizzaInfoDiv = document.createElement('div');
        pizzaInfoDiv.classList.add('pizza-info');
        const pizzaName = document.createElement('h3');
        pizzaName.textContent = pizza.nome;
        const pizzaDescription = document.createElement('p');
        pizzaDescription.classList.add('highlight');
        pizzaDescription.textContent = pizza.descricao;
        pizzaInfoDiv.appendChild(pizzaName);
        pizzaInfoDiv.appendChild(pizzaDescription);
        infoDiv.appendChild(pizzaInfoDiv);
  
        rowDiv.appendChild(imgDiv);
        rowDiv.appendChild(infoDiv);
        carouselItem.appendChild(rowDiv);
        carouselInner.appendChild(carouselItem);
      });
    } catch (error) {
      console.error('Erro ao buscar pizzas:', error);
    }
  }
  
  fetchPizzas();
  
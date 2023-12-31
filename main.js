(function() {
    const $ = q => document.querySelector(q);

    // Função para renderizar os carros estacionados na garagem

    function renderGarage() {
      $("#garage").innerHTML = "";
      const garage = JSON.parse(localStorage.getItem("garage")) || [];
      for (let i = garage.length - 1; i >= 0; i--) {
        addCarToGarage(garage[i]);
      }
    }

    function addCarToGarage(car) {

      const row = document.createElement("tr");
      const id = `${car.name}-${car.licence}-${car.time}`;
      row.id = id;
      row.innerHTML = `
        <td>${new Date(car.time).toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric'})}</td>
        <td data-time="${car.time}">
          ${new Date(car.time).toLocaleString('pt-BR', { hour: 'numeric', minute: 'numeric' })}
        </td>
        <td>${car.name}</td>
        <td>${car.licence}</td>
        <td class="verify">
          <button class="price" data-id=${id}">Preço</button>
          <button class="print" data-id=${id}">Print</button>
          <button class="delete" data-id=${id}">Saída</button>
        </td>
      `;

      $("#garage").appendChild(row);
    }

    $("#send").addEventListener("click", e => {
      const name = $("#name").value;
      const licence = $("#licence").value;
  
      if (!name || !licence) {
        alert("Os campos são obrigatórios.");
        return;
      } // Colocar aqui a sequência de requisitos (Verificação da placa)

      const currentTime = new Date();
      const currentDate = currentTime.toLocaleString('pt-BR', { day: 'numeric', month: 'numeric'});

      const car = { name, licence, time: currentTime, addedDate: currentDate };
      const garage = JSON.parse(localStorage.getItem("garage")) || [];
      garage.push(car);
      localStorage.setItem("garage", JSON.stringify(garage));
  
      addCarToGarage(car);
      $("#name").value = "";
      $("#licence").value = "";

      renderGarage();
    });

    // Função para checar o preço que o cliente deve pagar - Obs: Preciso melhorar a lógica para efetuar o cálculo...

    function checkPrice(info) {
      const entryTime = new Date(info[1].dataset.time);
      const timeNow = new Date();
      const period = timeNow - entryTime;

      const days = Math.floor(period / (1000 * 60 * 60 * 24));
      const hours = Math.floor((period % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((period % (1000 * 60 * 60)) / (1000 * 60));

      let price = 5; // Essa lógica não está da maneira que eu quero ainda, mas foi uma solução melhor que eu encontrei para resolver os problemas da estrutura antiga...

      // Os preços podem ser definidos manualmente, dependendo da tabela de valor do seu estabelecimento. Nesse código utilizei esses valores apenas de exemplo!

      if (hours != 0 & minutes != 0) {
        price = hours * 5 + 5;
        if (hours >= 7) {
            price = 40;
        } // Calcular a diferença de dias + horas para resetar o cálculo a cada dia
      }

      if (days != 0) {
        price = days * 40;
        if (price > 250) {
          price = 250;
        }
        if (days > 70) {
          price = 700;
        } else if (days > 55) {
          price = 500;
        } else if (days > 40) {
          price = 300;
        }
      } else {
        price = price;
      }
        
      const licence = info[3].textContent.trim().toUpperCase();
      const msg = 
      `O Veículo de placa ${licence} permaneceu estacionado por

       ${days} dia(s) 
       ${hours} hora(s)
       ${minutes} minuto(s)

  Valor: R$ ${price} Reais`;

      alert(msg);
      
    }

    // Função para remover o carro da garagem

    function checkOut(info) {
      const licence = info[3].textContent.trim().toUpperCase();
      const msg = `Deseja remover o veículo da garagem?`;
  
      if (!confirm(msg)) {
        return;
      }
  
      const garage = JSON.parse(localStorage.getItem("garage")) || [];
      const updatedGarage = garage.filter(c => c.licence.trim().toUpperCase() !== licence);
      localStorage.setItem("garage", JSON.stringify(updatedGarage));
  
      renderGarage();
    }

  renderGarage();

    // Aqui vai ficar a função para colocar o carro removido da garagem no histórico

    // Função para imprimir/emitir o ticket para o veículo que entrou no estabelecimento

  $("#garage").addEventListener("click", (e) => {
    if (e.target.className === "price") {
      checkPrice(e.target.parentElement.parentElement.cells);
    } else if (e.target.className === "print") {
      const carName = e.target.parentElement.parentElement.cells[2].textContent;
      const carLicence = e.target.parentElement.parentElement.cells[3].textContent;
      const carTime = e.target.parentElement.parentElement.cells[1].dataset.time;
      const timeElapsed = Date.now(); 
      const today = new Date(timeElapsed);

      const ticketContent = `
      <style>
      body {
        background-color: black;
      }

      @media print {
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Open Sans', sans-serif;
        }

        html, body {
          height: 100%;
        }

        .container-title {
          text-align:center;
        }

        .container-title h2 {
          font-size: 15px;
          padding: 5px;
          border-bottom: 1px solid black;
          border-top: 1px solid black;
        }

        .container-title h1 {
          font-size: 20px;
        }

        .container-title span {
          font-size: 13px;
        }

        .container-title p {
          font-size: 15px;
          padding: 1px 2px;
        }

        .container-title > p:last-child {
          border-bottom: 1px solid black;
        }

        .container-upperbody {
          text-align: center;
          margin-top: 5px;
          text-transform: uppercase;
        }

        .container-upperbody h1 {
          font-size: 20px;
        }

        .container-upperbody h1:first-child {
          font-size: 25px;
          padding: 5px;
        }

        .container-body {
          margin-top: 5px;
          text-align: center;
          margin-bottom: 5px;
        }

        .container-footer {
          text-align:center;
          border-bottom: 1px solid black;
          padding: 5px;
        }

        .container-footer span {
          font-size: 12px;
        }

      }
      </style>

        <div class=container-title>
          <h1>Nome do Estacionamento</h1>
          <span>Informação Importante</span>
          <h2>CNPJ da Empresa</h2>
          <p>Endereço da Empresa<p>
          <p>Telefones da Empresa<p>
        </div>

        <div class=container-upperbody>
          <h1>${carLicence}</h1>
          <h1>${carName}</h1>
        </div>

        <div class=container-body>
          <p>Tipo: Avulso</p>
          <p>Data: ${new Date(today).toLocaleDateString('pt-BR',)}</p>
          <p>Entrada: ${new Date(carTime).toLocaleString('pt-BR', { hour: 'numeric', minute: 'numeric' })}</p>
        </div>

        <div class=container-footer>
          <span>Obrigatório a apresentação deste <br> cupom para a retirada do veículo</span>
        </div>

      `;

      const ticketWindow = window.open("", "_blank");
      ticketWindow.document.write(ticketContent);
      ticketWindow.document.close();
      ticketWindow.onload = printIf();
      
      function printIf() {
        if (window.matchMedia("(any-pointer: coarse)").matches) {
          ticketWindow.print();
          ticketWindow.close();
        } else {
          ticketWindow.print();
          ticketWindow.close();
        }
      }

      } else if (e.target.className === "delete") {
        checkOut(e.target.parentElement.parentElement.cells);
      }
  });
})();

  

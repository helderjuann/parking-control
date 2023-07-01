(function() {
    const $ = q => document.querySelector(q);

    function renderGarage() {
      const garage = getGarage();
      $("#garage").innerHTML = "";
      for (let i = garage.length - 1; i >= 0; i--) {
        addCarToGarage(garage[i]);
      }
    }

    function addCarToGarage(car) {

      const row = document.createElement("tr");
      const id = '${car.name}-${car.licence}-${car.time}';
      row.id = id;
      row.innerHTML = `
        <td>${new Date().toLocaleString('pt-BR', { day: 'numeric', month: 'numeric'})}</td>
        <td data-time="${car.time}">
          ${new Date(car.time).toLocaleString('pt-BR', { hour: 'numeric', minute: 'numeric' })}
        </td>
        <td>${car.name}</td>
        <td>${car.licence}</td>
        <td class="verify">
          <button class="price" data-id=${id}">Preço</button>
          <button class="print" data-id=${id}">Print</button>
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
      }
  
      const car = { name, licence, time: new Date() };
      const garage = getGarage();
      garage.push(car);
      localStorage.garage = JSON.stringify(garage);
  
      addCarToGarage(car);
      $("#name").value = "";
      $("#licence").value = "";

      renderGarage();
    });

    $("#licence").addEventListener("input", function(event) {
      var licence = document.getElementById("licence");
      var valuef = licence.value
      if (valuef.length === 3 && !valuef.includes("-")) {
        valuef = valuef.slice(0, 3) + "-" + valuef.slice(3);
      }
      licence.value = valuef;
    });

    function checkPrice(info) {
      const entryTime = new Date(info[1].dataset.time);
      const timeNow = new Date();
      const period = timeNow - entryTime;

      const days = Math.floor(period / (1000 * 60 * 60 * 24));
      const hours = Math.floor((period % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((period % (1000 * 60 * 60)) / (1000 * 60));

      let price = 0;

      if (days > 6) {
        price += 120;
      } else if (days > 5) {
        price += 100;
      } else if (days > 4) {
        price += 80;
      } else if (days > 3) {
        price += 80;
      } else if (days > 2) {
        price += 80;
      } else if (days > 1) {
        price += 70;
      } else if (days == 1) {
        price += 35;
      }

      if (hours >= 24) {
        price += 35;
        const remainingHours = hours - 24;
        price += remainingHours * 5;
      } else {
        if (hours < 1) {
        price += 5;
      } else if (hours < 2) {
        price += 10;
      } else if (hours < 3) {
        price += 15;
      } else if (hours < 4) {
        price += 20;
      } else if (hours === 5 || hours === 6 || hours === 7 || hours === 8 || hours === 9) {
        price += 20;
      } else if (hours < 10 || hours === 11 || hours === 12) {
        price += 25;
      } else if (hours < 13 || hours === 14 || hours === 15 || hours === 16 || hours === 17 || hours === 18 || 
        hours === 19 || hours === 20 || hours === 21 || hours === 22 || hours === 23) {
        price += 35;
        }
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

  const getGarage = () => localStorage.garage ? JSON.parse(localStorage.garage) : [];

  renderGarage();

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
          <span>Mensagem Importante</span>
          <h2>CNPJ</h2>
          <p>Endereço<p>
          <p>Telefone(s)<p>
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
      ticketWindow.focus();
      ticketWindow.print();
      ticketWindow.close();
    }
  });

  })();

  
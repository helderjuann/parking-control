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
        <td>${new Date(car.time).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric'})}</td>
        <td data-time="${car.time}">
          ${new Date(car.time).toLocaleString('pt-BR', { hour: 'numeric', minute: 'numeric' })}
        </td>
        <td>${car.name}</td>
        <td>${car.licence}</td>
        <td class="verify">
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

    function checkOut(info) {
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

Valor: R$ ${price} Reais                                                 Deseja encerrar?`;
    
      if (!confirm(msg)) {
        return;
      } 
    
      const garage = getGarage().filter(c => c.licence.trim().toUpperCase() !== licence);
      localStorage.garage = JSON.stringify(garage);
    
      renderGarage();
    }

  const getGarage = () => localStorage.garage ? JSON.parse(localStorage.garage) : [];

  renderGarage();

  $("#garage").addEventListener("click", (e) => {
    if (e.target.className === "delete") checkOut(e.target.parentElement.parentElement.cells);
  });

  })();

  

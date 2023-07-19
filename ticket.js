function mask(o, f) {
    v_obj = o
    v_fun = f
    setTimeout("execmask()", 1)
}

function execmask() {
    v_obj.value = v_fun(v_obj.value)
}

function moneyrs(v) {
    v = v.replace(/\D/g, "") 
    v = v.replace(/(\d{2})$/, ",$1") 
    v = v.replace(/(\d+)(\d{3},\d{2})$/g, "$1.$2")
   
   if(v.length >= 5){
      var max = v.replace(/\./g,'').replace(',','.') > 10000;
      var min = v.replace(/\./g,'').replace(',','.') < 0o5;

      if(max){
         return '10,000';
      }else if(min){
         return '05,00';
      }else{
         return v;
      }
   }else{
      return v;
   }
}; // Melhorar essa função para simular a opção "número" do excel - Essa função atual não está tão otimizada. 

function ticketPrint(carName, licence, typef, valuef, printf) {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const carTime = new Date();

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

          .container-subtitle {
            text-align: center;
          }

          .container-subtitle h1 {
            font-size: 20px;
            padding: 5px;
          }
          
          .container-upperbody {
            text-align: center;
            text-transform: uppercase;
          }

          .container-upperbody h1 {
            font-size: 20px;
          }

          .container-upperbody h1:first-child {
            font-size: 25px;
          }

          .container-body {
            margin: 5px;
          }

          .container-body p {
            text-align: center;
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
          <h1>Nome do estacionamento</h1>
          <h2>CNPJ</h2>
          <p>Endereço</p>
          <p>Telefone(s)</p>
        </div>
        <div class=container-subtitle>
          <h1>Recibo de Serviços</h1>
        </div>
        <div class=container-upperbody>
          <h1>${licence}</h1>
          <h1>${carName}</h1>
        </div>
        <div class=container-body>
          <p>Tipo: ${typef}</p>
          <p>Data: ${new Date(today).toLocaleDateString('pt-BR',)}</p>
          <p>Emissão: ${new Date(carTime).toLocaleString('pt-BR', { hour: 'numeric', minute: 'numeric' })}</p>
          <p>Valor:${valuef}</p>
          <p>Pagamento: ${printf}</p>
        </div>
        <div class=container-footer>
          <span>Recibo para simples conferência <br> sem valor fiscal</span>
        </div>
    `;

    const ticketWindow = window.open("", "_blank");
    ticketWindow.document.write(ticketContent);
    ticketWindow.document.close();
    ticketWindow.onload = function() {
        ticketWindow.print();
        ticketWindow.close();
    };
}

const printButton = document.querySelector('#printf');
printButton.addEventListener('click', (event) => {
  const carName = document.querySelector('#carName').value;
  const licence = document.querySelector('#licence').value;
  const typef = document.querySelector('#typef').value;
  const valuef = document.querySelector('#valuef').value;
  const paymentf = document.querySelector('#paymentf').value;
  ticketPrint(carName, licence, typef, valuef, paymentf);
});

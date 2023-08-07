$('.cpf').mask('000.000.000-00', {reverse: true});
$('.cnpj').mask('00.000.000/0000-00', {reverse: true});
$('.carlicence').mask('AAA-0A00');
$('.money').mask('000.000.000.000.000,00', {reverse: true});

function disableTextS() {
    $('body').css('-webkit-user-select','none');
    $('body').css('-moz-user-select','none');
    $('body').css('-ms-user-select','none');
    $('body').css('-o-user-select','none');
    $('body').css('user-select','none');
}

disableTextS();

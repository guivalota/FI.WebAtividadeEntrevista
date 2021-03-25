
$(document).ready(function () {
    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val(),
                "listaNomes": listaNomes,
                "listaCPFs": listaCPFs
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
                function (r) {
                    //r agora passa o Id do Cliente, agora faremos a inclusão dos beneficiarios



                    ModalDialog("Sucesso!", r)
                    $("#formCadastro")[0].reset();
            }
        });
    })
    
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

//lista de beneficiarios
var listaBenneficiarios = [];
var listaNomes = [];
var listaCPFs = []
//inserir beneficiario na tabela
$("#BtnInserir").on("click", function () {
    var nome = $("#NomeBeneficiario").val();
    var cpf = $("#CPFBeneficiario").val();
    cpf = cpf.replace(/\.|\-/g, '');
    var beneficiario = [cpf, nome];
    if (TestaCPF(cpf)) {
        if (ProcurarCPFLista(cpf)) {
            alert("CPF já inserido como beneficiário");
        } else {
            listaBenneficiarios.push(beneficiario);
            listaNomes.push(nome);
            listaCPFs.push(cpf);
            console.log(listaBenneficiarios);
            PreencherTabelaBeneficiario();
            LimparCamposBeneficiario();
        }
    } else {
        alert("CPF Invalido");
    }
});

//Preenche a tabela de bebenficiarios com base na lista
function PreencherTabelaBeneficiario() {
    LimparTabelaBeneficiario();
    var texto = '';
    for (var i = 0; i < listaBenneficiarios.length; i++) {
        var beneficiarioAux = listaBenneficiarios[i];
        console.log(beneficiarioAux);
        var btnAlterar = $('<button>Alterar</button>').attr('id', i);
        texto = texto + '<tr><td>' + beneficiarioAux[0] + '</td>' + '<td> ' + beneficiarioAux[1] + '</td>';
        texto = texto + '<td><button type="button" class="btn btn-primary" onclick="AlterarBeneficiario(' + i +')" id="btnAlterar-' + i + '" >Alterar</button></td>';
        texto = texto + '<td><button type="button" class="btn btn-primary" onclick="ExcluirBeneficiario('+i+')" id="btnExcluir-' + i + '" >Excluir</button></td></tr>';
    }

    $('tbody').append(texto);
}

//Limpa os cambos do beneficiario assim que for inserido na tabela
function LimparCamposBeneficiario() {
    $("#NomeBeneficiario").val("");
    $("#CPFBeneficiario").val("");
}

//Remove um beneficiario da lista
function ExcluirBeneficiario(id) {
    listaBenneficiarios.splice(id, 1);
    listaNomes.splice(id, 1);
    listaCPFs.splice(id, 1);
    LimparTabelaBeneficiario();
    PreencherTabelaBeneficiario();
}

//Remove um beneficiario da lista mas traz os valores para os campos
function AlterarBeneficiario(id) {
    var beneficiario = listaBenneficiarios[id];
    $("#NomeBeneficiario").val(beneficiario[1]);
    $("#CPFBeneficiario").val(beneficiario[0]);
    ExcluirBeneficiario(id);
}

//Limpa a tabela de beneficiarios mas matem os beneficiarios na lista
function LimparTabelaBeneficiario() {
    $('td').remove();
}

//Faz a verificação se o CPF informado é valido
function TestaCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF == "00000000000") return false;

    for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return false;
    return true;
}

//Procura na lista de beneficiarios se o cpf informado já está la
function ProcurarCPFLista(strCPF) {
    for (var i = 0; i < listaBenneficiarios.length; i++) {
        var beneficiarioAux = listaBenneficiarios[i];
        if (beneficiarioAux[0].match(strCPF)) {
            return true;
        }
    }
    return false;
}




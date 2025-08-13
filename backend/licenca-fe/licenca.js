import {BE_URL} from './env.js';

$(document).ready(function () {
  $("#menu-container").load("menu.html");

  $("#pesquisar").click(function () {
    pesquisar();
  });
  
  $(document).ready(function() {
    $('#limpar').click(function() {
      limpar()
    });
  });
  
  $('#edit').on('click', function() {
    $('#edit').hide()
    $('#save').show()
    $('#cancel').show()
    $('#addRow').show()
    $('.removeRow').show()
    setFieldsToReadonly("licenca", false)
  });
  
  $('#save').on('click', function() {
    $('#edit').show()
    $('#save').hide()
    $('#cancel').hide()
    $('#addRow').hide()
    $('.removeRow').hide()
    setFieldsToReadonly("licenca", true)
    salvar()
  });
  
  $('#cancel').on('click', function() {
    $('#edit').show()
    $('#save').hide()
    $('#cancel').hide()
    setFieldsToReadonly("licenca", true)
    pesquisar();
  });
  
  $('#excel').on('click', function() {
    // Download functionality goes here.
  });
  $('#pdf').on('click', function() {
    // Download functionality goes here.
  });

  $('#submitArquivo').click(function () {
    var arquivo = $('#arquivoInput').get(0).files[0];
    var codigoProcesso = $('#modal-licenca-processo').val();

    if (arquivo) {
      if (arquivo.type === "application/pdf") {

        var formData = new FormData();
        formData.append('arquivo', arquivo);
        formData.append('codigoProcesso', codigoProcesso);

        desabilitarBotoes();

        $.ajax({
          url: `${BE_URL}/licencas`,
          type: 'POST',
          data: formData,
          contentType: false, // Necessário para o FormData
          processData: false, // Necessário para o FormData
          success: function(response) {
            fecharModalLicenca()
            $('#modal-status-text').text('O arquivo está sendo processado. Aguarde alguns minutos e para consultar as exigências da licença.')
            $('#modal-status-licenca').modal('show');
            habilitarBotoes();
          },
          error: function(xhr, status, error) {
            var errorMessage = "Erro ao submeter o arquivo. Tente novamente.";
            if (xhr.responseJSON && xhr.responseJSON.error) {
                errorMessage = xhr.responseJSON.error;
            }
            fecharModalLicenca()
            $('#modal-status-text').text(errorMessage)
            $('#modal-status-licenca').modal('show');
            habilitarBotoes();
          }
        });
      } else {
        $('#arquivoHelp').text('Por favor, selecione um arquivo PDF para continuar.');
      }
    } else {
      $('#arquivoHelp').text('Por favor, selecione um arquivo para continuar.');
    }
  });  
  
  $('#btn-fechar-modal-licenca').click(function (){
    fecharModalLicenca();
  });

  $('#addRow').click(function (){

    var table = document.getElementById('tabela-registros').getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.rows.length);
    newRow.setAttribute('data-id', generateUUID());
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
  
    var textareaDesc = document.createElement('textarea');
    textareaDesc.className = 'input-fake';
    textareaDesc.setAttribute('type', 'text');
    textareaDesc.setAttribute('data-key', 'exigencia-descricao');
  
    cell1.appendChild(textareaDesc);
    cell2.innerHTML = '<input type="date" class="input-fake" data-key="exigencia-prazo">';
  
    newRow.scrollIntoView({ behavior: 'smooth', block: 'end' });
  
    textareaDesc.focus();
  });

});

function fecharModalLicenca(){
  $('#modal-licenca-text').text('');
  $('#chaveHelp').text('');
  $('#arquivoInput').val(''); 
  $('#modal-inserir-licenca').modal('hide');
}

function atualizarTabelaExigencias(exigencias){
  bindDataToTable('tabela-registros', exigencias, dataIdFn, trAttFn, tdAttFn, tdValueFn);
  resizeTextareas();
}


function pesquisar(){
  const formData = readFormData('form-filtro');
  const processo = encodeURIComponent(formData.processo);

  if (!processo){
    return;
  }

  desabilitarBotoes();
  $.ajax({
    url: `${BE_URL}/licencas/${processo}`,
    type: 'GET',
    success: function(response) {

      if (Object.keys(response).length > 0){
        bindDataToForm('licenca', response);
        $('#error-message').addClass('d-none');  // Hide the error message when successful
        $('#licenca').show();
        atualizarTabelaExigencias(response.exigencias);
      }else{
        $('#modal-licenca-text').text(`O processo ${formData.processo} ainda não foi cadastrado no sistema. Faça o upload da licença da CPRH para iniciar o processamento.`);
        $('#modal-licenca-processo').val(formData.processo)
        $('#modal-inserir-licenca').modal('show');
      }
      habilitarBotoes()

    },
    error: function(error) {
      console.log('Error', error);
      $('#error-message').removeClass('d-none').text('Impossível carregar os dados');  // Show the error message when an error occurs
      habilitarBotoes();
    }
  });
}

function salvar(){
  desabilitarBotoes();
  const formData = readFormData('licenca');
  const licencaId = formData.id; 
  $.ajax({
    url: `http://127.0.0.1:5000/api/licencas/${licencaId}`,
    type: 'PUT',
    data: JSON.stringify(formData),
    contentType: 'application/json',
    success: function(response) {

      atualizarTabelaExigencias(response.exigencias);

      $('#error-message').addClass('d-none');  // Hide the error message when successful
      habilitarBotoes();
    },
    error: function(error) {
      console.log('Error', error);
      $('#error-message').removeClass('d-none').text('Impossível carregar os dados');  // Show the error message when an error occurs
      habilitarBotoes();
    }
  });
}

function limpar(){
  $('#licenca').hide();
  $('#processo').val('');
  $('#processo').focus();
}

function desabilitarBotoes(){
  $("#save").prop('disabled', true);
  $("#cancel").prop('disabled', true);
  $("#pesquisar").prop('disabled', true);
  $("#limpar").prop('disabled', true);
  $("#submitArquivo").prop('disabled', true);
}
function habilitarBotoes(){
  $("#save").prop('disabled', false);
  $("#cancel").prop('disabled', false);
  $("#pesquisar").prop('disabled', false);
  $("#limpar").prop('disabled', false);
  $("#submitArquivo").prop('disabled', false);
}

function tdValueFn(item, column){
  if(column == "exigencia-prazo"){
    return $("<input type='date' class='input-fake' data-key='exigencia-prazo' readonly>").val(item[column])
  }else if(column == "exigencia-descricao"){
    return $("<textarea type='text' class='input-fake' data-key='exigencia-descricao' readonly>").val(item[column])
  }else if (column == "exigencia-acoes"){
    var actionContainer = $('<div>').addClass('action-container');

    if (item[column].includes("minuta")) {
      var draftButton = $('<button class="btn btn-secondary btn-sm mx-1">')
        .html('<i class="fas fa-file-contract fa-lg"></i>') 
        .on('click', function() {
          alert('Gerando minuta para a exigência');
        });
      actionContainer.append(draftButton);
    }

    if (item[column].includes("cumprir")) {
      var completeButton = $('<button class="btn btn-success btn-sm mx-1">')
        .html('<i class="fas fa-check"></i>') 
        .on('click', function() {
    
          var closestTr = $(this).closest('tr');
          var exigenciaId = closestTr.data('id');
          $(this).prop('disabled', true);

          fetch(`${BE_URL}/exigencias/${exigenciaId}/cumprir`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' }
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error(`Erro HTTP! status: ${response.status}`);
              }
              return response.json();
          })
          .then(data => {
              atualizarTabelaExigencias(data.exigencias);
            })
            .catch((error) => {
              console.error('Erro:', error);
            });
    
        });
        actionContainer.append(completeButton);
          
    }
        
    if (item[column].includes("cancelar-cumprir")) {
      // closestTr.addClass('completed');
      var cancelCompleteButton = $('<button class="btn btn-warning btn-sm mx-1 cancelCompleteButton">')
      .html('<i class="fas fa-times"></i>') 
      .on('click', function() {

        var closestTr = $(this).closest('tr');
        var exigenciaId = closestTr.data('id');
        $(this).prop('disabled', true);

        fetch(`${BE_URL}/exigencias/${exigenciaId}/cancelar-cumprir`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            atualizarTabelaExigencias(data.exigencias);
          })
          .catch((error) => {
            console.error('Erro:', error);
          });
  
      });
      actionContainer.append(cancelCompleteButton);
    }

    var removeButton = $('<button style="display: none;" class="removeRow btn btn-danger btn-sm mx-1">')
      .html('<i class="fas fa-trash"></i>') 
      .on('click', function() {
        $(this).closest('tr').remove();
      });
    actionContainer.append(removeButton);

    return actionContainer;    
  }
}

function dataIdFn(item){
  return item["id"];
}

function tdAttFn(item, column){
  return {}
}

function trAttFn(item){
  if (item["cor"] == "VERDE"){
    return {"class":"cumprida"};
  }else if (item["cor"] == "VERMELHO"){
    return {"class":"atrasada"};
  }else{
    return {};
  }
}

function resizeTextareas() {
  const textareas = document.querySelectorAll('textarea');

  textareas.forEach(textarea => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
  });
}

function debounce(func, wait) {
  let timeout;
  return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
          func.apply(context, args);
      }, wait);
  };
}

window.onresize = debounce(resizeTextareas, 250); 

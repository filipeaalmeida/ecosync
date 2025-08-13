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

});

function desabilitarBotoes(){
  $("#pesquisar").prop('disabled', true);
  $("#limpar").prop('disabled', true);
}
function habilitarBotoes(){
  $("#pesquisar").prop('disabled', false);
  $("#limpar").prop('disabled', false);
}

function getQueryString(){
  const formData = readFormData('form-filtro');
  const processo = encodeURIComponent(formData.processo);
  const status = encodeURIComponent(formData.status);
  const prazoInicial = encodeURIComponent(formData['prazo-inicial']);
  const prazoFinal = encodeURIComponent(formData['prazo-final']);

  let queryString = [];
  if (processo) {
    queryString.push(`processo=${processo}`);
  }
  if (status) {
    queryString.push(`status=${status}`);
  }
  if (prazoInicial) {
    queryString.push(`prazoInicial=${prazoInicial}`);
  }
  if (prazoFinal) {
    queryString.push(`prazoFinal=${prazoFinal}`);
  }

  queryString = queryString.join('&');

  return queryString;
}

function pesquisar(){

  let queryString = getQueryString();

  desabilitarBotoes();
  $.ajax({
    url: `${BE_URL}/exigencias?${queryString}`, 
    type: 'GET',
    success: function(response) {
      $('#error-message').addClass('d-none');  
      atualizarTabelaExigencias(response); 
      habilitarBotoes();
    },
    error: function(error) {
      console.error('Error', error);
      $('#error-message').removeClass('d-none').text('Impossível carregar os dados');  // Show the error message when an error occurs
      habilitarBotoes();
    }
  });
}


function atualizarTabelaExigencias(exigencias){
  bindDataToTable('tabela-registros', exigencias, dataIdFn, trAttFn, tdAttFn, tdValueFn);
  resizeTextareas();
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

function tdValueFn(item, column){
  if(column == "exigencia-prazo"){
    return $("<input type='date' class='input-fake' data-key='exigencia-prazo' readonly>").val(item[column])
  }else if(column == "exigencia-descricao"){
    return $("<textarea type='text' class='input-fake' data-key='exigencia-descricao' readonly>").val(item[column])
  }else if(column == "exigencia-processo"){
    return $("<textarea type='text' class='input-fake' data-key='exigencia-processo' readonly>").val(item[column])
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
          var queryString = getQueryString();

          $(this).prop('disabled', true);

          fetch(`${BE_URL}/exigencias/${exigenciaId}/cumprir?${queryString}`, {
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
        var queryString = getQueryString();

        $(this).prop('disabled', true);

        fetch(`${BE_URL}/exigencias/${exigenciaId}/cancelar-cumprir?${queryString}`, {
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

window.onresize = debounce(resizeTextareas, 250); 

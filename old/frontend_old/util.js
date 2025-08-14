function bindDataToTable(tableId, data, dataIdFn, trAttFn, tdAttFn, tdValueFn) {

    if (typeof data !== 'object' || !Array.isArray(data)) {
        console.error('Invalid data:', data);
        return;
    }

    const table = $("#" + tableId);
    const tbody = table.find('tbody');

    tbody.empty();

    const headers = table.find('th').map(function () {
        return $(this).data('header');
    }).get();

    data.forEach((item) => {
        const row = $('<tr>');
        
        if (typeof dataIdFn === 'function') {
            const id = dataIdFn(item);
            row.attr("data-id", id);
        }      

        if (typeof trAttFn === 'function') {
            const attributes = trAttFn(item);
            Object.entries(attributes).forEach(([key, value]) => {
              row.attr(key, value);
            });
        }

        headers.forEach((header) => {
            let value;
            if (typeof tdValueFn === 'function') {
              value = tdValueFn(item, header);
            } else {
              value = item[header];
            }            

            const td = $('<td>');
      
            if (typeof tdAttFn === 'function') {
                const attributes = tdAttFn(item, header);
                Object.entries(attributes).forEach(([key, value]) => {
                  td.attr(key, value);
                });
            }            

            row.append(td.html(value));
        });
        tbody.append(row);
    });
}

function bindDataToForm(formId, data) {
    if (typeof data !== 'object') {
        console.error('Invalid data:', data);
        return;
    }

    const form = $("#" + formId);

    for (const key in data) {
        const field = $(`[data-key="${key}"]`);
        if (field.length === 0) {
            continue;
        }        
        if (field.is(':checkbox') || field.attr('type') === 'radio') {
            field.prop('checked', data[key]);
        } else {
            field.val(data[key]);
        }
    }
}


function readFormData(formId) {

    const form = $("#" + formId);
    if (!form.length) {
        console.error(`Form not found: ${formId}`);
        return null;
    }

    console.log(form)

    let formData = {};
    let processedKeys = new Set();

    form.find('[data-table]').each(function() {

        let table = $(this);
        let tableName = table.data("table");

        formData[tableName] = [];    

        table.find('[data-id]').each(function() {
            let tr = $(this);
            let id = tr.data("id");

            let rowDict = {"id":id};
            formData[tableName].push(rowDict);

            tr.find('[data-key]').each(function() {
                let field = $(this);
                let key = field.data('key');
                let value = field.val();

                rowDict[key] = value;
                processedKeys.add(key);
            });
        });

    });   

    form.find('[data-key]').each(function() {
        let field = $(this);
        let key = field.data('key');
        if (!processedKeys.has(key)) {
            let value = field.val();
            formData[key] = value;
        }
    });

    return formData;
}

function setFieldsToReadonly(formId, readonly) {
    $('#' + formId + ' [data-key]').prop('readonly', readonly);
}
  

function generateUUID() {
    let d = new Date().getTime(); // Timestamp
    let d2 = (typeof performance !== 'undefined' && performance.now && (performance.now()*1000)) || 0; // Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16; // random number between 0 and 16
        if(d > 0){ // Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else { // Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
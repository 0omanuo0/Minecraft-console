var old_data;

$(document).ready(function() {
    var editor = document.getElementById('editor');
    old_data = editor.value;

    editor.addEventListener('input', ()=>update_icon());
    
});

function update_icon() {
    var icon = document.getElementById('save-icon');
    if (editor.value !== old_data) {
        icon.classList.remove('hidden');
    }
    else {
        icon.classList.add('hidden');
    }
}

function saveData() {
    var editorValue = document.getElementById('editor').value;
    var matches = window.location.href.match(/\/server\/(\d+)\/files/);
    var id = matches ? matches[1] : null;

    fetch(window.location.pathname, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Ajusta el tipo de contenido si es necesario
        },
        body: 'content=' + encodeURIComponent(editorValue) + "&path=" + encodeURIComponent(window.location.search.replace("?q=", "")),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Data saved successfully');
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

    old_data = editorValue;
    update_icon();
}
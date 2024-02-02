var input;
var cursorTracker;
var div_input;


const dict_opt = { "command1": ["arg1", "arg2"], "command2": ["arg1", "arg2"] }

//execute when document is loaded
$(document).ready(function () {
  input = document.getElementById('content');
  cursorTracker = document.getElementById('autoOPT');
  div_input = document.getElementsByClassName('form_console')[0];

  input.addEventListener('input', function () {
    cursorTracker.style.display = 'block';

    var span = document.createElement("span")
    span.innerText = input.value
    span.style.visibility = 'hidden'
    document.body.appendChild(span)
    // add div_input left padding
    //convert $(div_input).css('padding-left') to int
    var padding = parseInt($(div_input).css('padding-left').replace('px', ''));
    cursorTracker.style.left = (parseInt($(span).width()) + padding) * 1.12 + 5 + 'px';
    cursorTracker.style.top = $(input).position().top - $(input).height() + 5 + 'px';
    document.body.removeChild(span)
    showAutocomplete();
  })

});

function showAutocomplete() {
  const list_opt = document.getElementById("OPTIONS");
  const input_content = input.value.split(" ");
  const command = input_content[0];
  const args = input_content.slice(1);

  list_opt.innerHTML = "";
  console.log(input_content);
  var opts = [];
  if (input_content.length == 1) {
    Object.keys(dict_opt).forEach(key => {
      if (key.startsWith(command)) {
        opts.push(key);
      }
    });
  }
  else if (command in dict_opt) {
    dict_opt[command].forEach(key => {
      if (key.startsWith(args[args.length-1])) {
        opts.push(key);
      }
    });
  }

  opts.forEach(opt => {
    var op1 = document.createElement("li");
    op1.className = "li_opt";
    op1.innerText = opt;
    list_opt.appendChild(op1);
  });

}



// consoleDiv.addEventListener("keydown", function(event) {
//     if (event.key === "Tab") {
//       event.preventDefault();
//       autocomplete();
//     }
//     else{

//     }
//   });

// function gen_autocomplete(){
//     var list_opt = document.createElement("li");

// }

// function autocomplete() {

// }




var url = "https://translate.yandex.net/api/v1.5/tr.json/translate",
voiceselect = "Spanish Latin American Male";
keyAPI = "trnsl.1.1.20130922T110455Z.4a9208e68c61a760.f819c1db302ba637c2bea1befa4db9f784e9fbb8";
  var accessToken = "8f1fb6150d3d429ba46a4f4f2f89f233",
    baseUrl = "https://api.api.ai/v1/",
    $speechInput,
    $recBtn,
    recognition,
    messageRecording = "Escuchando...",
    messageCouldntHear = "No puedo escucharte , puedes repetirlo?",
    messageInternalError = "hay un error interno del servidor",
    messageSorry = "Lo siento pero aun no tengo una respuesta programada.";
  $(document).ready(function() {
    $speechInput = $("#speech");
    $recBtn = $("#rec");
    $speechInput.keypress(function(event) {
      if (event.which == 20) {
        event.preventDefault();
        send();
      }
    });
    $recBtn.on("click", function(event) {
      switchRecognition();
    });
    $(".debug__btn").on("click", function() {
      $(this).next().toggleClass("is-active");
      return false;
    });
  });
  function startRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
        recognition.interimResults = false;
    recognition.onstart = function(event) {
      respond(messageRecording);
      updateRec();
    };
    recognition.onresult = function(event) {
      recognition.onend = null;

      var text = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          text += event.results[i][0].transcript;
        }
        setInput(text);
      stopRecognition();
    };
    recognition.onend = function() {
      respond(messageCouldntHear);
      stopRecognition();
    };
    recognition.lang = "es-MX";
    recognition.start();
  }

  function stopRecognition() {
    if (recognition) {
      recognition.stop();
      recognition = null;
    }
    updateRec();
  }
  function switchRecognition() {
    if (recognition) {
      stopRecognition();
    } else {
      startRecognition();
    }
  }
  function setInput(text) {
    $speechInput.val(text);
    send();
  }
  function updateRec() {
    $recBtn.text(recognition ? "Alto" : "Habla");
  }
  function send() {
    var text = $speechInput.val().toLowerCase();
    $.ajax({
      type: "POST",
      url: baseUrl + "query?",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      headers: {
        "Authorization": "Bearer " + accessToken
      },
      data: JSON.stringify({q: text, lang: "es",sessionId: "somerandomthing"}),
      success: function(data) {
        prepareResponse(data);
      },
      error: function() {
        respond(messageInternalError);
      }
    });
  }

  function prepareResponse(val) {
    var debugJSON = JSON.stringify(val, undefined, 2);

    if (isEmpty(val.result.parameters)) {

        spokenResponse = val.result.speech; //parametros del objeto json almasenados en el objeto val.result
        respond(spokenResponse); // importante para el lenguaje de señas

    }else {
      if (val.result.parameters.operador) { /// si es una operacion

        var resultado;
        var number = parseInt(val.result.parameters.number);
        var number2 = parseInt(val.result.parameters.number2);

        if (val.result.parameters.operador === "mas" || val.result.parameters.operador === "más" || val.result.parameters.operador === "+"  ) {

          resultado = number + number2;

        } else if (val.result.parameters.operador === "menos" || val.result.parameters.operador === "-") {

          resultado = number - number2;

        } else if (val.result.parameters.operador === "por" || val.result.parameters.operador === "*") {

          resultado = number * number2;

        }else if(val.result.parameters.operador === "entre" || val.result.parameters.operador === "/") {

          resultado = number / number2;

        }

        spokenResponse = "El resultado es "+resultado; //parametros del objeto json almasenados en el objeto val.result
        respond(spokenResponse); // importante para el lenguaje de señas
      }
      if (val.result.parameters.Dato) {

        var busqueda = val.result.parameters.Dato;
        respond("Aqui puedes encontrar informacion sobre eso"); // importante para el lenguaje de señas
        window.open('http://google.com/search?q='+busqueda);

      }
      if (val.result.parameters.parametrosena) {
        respond(val.result.speech); // importante para el lenguaje de señas
        $("#imgshowsena").show();
        $("#imgshowsena").attr("src",val.result.parameters.parametrosena+".png");
        setTimeout(function() {
          $("#imgshowsena").attr("src","");
          $("#imgshowsena").hide();
          //your code to be executed after 1 second
        }, 5000);
      }
      if (val.result.parameters.lugar) {

        spokenResponse = val.result.speech; //parametros del objeto json almasenados en el objeto val.result
        respond(spokenResponse);
        $("#imgshowsena").show();
        $("#imgshowsena").attr("src",val.result.parameters.lugar+".png");
        setTimeout(function() {
          $("#imgshowsena").attr("src","");
          $("#imgshowsena").hide();
          //your code to be executed after 1 second
        }, 15000);

      }
      if (val.result.parameters.tabla) {

        spokenResponse = val.result.speech; //parametros del objeto json almasenados en el objeto val.result
        respond(spokenResponse);
        $("#imgshowsena").show();
        $("#imgshowsena").attr("src","multiplicacion"+val.result.parameters.tabla+".jpg");
        setTimeout(function() {
          $("#imgshowsena").attr("src","");
          $("#imgshowsena").hide();
          //your code to be executed after 1 second
        }, 50000);

      }

    }

    debugRespond(debugJSON);
  }

  function debugRespond(val) {
    $("#response").text(val);
  }
  function respond(val) {
    if (val == "") {
      val = messageSorry;
    }
    if (val !== messageRecording) {

        var resultado;
              var xhr = new XMLHttpRequest(),
                textAPI = val,
                langAPI = 'es',
              data = "key=" + keyAPI + "&text=" + textAPI +"&lang=" + "en-"+langAPI;
              xhr.open("POST", url, true);
              xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
              xhr.send(data);
              xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                  var res = this.responseText;
                  var json = JSON.parse(res);
                  if (json.code == 200) {
                  console.log(json.text[0]);
                /*  var msg = new SpeechSynthesisUtterance();
                  msg.voiceURI = "native";
                  msg.text = json.text[0];
                  msg.lang = "es-MX";
                  msg.rate = 0.75;
                  msg.pitch = 1.0;
                  msg.volume = 2.5; */
                $("#spokenResponse").addClass("is-active").find(".spoken-response__text").html(json.text[0]);
                  //window.speechSynthesis.speak(msg);
                  responsiveVoice.speak(json.text[0],voiceselect);
                  } else {
                  /*  var msg = new SpeechSynthesisUtterance();
                    msg.voiceURI = "native";
                    msg.text = json.text[0];
                    msg.lang = "en-US";
                    msg.rate = 0.75;
                    msg.pitch = 1.0;
                    msg.volume = 2.5;
                    msg = "Error Code: " + json.code; */
                    $("#spokenResponse").addClass("is-active").find(".spoken-response__text").html(val);
                    //window.speechSynthesis.speak(msg);
                    responsiveVoice.speak(json.text[0],voiceselect);
                  }
                }
              }
    }

  }

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

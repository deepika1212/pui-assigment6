//accesses the API.ai key

var accessToken = "47d08f10f68b41aeb5826bcf4f76ab70",

      baseUrl = "https://api.api.ai/v1/",
//stores what the user speaks
      $speechInput,
//stores the button element that the user clicks to speak
      $recBtn,
//stores the SpeechRecognition API functionality
       recognition,
       speechRecognitionList,

      messageRecording = "Listening...",
      messageCouldntHear = "Ooops! I didn't hear you. I promise I will catch you this time.",
      messageInternalError = "Oh no, there has been an internal server error",
      messageSorry = "I'm sorry, I don't have the answer to that yet.";

    $(document).ready(function() {
      $speechInput = $("#speech");
      $recBtn = $("#rec");
      console.log("hello");
       
      
//sends input to API.ai when the user presses enter in the input field
      $speechInput.keypress(function(event) {
        if (event.which == 13) {
          event.preventDefault();
          send();
          $("#rec").css({"color": $("#speech").val()});
        }
      });
      
//sends input to API.ai when the user clicks on the microphone
      

      $recBtn.on("click", function(event) {
        event.preventDefault(); 
        $recBtn.addClass('animated pulse infinite');
        switchRecognition();
      });
      
        });


    function startRecognition() {
    recognition = new webkitSpeechRecognition();

      recognition.continuous = false;
          recognition.interimResults = false;

      recognition.onstart = function(event) {
        respond(messageRecording);
        
      };
      recognition.onresult = function(event) {
        recognition.onend = null;
        var text = "";
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
          }
          setInput(text);
        $("#rec").css({"color": $("#speech").val()});
        stopRecognition();
      };
      recognition.onend = function() {
        respond(messageCouldntHear);
        stopRecognition();
      };
      recognition.lang = "en-US";
      recognition.start();
    }
  
    function stopRecognition() {
      if (recognition) {
        recognition.stop();
        recognition = null;
        $recBtn.removeClass('animated pulse infinite');
      }
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


    function send() {
      var text = $speechInput.val();
      $.ajax({
        type: "POST",
        url: baseUrl + "query",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
          "Authorization": "Bearer " + accessToken
        },
        data: JSON.stringify({query: text, lang: "en", sessionId: "yaydevdiner"}),

        success: function(data) {
          prepareResponse(data);
        },
        error: function() {
          respond(messageInternalError);
        }
      });
    }

    function prepareResponse(val) {
      var debugJSON = JSON.stringify(val, undefined, 2),
        spokenResponse = val.result.speech;

      respond(spokenResponse);
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
        var msg = new SpeechSynthesisUtterance();
        msg.voiceURI = "native";
        msg.text = val;
        msg.lang = "en-US";
        window.speechSynthesis.speak(msg);
      }

      $("#spokenResponse").addClass("is-active").find(".spoken-response__text").html(val);
    }
      
    
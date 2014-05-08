function divEscapedContentElement(message){

  return $('<div></div').text(message);
}

function divSystemContentElement(message){

  return $('<div></div').text('<i>' + message + '</i>');
}

function processInput(chatApp, socket){

  var message = $('#sendMessage').val();
  var systemMessage;

  if(message.charAt(0) == '/'){

    systemMessage = chatApp.processCommand(message);
  }
  else{
      chatApp.sendMessage($('#room').text(), message);
      $('#messages').append(divEscapedContentElement(message));
      $('#message').scrollTop($('#messages').prop('scrollHeight'));
  }

  $('#send-message').val('');
}


$(document).ready(function(){

var socket = io.connect('http://localhost:3000');
  var chatApp = new Chat(socket);

  socket.on('nameResult', function(result){
     var message;

     if(result.success){

       message = 'You are know as ' + result.name;
     }
     else{

       message = result.message;
     }

     $('#messages').append(divSystemContentElement(message));
  });

  socket.on('joinResult', function(result){

    $('#room').text(result.room);
    $('#messages').append(divSystemContentElement(result));
  });

  socket.on('message', function(message){

    var newElement = $('<div></div>').text(message.text);
    $('#messages').append(newElement);
  });

  socket.on('rooms', function(rooms){
    $('#room-list').empty();

    for (var room in rooms) {
      room = room.substring(1, room.length);

      if(room != ''){
        $('#room-list').append(divEscapedContentElement(room));
      }
    }

    $('#room-list div').click(function(){

      chatApp.processCommand('/join' + $(this).text());
    });
  });


  setInterval(function() { socket.emit('rooms'); }, 1000);

  $('#send-message').focus();

  $('#send-form').submit(function() {

    processInput(chatApp, socket);
    return false;
  });
})

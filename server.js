var http = require('http');

var fs = require('fs');

var path = require('path');

var mime = require('mime');

var cahe = {};

function send404(){

  response.writeHead(
    200,
    { 'content-type' : mime.lookup(path.basename(filepath))}
  );

  response.end(fileContents);
}

function serveStatic(response, cache, absPath){

  if(cache[absPath]){

    sendFile(response, absPath, cache[absPath]);
  }
  else{

    fs.exists(absPath, function(exists){

      if(exists){

        fs.readFile(absPath, function(err, data){

          if(err){

            send404(response);
          }
          else{

            cache[absPath] = data;
            sendFile(response, absPath, cache[absPath]);
          }
        });

      }
      else{
        send404(response);
      }
    });
  }
}


var server =http.createServer(function(request, response){

  var filePath = false;

  if(request.url == '/'){

      filePath = 'public/index.html';
  }
  else{

      filePath = 'public' + request.url;
  }

  var absPath = '.' + filePath;
  serveStatic(response, cache, absPath);
});


server.listen(3000, function(){
  console.log('server listening on port 3000');
});


var chatServer = require('./lib/chat_server');
chatServer.listen(server);

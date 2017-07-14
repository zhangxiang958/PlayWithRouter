var http = require('http');
var fs = require('fs');
var url = require('url');
var path = './index.html';

http.createServer(function(req, res){

  if(req.url === '/') {
    
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });

    fs.readFile(path, function(err, data){
      
      if(err) {

        res.end(err);
      } else {

        res.end(data);
      }
    });
  } else {
    if(url.parse(req.url).pathname == "/favicon.ico"){ 
      return; 
    }
    path = './' + url.parse(req.url).pathname;
    res.writeHead(200, {
      'Content-Type': 'text/javascript'
    });

    fs.readFile(path, function(err, data){
      
      if(err) {

        res.end(err);
      } else {

        res.end(data);
      }
    });
  }
  

}).listen('8081');
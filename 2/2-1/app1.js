const http = require('http');

var server = http.createServer(
    (request, response) => {
        response.end('Hello Node.js!');
    }
);

// 上記と同じ処理
/*
var server = http.createServer(
    function(request, response) {
        response.end('Hello Node.js!');
    }
);
*/

server.listen(3000);
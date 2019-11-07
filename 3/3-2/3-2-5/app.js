const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');

const index_page = fs.readFileSync('./index.ejs', 'utf8');
const other_page = fs.readFileSync('./other.ejs', 'utf8');
const style_css = fs.readFileSync('../style.css', 'utf8');

var server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start!');

function getFromClient(request, response) {
    var url_parts = url.parse(request.url, true);
    
    switch(url_parts.pathname) {
        case '/':
            response_index(request, response);
            break;

        case '/other':
            response_other(request, response);
            break;

        case '/style.css':
            response.writeHead(200, {'Content-Type': 'text/css'});
            response.write(style_css);
            response.end();
            break;

        default:
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end('no page...');
            break;
    }
}

/*
var data = {
    'Taro':['09-999-999', 'taro@yamada', 'Tokyo'],
    'baku':['080-777-987', 'baku@uma', 'Osaka'],
    'kappa':['090-987-134', 'kappa@uma', 'Osaka'],
    'kamo':['003-962-6789', 'kamokamo@uma', 'USA'],
};
*/

var data = {msg:'no message...'};

function response_index(request, response) {
    if(request.method == 'POST') {
        var body = '';

        request.on('data', (data) => {
            body += data;
        });

        request.on('end', () => {
            data = qs.parse(body);
            setCookie('msg', data.msg, response);
            write_index(request, response);
        });
    } else {
        write_index(request, response);
    }
}

function write_index(request, response) {
    var msg = "※伝言を表示します。";
    var cookie_data = getCookie('msg', request);
    var content = ejs.render(index_page, {
        title:"Index",
        content:"msg",
        data:data,
        cookie_data:cookie_data,
    });
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(content);
    response.end();
}

function setCookie(key, value, response) {
    var cookie = escape(value);
    response.setHeader('Set-Cookie', [key + '=' + cookie]);
    // console.log(value);
    // console.log(cookie);
}

function getCookie(key, request) {
    var cookie_data = request.headers.cookie != undefined ? request.headers.cookie : '';
    var data = cookie_data.split(';');

    console.log(cookie_data);
    console.log(data);

    for(var i in data) {
        if(data[i].trim().startsWith(key + '=')) {
            var result = data[i].trim().substring(key.length + 1);
            return unescape(result);
        }
    }
    return '';
}

function response_other(request, response) {
    var msg = "これはOtherページです。";
    if(request.method == 'POST') {
        var body = '';

        request.on('data', (data) => {
            body += data;
            console.log(body);
        });

        request.on('end', () => {
            var post_data = qs.parse(body);
            console.log(post_data);
            msg += 'あなたは、「' + post_data.msg + '」と書きました。';
            var content = ejs.render(other_page, {
                title:"Other",
                content:msg,
            });
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(content);
            response.end();
        });
    
    } else {
        var msg = "ページがありません。";
        var content = ejs.render(other_page, {
            title:"Other",
            content:msg,
        });
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(content);
        response.end();
    }
}

var express = require('express');
var ejs = require('ejs');

var app = express();
app.engine('ejs', ejs.renderFile);
app.use(express.static('public'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

var data = {
    'Taro':'taro@yamada',
    'Baku':'baku@uma',
    'Kamo':'kamokamo@uma',
    'Azuki':'azuki@neko',
}

app.get("/", (req, res) => {
    var msg = 'This is Index Page!<br>パーシャルによるテーブル表示';

    res.render('index.ejs', {
        title: 'Index',
        content: msg,
        data:data,
    });
});

app.post('/', (req, res) => {
    var msg = 'This is Posted Page!<br>' +
        'あなたは「<b>' + req.body.message +
        '</b>」と送信しました。';
    
    console.log(req.body);
    
    res.render('index.ejs', {
        title: 'Posted',
        content: msg,
    });
});

var server = app.listen(3000, () => {
    console.group('Server is running!');
});

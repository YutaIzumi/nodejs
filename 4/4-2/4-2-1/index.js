var express = require('express');
var ejs = require('ejs');

var app = express();

app.engine('ejs', ejs.renderFile);

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render('index.ejs', {
        title:'Index',
        content:'This is Express-app Top page!',
        link:{href:'/other', text:'※別のページに移動'}
    });
});

app.get("/other", (req, res) => {
    res.render('index.ejs', {
        title:'Other',
        content:'This is Express-app Top page!',
        link:{href:'/', text:'※トップに戻る'}
    });
});

var server = app.listen(3000, () => {
    console.group('Server is running!');
});

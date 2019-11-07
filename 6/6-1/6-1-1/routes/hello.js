var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var mysql_setting = {
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'nodeapp-db',
};

router.get('/', (req, res, next) => {
    var connection = mysql.createConnection(mysql_setting);
    connection.connect();

    connection.query('SELECT * from mydata', function(error, results, fields) {
        if(error == null) {
            // console.log(results);
            var data = {title: 'mysql', content: results};
            res.render('hello/index', data);
        }
    });
    connection.end();
});

router.get('/add', (req, res, next) => {
    var data = {
        title: 'Hello/Add',
        content: '新しいレコードを入力して下さい。',
        form: {name:'', mail:'', age:0}
    }
    res.render('hello/add', data);
});

router.post('/add', (req, res, next) => {
    console.log(req.body);
    req.check('name', 'NAME は必ず入力して下さい。').notEmpty();
    req.check('mail', 'MAIL はメールアドレスを入力して下さい。').isEmail();
    req.check('age', 'AGE は年齢（整数）を入力して下さい。').isInt();
    
    req.getValidationResult().then((result) => {
        if(!result.isEmpty()) {
            var re = '<ul class="error">';
            var result_arr = result.array();
            for(var n in result_arr) {
                re += '<li>' + result_arr[n].msg + '</li>';
            }
            re += '</ul>';
            var data = {
                title: 'Hello/Add',
                content: re,
                form: req.body
            }
            res.render('hello/add', data);
        } else {
            var nm = req.body.name;
            var ml = req.body.mail;
            var ag = req.body.age;
            var data = {'name':nm, 'mail':ml, 'age':ag};

            var connection = mysql.createConnection(mysql_setting);
            connection.connect();
            
            connection.query('insert into mydata set ?', data, function(error, results, fields) {
                res.redirect('/hello');
            });
            connection.end();
        }
    });
});

router.get('/show', (req, res, next) => {
    var id = req.query.id;

    var connection = mysql.createConnection(mysql_setting);
    connection.connect();

    connection.query('SELECT * from mydata where id=?', id, function(error, results, fields) {
        // console.log(results);
        if(error == null) {
            var data = {
                title: 'Hello/show',
                content: 'id = ' + id + ' のレコード：',
                mydata: results[0]
            }
            res.render('hello/show', data);
        }
    });
    connection.end();
});

router.get('/edit', (req, res, next) => {
    var id = req.query.id;

    var connection = mysql.createConnection(mysql_setting);
    connection.connect();

    connection.query('SELECT * from mydata where id=?', id, function(error, results, fields) {
        if(error == null) {
            var data = {
                title: 'Hello/edit',
                content: 'id = ' + id + ' のレコード：',
                mydata: results[0],
            }
            res.render('hello/edit', data);
        }
    });
    connection.end();
});

router.post('/edit', (req, res, next) => {
    var id = req.body.id;
    var nm = req.body.name;
    var ml = req.body.mail;
    var ag = req.body.age;
    var data = {'name':nm, 'mail':ml, 'age':ag};

    var connection = mysql.createConnection(mysql_setting);
    connection.connect();

    connection.query('update mydata set ? where id = ?', [data, id], function(error, results, fields) {
        res.redirect('/hello');
    });
    connection.end();
});

router.get('/delete', (req, res, next) => {
    var id = req.query.id;
    
    var connection = mysql.createConnection(mysql_setting);
    connection.connect();

    connection.query('SELECT * from mydata where id=?', id, function(error, results, fields) {
        if(error == null) {
            var data = {
                title: 'Hello/delete',
                content: 'id = ' + id + ' のレコード',
                mydata: results[0],
            }
            res.render('hello/delete', data);
        }
    });
    connection.end();
});

router.post('/delete', (req, res, next) => {
    var id = req.body.id;

    var connection = mysql.createConnection(mysql_setting);
    connection.connect();

    connection.query('delete from mydata where id=?', id, function(error, results, fields) {
        res.redirect('/hello');
    });
    connection.end();
});

module.exports = router;

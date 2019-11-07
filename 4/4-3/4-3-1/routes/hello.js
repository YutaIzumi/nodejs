var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    var data = {
        title: 'Hello!',
        content: 'これは、サンプルコンテンツです。<br>this is the sample content.',
    };
    res.render('hello', data);
});

module.exports = router;

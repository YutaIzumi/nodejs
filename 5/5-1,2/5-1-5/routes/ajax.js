var express = require('express');
var router = express.Router();

var data = [
    {name: 'Taro', age:35, mail:'taro@yamada'},
    {name: 'Baku', age:5, mail:'baku@uma'},
    {name: 'Kappa', age:135, mail:'kappa@uma'},
    {name: 'Kamo', age:3, mail:'kamo@uma'},
];

router.get('/', (req, res, next) => {
    var n = req.query.id;
    res.json(data[n]);
});

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  try{
    console.log("Inside Homepage")
    res.render('index', { title: 'FIFA World CUP 2022' });
  }catch(e){
    throw e;
  }
});

module.exports = router;

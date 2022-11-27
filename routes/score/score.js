const { response } = require('express');
var express = require('express');
var router = express.Router();
var util = require('util');

var { getAllFixtures } = require("../../controllers/fixtures")
var { updateScore } = require("../../controllers/score")


router.get('/updatescore', function(req, res, next) {
  try{
    console.log("Inside updatescore score get Route")
    let matchDay=Object.keys(getAllFixtures())[0];
    let respoinse=updateScore(matchDay)
    //let respoinse=updateScore("MatchDay-1")
    res.send(response);
  }catch(e){
    console.log("error occured while updating score:"+e)
    next(e)
  }
});

module.exports = router;

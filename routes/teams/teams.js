var express = require('express');
var router = express.Router();
var util = require('util');
const { accessTokenValidator } = require('../../middlewares/auth')

var { addTeam } = require("../../controllers/teams")

router.post('/addTeam', function(req, res, next) {
  try{
    console.log("Inside addTeam Post Route")
    res.send(addTeam(req))
   
  }catch(e){
    console.log("error occured while adding team :"+e)
    next(e)
  }
});

module.exports = router;

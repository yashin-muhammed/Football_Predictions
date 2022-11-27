var express = require('express');
var router = express.Router();
var util = require('util');
const { getLeague } = require('../../controllers/league')
const { addData } = require('../../controllers/data')

router.post('/update', function(req, res, next) {
  try{
    console.log("Inside data update Post Route")
    console.log(req.body)
    let leagueID=req.body.leagueID
    let leagueData=getLeague(leagueID)
    console.log(addData(req.body));
    
    let leagueName=leagueData.leagueName;
    let members=leagueData.members
    if(req.session.userType=="admin"){
      res.render('adminLeagueBoard',{username: req.session.username, leagueID:leagueID,leagueName: leagueName, members:members});
    }else{
      res.render('leagueBoard',{username: req.session.username, leagueID:leagueID,leagueName: leagueName, members:members});
    }
  }catch(e){
    console.log("error occured while adding fixture :"+e)
    throw e;
  }
});


module.exports = router;

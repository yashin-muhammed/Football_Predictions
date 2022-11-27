var express = require('express');
var router = express.Router();
var util = require('util');

var { addFixture, getAllFixtures, popFixture } = require("../../controllers/fixtures")
var { getTeam } = require("../../controllers/teams")

router.post('/addfixture', function(req, res, next) {
  try{
    console.log("Inside addfixture Post Route")
    res.send(addFixture(req))
   
  }catch(e){
    console.log("error occured while adding fixture :"+e)
    next(e)
  }
});

router.get('/gameweek/:member/:leagueID', function(req, res, next) {
  try{
    console.log("Inside fixtures gameweek Post Route")
    let leagueID=req.param("leagueID");
    let member=req.param("member");
    let fixtures=getAllFixtures()
    //console.log("fixtures: "+util.inspect(fixtures));
    let matchDayArray=Object.keys(fixtures);
    //console.log("MatchDayArray: "+matchDayArray);
    let matchDay=matchDayArray[0];
    console.log("matchDay: "+matchDay);
    let activeGW=fixtures[matchDay];
    console.log("activeGW: "+util.inspect(activeGW));
    let activeGWObj={};
    for(game in activeGW){
      let homeTeam=game.substring(0,game.indexOf(" vs ")).trim();
      console.log("Home Team: "+homeTeam);
      let homeTeamObj=getTeam(homeTeam);
      let homeIconPath=homeTeamObj.iconPath
      let awayTeam=game.replace(homeTeam,"").replace(" vs ","").trim()
      console.log("Away Team:"+awayTeam )
      let awayTeamObj=getTeam(awayTeam);
      let awayIconPath=awayTeamObj.iconPath
      let DOM=activeGW[game];
      activeGWObj[game]={"homeTeam": homeTeam, "homeIconPath":homeIconPath, "awayTeam": awayTeam,"awayIconPath":awayIconPath ,"DOM": DOM}
    }
    console.log("activeGWObj: "+util.inspect(activeGWObj))
    res.render('gameWeek',{username:req.session.username, matchDay: matchDay, activeGWObj: activeGWObj, member:member, leagueID:leagueID});
  }catch(e){
    console.log("error occured while rendering gameweek :"+e)
    next(e);
  }
});

router.get('/pop/:matchDay', function(req, res, next) {
  try{
    console.log("Inside pop Fixture get Route")
    let matchDay=req.param("matchDay");
    res.send(popFixture(matchDay));

  }catch(e){
    console.log("error occured while popping fixture out :"+e)
    next(e);
  }
});

module.exports = router;

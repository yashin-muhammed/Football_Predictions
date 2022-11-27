var express = require('express');
var router = express.Router();
var util = require('util');
const { getAllFixtures, popFixture } = require('../../controllers/fixtures')
const { addResults } = require('../../controllers/results')
const { getTeam } = require('../../controllers/teams')
const { getUser } = require('../../controllers/user')
const { getAllLeague, updateLeagueUserScore } = require('../../controllers/league')
const { updateScore } = require('../../controllers/score')

router.get('/', function(req, res, next) {
  try{
    console.log("Inside update Get Route")
    let fixtures=getAllFixtures()
    console.log("fixtures: "+util.inspect(fixtures));
    let matchDayArray=Object.keys(fixtures);
    console.log("MatchDayArray: "+matchDayArray);
    let matchDay=matchDayArray[0];
    console.log("matchDay: "+matchDay);
    let activeGW=fixtures[matchDay];
    console.log("activeGW: "+util.inspect(activeGW));
    let activeGWObj={};
    for(game in activeGW){
      let homeTeam=game.substring(0,game.indexOf(" vs ")).trim();
      let homeTeamObj=getTeam(homeTeam);
      let homeIconPath=homeTeamObj.iconPath
      let awayTeam=game.replace(homeTeam,"").replace(" vs ","").trim()
      let awayTeamObj=getTeam(awayTeam);
      let awayIconPath=awayTeamObj.iconPath
      let DOM=activeGW[game];
      activeGWObj[game]={"homeTeam": homeTeam, "homeIconPath":homeIconPath, "awayTeam": awayTeam,"awayIconPath":awayIconPath ,"DOM": DOM}
    }
    console.log("activeGWObj: "+util.inspect(activeGWObj))
    res.render('updateResults',{username:req.session.username, matchDay: matchDay, activeGWObj: activeGWObj});
   
  }catch(e){
    console.log("error occured while loading results updation page :"+e)
    next(e)
  }
});

router.post('/update', function(req, res, next) {
  try{
    console.log("Inside Result update Post Route")
    //let leagueID=req.param("leagueID");
    //let member=req.param("member");
    let fixtures=getAllFixtures()
    console.log("fixtures: "+util.inspect(fixtures));
    let matchDayArray=Object.keys(fixtures);
    console.log("MatchDayArray: "+matchDayArray);
    let matchDay=matchDayArray[0];
    console.log("matchDay: "+matchDay);
    let activeGW=fixtures[matchDay];
    console.log("activeGW: "+util.inspect(activeGW));
    let activeGWObj={}
    activeGWObj[matchDay]=req.body;
    delete activeGWObj[matchDay].matchDay
    activeGWObj[matchDay]["matches"]=Object.keys(activeGW);
    console.log("activeGWObj: "+util.inspect(activeGWObj)) 
    
    addResults(activeGWObj)
    updateScore(matchDay);
    popFixture(matchDay);
    let userData=getUser(req.session.email);
    let leagues=[];
    if(userData.type=="admin"){
      let leaguesData=getAllLeague();
      for(l in leaguesData){
        console.log("l: "+l+"\nlegueData[l]: "+util.inspect(leaguesData[l].leagueName))
        leagues.push({"id":l, "leagueName": leaguesData[l].leagueName})
      }
      res.render('adminDashboard',{username:userData.username, leagues: leagues});
    }else{
      leagues=userData.leagues;
      res.render('userDashboard',{username:userData.username, leagues: leagues});
    }
  }catch(e){
    console.log("error occured while rendering gameweek :"+e)
    next(e)
  }
});

module.exports = router;

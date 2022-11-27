var express = require('express');
const session = require('express-session');
var router = express.Router();
var util = require('util');
const { create, join, attachLeague, getLeague, getAllLeague } = require('../../controllers/league')
const { getUser, getAllUser } = require('../../controllers/user')

/* GET users listing. */
router.get('/add', function(req, res, next) {
  try{
    console.log("Inside add League")
    //var user = req.cookies
    //console.log("email: "+util.inspect(req.session.userid))
    if(req.session.userType=="admin"){
        res.render('createLeague',{username: req.session.username});
    }else{
        res.render('addLeague',{username: req.session.username, email:req.session.email});
    }
  }catch(e){
    next(e)
  }
})

router.get('/joinleague', function(req, res, next) {
  try{
    console.log("Inside joinleague League")
    //var user = req.cookies
    //console.log("email: "+util.inspect(req.session.userid))
    let userData=getAllUser();
    let userObj=[]
    for(user in userData){
        if(userData[user].type!="admin")
            userObj.push({email: user, username: userData[user].username })
    }
    console.log("UserObj: "+util.inspect(userObj))
    res.render('joinLeague',{username: req.session.username, userData:userObj});
  }catch(e){
    next(e);
  }
})

router.post('/create', function(req, res, next) {
  try{
    console.log("Inside create League")
    //var user = req.cookies
    //console.log(req.body)
    let leagueObj=create(req)
    //console.log("email: "+util.inspect(req.session.userid))
    console.log("Preparing To Attach League")
    console.log(attachLeague(req.session.email,req.session.userType, leagueObj))
    let userData=getUser(req.session.email);
    console.log("UserDataObj After attaching League\n"+util.inspect(userData));
    let leagues=[];
    if(req.session.userType=="admin"){
      let leaguesData=getAllLeague();
      for(l in leaguesData){
        console.log("l: "+l+"\nlegueData[l]: "+util.inspect(leaguesData[l].leagueName))
        leagues.push({"id":l, "leagueName": leaguesData[l].leagueName})
      }
      res.render('adminDashboard',{username: req.session.username, leagues:leagues});
    }else{
      leagues=userDataObj.leagues;
      res.render('userDashboard',{username: req.session.username, leagues:leagues});
    }
  }catch(e){
    next(e);
  }
})

router.post('/join', function(req, res, next) {
  try{
    console.log("Inside Join League")
    //var user = req.cookies
    const {email, leagueID} =req.body;
    console.log("email: "+email)
    let userData=getUser(email)
    let leagueData=getLeague(leagueID);
    let leagueObj={id:leagueID, leagueName:leagueData.leagueName}
    console.log("Preparing To Attach League")
    console.log(attachLeague(email,"user", leagueObj))
    join(leagueID, {id: userData.id, username: userData.username, email:email})
    let leagues=[];
    if(req.session.userType=="admin"){
      let leaguesData=getAllLeague();
      for(l in leaguesData){
        console.log("l: "+l+"\nlegueData[l]: "+util.inspect(leaguesData[l].leagueName))
        leagues.push({"id":l, "leagueName": leaguesData[l].leagueName})
      }
      res.render('adminDashboard',{username: req.session.username, leagues:leagues});
    }else{
      leagues=userData.leagues;
      res.render('userDashboard',{username: req.session.username, leagues:leagues});
    }
  }catch(e){
    next(e);
  }
})

router.get('/load/:leagueID', function(req, res, next) {
  try{
    console.log("Inside load League")
    let leagueID=req.param("leagueID")
    let leagueData=getLeague(leagueID);
    let leagueName=leagueData.leagueName
    let members=leagueData.members;
    members.sort((a,b) => b.points-a.points|| b.SpotOnPredictions-a.SpotOnPredictions);
    
    console.log("leagueName: "+leagueName)
    console.log("Members: "+members)
    //var user = req.cookies
    //console.log("email: "+util.inspect(req.session.userid))
    if(req.session.userType=="admin"){
        res.render('adminLeagueBoard',{username: req.session.username, leagueID:leagueID,leagueName: leagueName, members:members});
    }else{
        res.render('leagueBoard',{username: req.session.username, leagueID:leagueID,leagueName: leagueName, members:members});
    }
  }catch(e){
    next(e);
  }
})

router.get('/load/gameweek/:leagueID', function(req, res, next) {
  try{
    console.log("Inside gameweek")
    let leagueID=req.param("leagueID")
    let leagueData=getLeague(leagueID);
    let leagueName=leagueData.leagueName
    let members=leagueData.members;
    console.log("leagueName: "+leagueName)
    console.log("Members: "+members)
    //var user = req.cookies
    //console.log("email: "+util.inspect(req.session.userid))
    
    res.render('leagueBoard',{username: req.session.username, leagueName: leagueName, members:members});
  }catch(e){
    next(e);
  }
})

router.get('/invite/:leagueID', function(req, res, next) {
  try{
    console.log("Inside league invite")
    let leagueID=req.param("leagueID")
    let leagueData=getLeague(leagueID);
    let leagueName=leagueData.leagueName
    //let members=leagueData.members;
    //console.log("leagueName: "+leagueName)
    //console.log("Members: "+members)
    //var user = req.cookies
    //console.log("email: "+util.inspect(req.session.userid))
    
    res.render('inviteToLeague',{username: req.session.username, leagueName: leagueName, leagueID:leagueID});
  }catch(e){
    next(e);
  }
})

module.exports = router;
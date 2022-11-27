var express = require('express');
var router = express.Router();
var util = require('util');
const { accessTokenValidator } = require('../../middlewares/auth')
const { register, changePass, getUser } = require('../../controllers/user')
const { login } = require('../../controllers/auth')
//const { register1} = require('../../controllers/auth copy')
const { getAllLeague } = require('../../controllers/league')
const { updateScore } = require('../../controllers/score')

const axios = require('axios')
const qs = require('querystring');
const url = require('url');
const createHttpError = require('http-errors');
let session;

/* GET users listing. */
router.get('/', function(req, res, next) {
  try{
    //res.send('respond with a resource');
    console.log("Inside Root Page at: "+new Date())
    //updateScore()
    res.render('userLogin',{});
  }catch(e){
    throw e;
  }
});

router.get('/register', function(req, res, next){
  console.log("Inside Register Get Page ");
  res.render("registerUser",{});
});

router.get('/changepass', function(req, res, next){
  console.log("Inside ChangePassword Get Page ");
  res.render("changePassword",{});
});

router.post('/changepass', function(req, res, next){
  try{
    console.log("Inside ChangePassword POSST Page ");
    const {email, oldPassword, newPassword, confirmPassword} = req.body;
    if(newPassword!=confirmPassword) throw createHttpError.NotAcceptable("New Password entered does not match")
    
    //console.log("password: "+password);
    let params = new url.URLSearchParams({ email: email, password: oldPassword });
    console.log("Preparing to Authenticate")
    axios.post('http://localhost:3000/users/auth', params.toString()).then(({data}) => {
      console.log("Fetched Token to Authorize")
      console.log(data)
      //res.cookie("tk",data)
      //session.tk=data;
      params = new url.URLSearchParams({ email: email});
      console.log("Preparing to Authorize")
      axios.post('http://localhost:3000/users/authorize', params.toString(),{
        "headers":{
          "authorization": "basic "+data
        }
      }).then(({response}) => {
        console.log("User Authorized Successfully")
        changePass(email, newPassword);
        res.render("userLogin",{});
      } ).catch(({err}) => {
        console.log("Authorization Failed\n"+err)
      });
    });
  }catch(e){
    console.error(e)
    next(e);
  }
});

router.post('/register', register)
router.post('/auth', login)

router.post('/login', function(req, res, next) {
  try{
    console.log("Inside Login Post Route")
    let email=req.body.email;
    console.log("email: "+email);
    let password=req.body.password;
    session=req.session;
    let userDataObj=getUser(email);
    console.log("userDataObj while logging in\n "+util.inspect(userDataObj))
    if(email){
      console.log("Setting Session Values")
      session.userid=userDataObj.id;
      session.email=email;
      session.username=userDataObj.username;
      session.userType=userDataObj.type;
      //console.log(req.session)
    }
    
    //console.log("password: "+password);
    let params = new url.URLSearchParams({ email: email, password: password });
    console.log("Preparing to Authenticate")
    axios.post('http://localhost:3000/users/auth', params.toString()).then(({data}) => {
      console.log("Fetched Token to Authorize")
      console.log(data)
      //res.cookie("tk",data)
      //session.tk=data;
      params = new url.URLSearchParams({ email: email});
      console.log("Preparing to Authorize")
      axios.post('http://localhost:3000/users/authorize', params.toString(),{
        "headers":{
          "authorization": "basic "+data
        }
      }).then(({response}) => {
        console.log("User Authorized Successfully")
        let leagues=[];
        if(userDataObj.type=="admin"){
          let leaguesData=getAllLeague();
          for(l in leaguesData){
            console.log("l: "+l+"\nlegueData[l]: "+util.inspect(leaguesData[l].leagueName))
            leagues.push({"id":l, "leagueName": leaguesData[l].leagueName})
          }
          res.render('adminDashboard',{username: userDataObj.username, leagues: leagues});
        }else{
          leagues=userDataObj.leagues;
          res.render('userDashboard',{username: userDataObj.username, leagues: leagues});
        }
        //console.log("Leagues: "+util.inspect(leagues))
        
      } ).catch(({err}) => {
        console.log("Authorization Failed\n"+err)
      });
    });
  }catch(e){
    console.log("error occured while logging in:"+e)
    next(e)
  }
});



router.get('/home', function(req, res, next) {
  try{
    console.log("Inside home Get Route")
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
    console.log("error occured while rendering home:"+e)
    next(e)
  }
});

router.get('/logout', function(req, res, next) {
  try{
    console.log("Inside logout Get Route")
    req.session.destroy();
    res.render('index',{});
  }catch(e){
    console.log("error occured while logging out:"+e)
    next(e)
  }
});

router.post('/authorize', accessTokenValidator, function(req, res, next) {
  try{
    console.log("Inside authorize Post Route")
    let email=req.body.email;
    //console.log("email: "+email);
    //res.cookie("email",email)
    res.send("Authenticated Successsfully")
  }catch(e){
    console.log("error occured while logging in:"+e)
    res.status(500)
    res.send(e);
  }
});

module.exports = router;

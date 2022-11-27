const creatError = require('http-errors')
const JSONdb = require('simple-json-db')
const { v4: uuid } = require('uuid')
const db = new JSONdb(process.env.LEAGUE_DB_PATH, { asyncWrite: true })
const { getUser, setUser } = require('./user')
var util = require('util');
// handles League Creation

exports.create =  (req) => {
  try {
    console.log("Inside Create League Function")
    const { leagueName } = req.body
    let id=uuid();
    let members=[];
    if(req.session.userType!="admin"){
      members.push(
        {
          id: req.session.userid,
          username: req.session.username,
          email: req.session.email
        }
      );
    }
    // this is just a demo code and not for production
    db.set(id, { leagueName, members })
    return {id:id, leagueName:leagueName};
  } catch (error) { 
    throw error;
  }
}

// handles League join
exports.join = (leagueID, memberData,) => {
  try {
    console.log("Inside Join Function")
    
    const leagueData = db.get(leagueID)

    if (!leagueData) throw creatError.NotFound()
    
    for(m in leagueData.members){
      if (leagueData.members[m].id==memberData.id) throw creatError.Forbidden("User already exist")
    }
    memberData["points"]=0;
    memberData["SpotOnPredictions"]=0;
    (leagueData.members).push(memberData);
    db.set(leagueID,leagueData);
    console.log("User added to league");

  } catch (error) {
    throw error;
  }
}

// handles attachLeague
exports.attachLeague = (email, userType, leagueObj) => {
  try {
    console.log("Inside attachLeague Function")
    //const { email } = req.body
    // this is just a demo code and not for production
    userData=getUser(email);
    console.log("Before attaching League to User\n"+util.inspect(userData))
    //console.log(userData.leagues)
    if(userType!='admin'){
      userData.leagues.push(leagueObj);
      console.log(userData)
    }
    
    setUser(email, userData)
    return 'Account created successfully'
  } catch (error) { 
    throw error
  }
}

exports.updateLeagueUserScore = (leagueID, leagueData) => {
  try {
    console.log("Inside updateLeagueUserScore Function")
    db.set(leagueID,leagueData);
    return 'leagueData updated successfully'
  } catch (error) { 
    throw error
  }
}

exports.getLeague =  (leagueID) => {
  try {
    console.log("leagueID: "+leagueID)
    let leagueData = db.get(leagueID)
    console.log("leagueData: "+leagueData)
    if (!leagueData) throw creatError.NotFound()

    return leagueData
  } catch (error) {
    throw error;
  }
}

exports.getAllLeague = () => {
  try {
    const leagueData = db.JSON()

    if (!leagueData) throw creatError.NotFound()

    return leagueData;
  } catch (error) {
    throw error
  }
}
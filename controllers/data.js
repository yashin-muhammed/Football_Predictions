const creatError = require('http-errors')
const JSONdb = require('simple-json-db')
const db = new JSONdb(process.env.DATA_DB_PATH, { asyncWrite: true })
const {getFixture} = require("./fixtures")
// handles League Creation

exports.addData =  (data) => {
  try {
    console.log("Inside addData Function")
    const { leagueID, member, matchDay } = data;
    let dataObj=db.JSON()
    if(dataObj){
      if(dataObj.hasOwnProperty(leagueID))
        if(dataObj[leagueID].hasOwnProperty(member))
          if (dataObj[leagueID][member][matchDay]) throw creatError.Forbidden("You have already made Your prediction");
    }
    
    //if (!fs.existsSync(iconPath)) throw creatError.NotFound()
    // this is just a demo code and not for production
    delete data.leagueID;
    delete data.member;
    delete data.matchDay;
    let fixtureData=getFixture(matchDay);
    let fixtureArray=Object.keys(fixtureData);
    let deadline=new Date(fixtureData[fixtureArray[0]]);
    let currentDate=new Date()
    console.log("currentTime:"+ currentDate.getTime());
    console.log("Deadline: "+deadline.getTime)
    let diff=deadline.getTime()-currentDate.getTime()
    console.log("Diff: "+diff);
    //let finalData={};
    //finalData[member]={}
    //finalData[member][matchDay]=data
    if(!dataObj[leagueID].hasOwnProperty(member))
      dataObj[leagueID][member]={}
    dataObj[leagueID][member][matchDay]=data
    if(diff>0){
      db.set(leagueID, dataObj[leagueID])
    }else{
      throw creatError.Forbidden("We are sorry, You have crossed the deadline");
    }
    
    console.log("Data Added Successfully")
    return "Data Added Successfully"
  } catch (error) { 
    console.log("Could not add Data")
    throw error;
  }
}

exports.getData =  (teamName) => {
  try {
    console.log("Team Name: "+teamName)
    let teamData = db.get(teamName)
    console.log("teamData: "+teamData)
    if (!teamData) throw creatError.NotFound()

    return teamData
  } catch (error) {
    throw error;
  }
}

exports.getAllData = () => {
  try {
    const teamData = db.JSON()

    if (!teamData) throw creatError.NotFound()

    return teamData;
  } catch (error) {
    throw error
  }
}
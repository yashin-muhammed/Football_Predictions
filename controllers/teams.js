const creatError = require('http-errors')
const JSONdb = require('simple-json-db')
const db = new JSONdb(process.env.TEAMS_DB_PATH, { asyncWrite: true })
var fs = require("fs");
// handles League Creation

exports.addTeam =  (req) => {
  try {
    console.log("Inside addTeam Function")
    const { teamName, iconPath } = req.body
    if (db.get(teamName)) throw creatError.Forbidden("Team Already Exist");
    if (!fs.existsSync(iconPath)) throw creatError.NotFound()
    // this is just a demo code and not for production
    let id="Team-"+Object.keys(db.JSON()).length;
    db.set(teamName, { id, iconPath })
    console.log("Team Added Successfully")
    return "Team Added Successfully"
  } catch (error) { 
    console.log("Could not add Team")
    throw error;
  }
}

exports.getTeam =  (teamName) => {
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

exports.getAllLeague = () => {
  try {
    const teamData = db.JSON()

    if (!teamData) throw creatError.NotFound()

    return teamData;
  } catch (error) {
    throw error
  }
}
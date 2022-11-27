const creatError = require('http-errors')
const JSONdb = require('simple-json-db')
const db = new JSONdb(process.env.FIXTURES_DB_PATH, { asyncWrite: true })
var {getTeam} = require("./teams")
// handles League Creation
var util = require('util');
exports.addFixture =  (req) => {
  try {
    console.log("Inside addFixture Function")
    //const { homeTeam, awayTeam, DOM } = req.body
    console.log(req.body)
    for(i in req.body){
      console.log("i: "+i)
      let homeTeam=((i).substring(0,i.indexOf(" vs"))).trim();
      console.log("homeTeam: "+homeTeam);
      let awayTeam=((i).replace(homeTeam,"").replace(" vs ","")).trim();
      console.log("awayTeam: "+awayTeam);

      let fixtures=db.JSON()
      for(j in fixtures){
        if (fixtures[j].hasOwnProperty(i)) throw creatError.Forbidden("Fixture Already Exist");
      }
      if (!homeTeam) throw creatError.NotFound("Home Team not found")
      if (!getTeam(homeTeam)) throw creatError.NotFound("Invalid HomeTeam")
      if (!awayTeam) throw creatError.NotFound("Away Team not found")
      if (!getTeam(awayTeam)) throw creatError.NotFound("Invalid Away Team")
      if (!req.body[i]) throw creatError.NotFound("Date of Fixture not found")
    }
    
    
    let id="MatchDay-"+((Object.keys(db.JSON()).length)+1);
    db.set(id, req.body)
    console.log("Match Day Fixture Added Successfully")
    return "Match Day  Fixture Added Successfully"
  } catch (error) { 
    console.log("Could not add Fixture")
    throw error;
  }
}

exports.getFixture =  (matchDay) => {
  try {
    console.log("matchDay: "+matchDay)
    let fixtureData = db.get(matchDay)
    console.log("fixtureData: "+fixtureData)
    if (!fixtureData) throw creatError.NotFound()

    return fixtureData
  } catch (error) {
    throw error;
  }
}

exports.getAllFixtures = () => {
  try {
    const fixtureData = db.JSON()

    if (!fixtureData) throw creatError.NotFound()

    return fixtureData;
  } catch (error) {
    throw error
  }
}

exports.popFixture = (matchDay) => {
  try {
    console.log("Inside Pop Fixture Function")
    const fixtureData = db.get(matchDay)

    if (!fixtureData) throw creatError.NotFound("Fixture with matchDay: "+matchDay+" does not exist")
    
    console.log("Preparing to Pop: "+matchDay +" from fixtures")
    db.delete(matchDay);
    return "Fixture Popped Successfully";
  } catch (error) {
    throw error
  }
}
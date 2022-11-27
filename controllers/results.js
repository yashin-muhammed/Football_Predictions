const creatError = require('http-errors')
const JSONdb = require('simple-json-db')
const db = new JSONdb(process.env.RESULTS_DB_PATH, { asyncWrite: true })
const {getFixture} = require("./fixtures")
// handles League Creation
var util = require('util');
exports.addResults =  (data) => {
  try {
    console.log("Inside addResults Function")
    const matchDay  = Object.keys(data)[0];
    let resultsObj=db.get(matchDay)
    
    if (resultsObj) throw creatError.Forbidden("MatchDay result is already Added");
    
    db.set(matchDay, data[matchDay]);
    console.log("Results Added Successfully")
    return "Results Added Successfully"
  } catch (error) { 
    console.log("Could not add Results")
    throw error;
  }
}

exports.getResults =  (matchDay) => {
  try {
    console.log("MatchDay: "+matchDay)
    //db.sync();
    //console.log("All Result:"+util.inspect(db.JSON()));
    let resultData = db.JSON()[matchDay]
    if (!resultData) throw creatError.NotFound()
    console.log("resultData: "+resultData)
    return resultData
  } catch (error) {
    throw error;
  }
}

exports.getAllResults = () => {
  try {
    db.sync();
    const resultData = db.JSON()

    if (!resultData) throw creatError.NotFound()

    return resultData;
  } catch (error) {
    throw error
  }
}

exports.updateResult = (matchDay) => {
  try {
    console.log("Inside Update Result Function")
    db.sync();
    let resultData = db.JSON()
    if (!resultData) throw creatError.NotFound()
    resultData[matchDay].scored=true;
    db.set(matchDay, resultData[matchDay])
    return resultData;
  } catch (error) {
    throw error
  }
}
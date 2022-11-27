const creatError = require('http-errors')
var util = require('util');
var fs = require("fs");
const { getAllData } = require('./data');
const { getAllLeague , updateLeagueUserScore} = require('./league');
const { getAllFixtures } = require('./fixtures');
const { getResults, updateResult } = require('./results');
const { NOTFOUND } = require('dns');

// handles League Creation

exports.updateScore =  (matchDay) => {
  try {
    console.log("Inside updateScore Function")
    let resultData=getResults(matchDay);
    if(resultData.scored) {
      console.log("The scoring is already performed for this match day")
      return "The scoring is already performed for this match day";
    }
    let leagueData=getAllLeague();
    let allData=getAllData();
    console.log("matchDay inside score: "+ matchDay)
    
    if(!resultData) throw creatError.NotFound("Result is not yet updated in order to update score")

    //console.log("resultData: "+resultData);
    for(l in leagueData){
      console.log("League Name: "+leagueData[l].leagueName)
      let leagueID=l;
      console.log("l: "+leagueID)
      for(m in leagueData[l].members){
        
        let username=leagueData[l].members[m].username;
        console.log("username: "+username)
        if(!allData[leagueID]|| !allData[leagueID][username]|| !allData[leagueID][username][matchDay])
          continue;
        currUserData=allData[leagueID][username][matchDay]
        //console.log("userPrediction: "+util.inspect(currUserData))
        //let score=leagueData[l].members[m].score;
        //console.log("resultData: "+util.inspect(resultData))
        for(game in resultData.matches){
          let currGame=resultData.matches[game];
          let homeTeam=currGame.substring(0,currGame.indexOf(" vs ")).trim();
          let awayTeam=currGame.replace(homeTeam,"").replace(" vs ","").trim();
          if(currUserData[homeTeam]==""|| currUserData[awayTeam]==""){
            continue;
          }
          let winningTeam;
          if(resultData[homeTeam]>resultData[awayTeam]){
            winningTeam=homeTeam;
          }else if(resultData[awayTeam]>resultData[homeTeam]){
            winningTeam=awayTeam;
          }else{
            //winningTeam=resultData.winner[game];
            winningTeam="draw"
          }
          let predictedWinner;
          if(currUserData[homeTeam]>currUserData[awayTeam]){
            predictedWinner=homeTeam;
          }else if(currUserData[awayTeam]>currUserData[homeTeam]){
            predictedWinner=awayTeam;
          }else{
            //predictedWinner=currUserData.winner[game];
            predictedWinner="draw"
          }
          
          if(winningTeam==predictedWinner ){
            leagueData[l].members[m].points+=2;
            console.log("UserName: "+username+" preducted "+homeTeam+" vs "+awayTeam+" winner correctly adding 2 points")
            console.log("Current Point: "+leagueData[l].members[m].points)
          }

          if(resultData[homeTeam]==currUserData[homeTeam]){
            leagueData[l].members[m].points+=1;
            console.log("UserName: "+username+" preducted home team: "+homeTeam+" score correctly adding 1 points")
            console.log("Current Point: "+leagueData[l].members[m].points)
          }

          if(resultData[awayTeam]==currUserData[awayTeam]){
            leagueData[l].members[m].points+=1;
            console.log("UserName: "+username+" preducted away team: "+awayTeam+" score correctly adding 1 points")
            console.log("Current Point: "+leagueData[l].members[m].points)
          }
          if(resultData[homeTeam]==currUserData[homeTeam] && resultData[awayTeam]==currUserData[awayTeam]){
            leagueData[l].members[m].SpotOnPredictions+=1;
          }
        }
      }
      updateLeagueUserScore(l, leagueData[l])
    }
    updateResult(matchDay);
    return "Score Updated Successfully"
  } catch (error) { 
    console.log("Could not update score")
    throw error;
  }
}


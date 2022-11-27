const creatError = require('http-errors')
const JSONdb = require('simple-json-db')
const bcrypt = require('bcrypt');
let db = new JSONdb(process.env.USER_DB_PATH)
let ENCRYPT_SALT = process.env.ENCRYPT_SALT
var util = require('util');

const { v4: uuid } = require('uuid');
const { concat } = require('lodash');

exports.getUser =  (email) => {
  try {
    // checking for any error occurance
    //const { email } = req.payload
    if (!email) throw creatError.ExpectationFailed("email")
    
    let userData = db.get(email)

    if (!userData) throw creatError.NotFound()

    // creating user as json
    //const userDataObj = userData

    // remove the password key before sending it to client
    //delete userData.password
    return userData;
    //res.status(200).send(userDataObj)
  } catch (error) {
    throw error
  }
}

exports.getAllUser =  () => {
  try {
    // checking for any error occurance
    //const { email } = req.payload
    
    let userData = db.JSON()

    if (!userData) throw creatError.NotFound()

    // creating user as json
    //const userDataObj = userData

    // remove the password key before sending it to client
    //delete userData.password
    return userData;
    //res.status(200).send(userDataObj)
  } catch (error) {
    throw error
  }
}

// handles register
exports.register = async (req, res, next) => {
  try {
    console.log("Inside Register Function")
    const { email, username, password,type } = req.body
    console.log("Password: "+password+"\nSalt: "+ENCRYPT_SALT)
    const hashedPass=bcrypt.hashSync(password,Number(ENCRYPT_SALT));
    console.log("HashedPass: "+util.inspect(hashedPass))
    // this is just a demo code and not for production
    this.setUser(email, { id: uuid(), username, password: hashedPass , type, leagues: []})
    res.status(201)
    console.log("User Created Successfully")
    res.render('userLogin',{});
  } catch (error) { 
    next(error)
  }
}

exports.changePass = (email, newPassword) => {
  try {
    console.log("Inside changePass Function")
    const hashedPass=bcrypt.hashSync(newPassword,Number(ENCRYPT_SALT));
    console.log("HashedPass: "+util.inspect(hashedPass))
    // this is just a demo code and not for production
    let userData=this.getAllUser();
    console.log("userData: "+userData)
    userData[email].password=hashedPass;
    db.set(email, userData[email]);
    res.status(201)
    console.log("User Created Successfully")
    res.render('userLogin',{});
  } catch (error) { 
    next(error)
  }
}

exports.setUser = (key, value) => {
  try{
    db.set(key,value);
  }catch(e){
    throw e;
  }
}

const creatError = require('http-errors')
const {getUser} =require("./user")
const JSONdb = require('simple-json-db')
const {signJwtToken} = require("../utils/jwt")
const bcrypt = require('bcrypt');

var util = require('util');
const { brotliCompressSync } = require('zlib');
/**
 * Access token delivery handler
 */
const tokenHandler = async (user) => {
  try {
    // generate token
    const accessToken = await signJwtToken(user, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_EXPIRY
    })
    return Promise.resolve(accessToken)
  } catch (error) {
    return Promise.reject(error)
  }
}

// handles login
exports.login = async (req, res, next) => {
  try {
    console.log("Inside Login Function")
    let userdb = new JSONdb(process.env.USER_DB_PATH)
    const { email, password } = req.body
    console.log("email: "+email)
    //console.log("password: "+password)
    let userData = userdb.get(email)
    console.log(userData)
    if (!userData) throw creatError.NotFound()
    
    const { id, username, password: dbPassword } = userData;

    //if (!(id && (password === dbPassword))) throw creatError.Unauthorized()
    if (!(id && bcrypt.compareSync(password,dbPassword))) throw creatError.Unauthorized()

    const token = await tokenHandler({ id, username, email })
    res.send(token)
  } catch (error) {
    next(error)
  }
}
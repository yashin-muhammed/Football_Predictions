require('dotenv').config()
const creatError = require('http-errors')

const _getKeyValue = require('lodash/get')
const { verifyJwtToken } = require('../utils/jwt')

module.exports = {
  accessTokenValidator: async (req, res, next) => {
    try {
      let token = null
      token = _getKeyValue(req.headers, 'authorization', null)
      //console.log("token: "+token)
      if (!token) throw creatError.Unauthorized()
      token = token.split(' ')[1]
      req.payload = await verifyJwtToken({ token, secret: process.env.JWT_ACCESS_TOKEN_SECRET })
      next()
    } catch (error) {
      next(error)
    }
  }
}
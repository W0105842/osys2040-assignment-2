const users = require('../model/users')
const cookie = require('cookie')
const jwt = require('jsonwebtoken')

module.exports = async function(req, res, next) {
  // signedInAs MUST be set for templates to work
  res.locals.signedInAs = undefined
  var handle
  const token = req.cookies.token
  if (!token) return next()
  try {
    const decoded = jwt.verify(token, users.JWT_SECRET)
    handle = decoded.handle
  } catch (exception) {
    res.setHeader('Set-Cookie', cookie.serialize('token', ' ', {
      httpOnly: true,
      maxAge: 0, // No token if 'signedInAs' = undefined
      path: '/',
    }))
    return next()
  }
  const user = await users.getUser(handle)
  if(user) res.locals.signedInAs = handle
  next()
}
const users = require('../model/users')
const cookie = require('cookie')
const jwt = require('jsonwebtoken')

// NOTE: 'signedInAs' MUST be set for templates to work

module.exports = async function(req, res, next) { 
  res.locals.signedInAs = undefined;
  let handle;
  const token = req.cookies.token;
  if(!token) return next()
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    handle = decoded.handle;
  } catch (exception) {
    res.setHeader('Set-Cookie', cookie.serialize('token', ' ', {
      httpOnly: true,
      maxAge: 0, // No token if 'signedInAs' = undefined
      path: '/',
    }))
    return next()
  }
  const user = await users.getUser(handle);
  if(user) res.locals.signedInAs = handle;
  next()
}
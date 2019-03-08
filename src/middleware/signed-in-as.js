const AuthUtil = require('../utils/AuthUtil')
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const PostgresUtil = require('../utils/PostgresUtil')

module.exports = async function(req, res, next) {
  // signedInAs MUST be set for templates to work
  res.locals.signedInAs = undefined

  var handle
  const token = req.cookies.token
  if (!token) {
    return next()
  }

  try {
    const decoded = jwt.verify(token, AuthUtil.JWT_SECRET)
    handle = decoded.handle
  } catch (exception) {
    console.log(exception)

    res.setHeader('Set-Cookie', cookie.serialize('token', ' ', {
      httpOnly: true,
      maxAge: 0, // expire immediately
      path: '/',
    }))

    return next()
  }

  const result = await PostgresUtil.pool.query(
    'SELECT * FROM app_users WHERE handle = $1::text',
    [ handle ])

  const foundUser = result.rows[0]
  if (foundUser) {
    res.locals.signedInAs = handle
  }

  next()
}

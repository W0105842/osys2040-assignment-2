const createError = require('http-errors')
const express = require('express')
const Users = require('../model/users')
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
var router = express.Router()

// Go to "Sign up" page [GET localhost:8000/auth/sign-up]
router.get('/auth/sign-up', function(req, res, next) {
  res.render('sign-up')
})

// New user tries to sign up [POST localhost:8000/auth/sign-up]
router.post('/auth/sign-up', async function(req, res, next) {
  var handle = req.body.handle
  if(!handle) return next(createError(400, 'Missing handle!'))
  var password = req.body.password
  if(!password) return next(createError(400, 'Missing password!'))
  try {
    await Users.createUser(handle, password)
    setSignedInCookie(res, handle)
    res.redirect('/')
  } catch(exception) {
    return next(exception)
  }
})

// Go to "Sign in" page [GET localhost:8000/auth/sign-in]
router.get('/auth/sign-in', function(req, res, next) {
  res.render('sign-in')
})

// User attempts to log in [POST localhost:8000/auth/sign-in]
router.post('/auth/sign-in', async function(req, res, next) {
  var handle = req.body.handle
  if(!handle) return next(createError(400, 'Missing handle!'))
  var password = req.body.password
  if(!password) return next(createError(400, 'Missing password!'))
  try {
    await Users.validateUser(handle, password)
    setSignedInCookie(res, handle)
    res.redirect('/')
  } catch (exception) {
    return next(createError(401, exception.message))
  }
})

// Assign token to logged-in user
function setSignedInCookie(res, handle) {
  const token = jwt.sign({handle: handle}, process.env.JWT_SECRET);
  cookiesArray = [];
  cookiesArray.push(cookie.serialize('token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // Token expires in 1 day
    sameSite: 'strict',
    path: '/',
  }));
  res.setHeader('Set-Cookie', cookiesArray);
}

// Logging out [GET localhost:8000/auth/sign-out]
router.get('/auth/sign-out', function(req, res, next) {
  cookiesArray = [];
  cookiesArray.push(cookie.serialize('token', '', {
    httpOnly: true,
    maxAge: 0, // Delete token
    path: '/',
  }));
  res.setHeader('Set-Cookie', cookiesArray);
  res.redirect('/')
})

module.exports = router
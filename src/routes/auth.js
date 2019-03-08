const createError = require('http-errors')
const express = require('express')
const AuthUtil = require('../utils/AuthUtil')
const cookie = require('cookie')
const jwt = require('jsonwebtoken')

var router = express.Router()

router.get('/sign-in', function(req, res, next) {
  res.render('sign-in')
})

router.post('/sign-in', async function(req, res, next) {
  var handle = req.body.handle
  if (!handle) {
    return next(createError(400, 'missing handle'))
  }
  var password = req.body.password
  if (!password) {
    return next(createError(400, 'missing password'))
  }

  try {
    await AuthUtil.validateUser(handle, password)
    setSignedInCookie(res, handle)
    res.redirect('/')
  } catch (exception) {
    return next(createError(401, exception.message))
  }
})

function setSignedInCookie(res, handle) {
  const token = jwt.sign({ handle: handle }, AuthUtil.JWT_SECRET)

  res.setHeader('Set-Cookie', cookie.serialize('token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // expire in 1 week
    sameSite: 'strict',
    path: '/',
  }))
}

router.get('/sign-out', function(req, res, next) {
  res.setHeader('Set-Cookie', cookie.serialize('token', ' ', {
    httpOnly: true,
    maxAge: 0, // expire immediately
    path: '/',
  }))

  res.redirect('/')
})

router.get('/sign-up', function(req, res, next) {
  res.render('sign-up')
})

router.post('/sign-up', async function(req, res, next) {
  var handle = req.body.handle
  if (!handle) {
    return next(createError(400, 'missing handle'))
  }
  var password = req.body.password
  if (!password) {
    return next(createError(400, 'missing password'))
  }

  try {
    await AuthUtil.createUser(handle, password)

    setSignedInCookie(res, handle)

    res.redirect('/')
  } catch (exception) {
    return next(exception)
  }
})

module.exports = router

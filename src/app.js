const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const app = express()

// View-engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Middleware
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(require('./middleware/signed-in-as.js'))

// Make 'req' available to views
app.use(function(req, res, next) {
  res.locals.req = req
  next()
})

// Routing
app.use(require('./routes/index'))
app.use(require('./routes/users.js'))
app.use(require('./routes/auth.js'))
app.use(require('./routes/chat.js'))

// 404 errors
app.use(function(req, res, next) {
  next(createError(404))
})

// Error handler (Error messages only displayed in dev environment)
app.use(function(err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
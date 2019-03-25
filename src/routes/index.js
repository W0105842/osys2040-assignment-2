const express = require('express')

const router = express.Router()

// Home page [GET localhost:8000/]
router.get('/', function(req, res, next) {
  res.render('index')
})

module.exports = router
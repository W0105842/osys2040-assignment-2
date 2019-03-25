const express = require('express')
const Users = require('../model/users')
const router = express.Router()

// Load all users [GET localhost:8000/users]
router.get('/users', async function(req, res, next) {
  const users = await Users.getUsers()
  const handles = users.map(function(user) {
    return user.handle
  })
  res.render('users', {users: handles})
})

module.exports = router
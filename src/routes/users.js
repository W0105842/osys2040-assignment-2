const express = require('express')
const PostgresUtil = require('../utils/PostgresUtil')

const router = express.Router()

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const result = await PostgresUtil.pool.query(
    'SELECT * FROM app_users')

  const users = result.rows.map(function(user) {
    return user.handle
  })

  res.render('users', {
    users: users,
  })
})

module.exports = router

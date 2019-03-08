// Playing with the Array.map function.

var result = {
  rows: [
    { handle: 'user1', password_hash: 'hashything' },
    { handle: 'user2', password_hash: 'hashything' },
  ]
}

console.log('raw rows:', result.rows)

var users = result.rows.map(function(user) {
  return user.handle
})

console.log('mapped users:', users)

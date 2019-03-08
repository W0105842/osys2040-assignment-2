const jwt = require('jsonwebtoken')
const JWT_SECRET = '3nYZHW9zguCUvpQWYtfFAF3H3GRdYSaF5vhw3qGaM7rTFKErFf82de4YvPDeWJgBNvPxxVva4s7FmzrrtksczczrMzweEU5hXVJqyerhAhha7FDeU9v5WZPFaNxhWKJpdN3RYZhgsDwTt2x5DEhr3rxz6wMB83PNCD6DbuDWaXKw4pBpGyY5aettHMsDe6Xk8Bk7ZmdxkDd9pTVWtDhf85dQSMwZZrJ9xFZthAMhSuf3Bkb6zxnUDpUga33jvZKsPRYpkXuZ8cr2T7UgVp66B6uK33EWHed2EsPX78ckn2nz'

const token = jwt.sign({ foo: 'bar' }, JWT_SECRET)
console.log('token:', token)

const decoded = jwt.verify(token, JWT_SECRET)
console.log('decoded:', decoded)

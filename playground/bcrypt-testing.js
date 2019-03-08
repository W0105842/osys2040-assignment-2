var bcrypt = require('bcrypt-nodejs')

// var hash = bcrypt.hashSync('bacon', '$2a$10$llw0G6IyibUob8h5XRt9xuRczaGdCm/AiV6SSjf5v78XS824EGbh.')

var rounds = 10
console.time('genSalt')
var salt = bcrypt.genSaltSync(rounds)
console.timeEnd('genSalt')
console.log('salt in '+rounds+' rounds:', salt)

console.time('hash')
var hash = bcrypt.hashSync('bacon', salt)
console.timeEnd('hash')
console.log('bacon hash:', hash)

// bacon hash: $2a$10$Ik7m5ueDxPDRuZSKV/gJtO5buxmqWKa7Wr0Ot5dm/SJzAy3FEA48e
// bacon hash: $2a$10$SiOty7FnRHtMb/Wy9UcNlupBghObvv.Vng3Y2hA4vS9LpIheOC9j2

// hard-coded salt:

// bacon hash: $2a$10$llw0G6IyibUob8h5XRt9xuSU3YT7s5j8iialSBSd23DaURwXhYs5i
// bacon hash: $2a$10$llw0G6IyibUob8h5XRt9xuSU3YT7s5j8iialSBSd23DaURwXhYs5i
// bacon hash: $2a$10$llw0G6IyibUob8h5XRt9xuSU3YT7s5j8iialSBSd23DaURwXhYs5i
// bacon hash: $2a$10$llw0G6IyibUob8h5XRt9xuSU3YT7s5j8iialSBSd23DaURwXhYs5i


console.log('compareSync bacon:', bcrypt.compareSync('bacon', hash)); // true
console.log('compareSync veggies:', bcrypt.compareSync('veggies', hash)); // false

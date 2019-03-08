const PostgresUtil = require('./PostgresUtil')
const bcrypt = require('bcrypt-nodejs')

async function createUserTable() {
  return await PostgresUtil.pool.query(`CREATE TABLE app_users (
    handle         VARCHAR(100) PRIMARY KEY,
    password_hash  VARCHAR(200)
  )`)
}

async function createUser(handle, password) {
  try {
    const passwordHash = bcrypt.hashSync(password)

    const result = await PostgresUtil.pool.query(
      'INSERT INTO app_users VALUES ($1::text, $2::text);',
      [
        handle, passwordHash
      ])

    return result
  } catch (exception) {
    if (exception.code === '42P01') {
      // 42P01 - table is missing - we'll create it and try again
      await createUserTable()
      return createUser(handle, password)
    } else if (exception.code === '23505') {
      throw new Error(`User ${handle} already exists`)
    } else {
      // unrecognized, throw error to caller
      console.error(exception)
      throw exception
    }
  }
}

async function validateUser(handle, password) {
  try {
    // look up user with the passed handle
    const result = await PostgresUtil.pool.query(
      'SELECT * FROM app_users WHERE handle = $1::text',
      [ handle ])

    // determine if we found a user with that handle
    const foundUser = result.rows[0]
    if (!foundUser) {
      throw new Error(`no user with handle ${handle}`)
    }

    // check that the password matches the one used to create the hash
    const passwordHash = foundUser.password_hash
    if (!passwordHash) {
      console.log('foundUser:', foundUser)
      throw new Error('password hash not found - time for a database refresh?')
    }
    if (!bcrypt.compareSync(password, passwordHash)) {
      throw new Error('incorrect password')
    }
  } catch (exception) {
    if (exception.code === '42P01') {
      // 42P01 - table is missing - we'll create it and try again
      await createUserTable()
      return validateUser(handle, password)
    } else {
      // unrecognized, throw error to caller
      console.error(exception)
      throw exception
    }
  }
}

module.exports = {
  createUser: createUser,
  validateUser: validateUser,
  // TODO: read from environment variable
  JWT_SECRET: 'There once was a person studying at the NSCC',
}

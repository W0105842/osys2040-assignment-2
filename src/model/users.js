const PostgresUtil = require('../utils/PostgresUtil')
const bcrypt = require('bcrypt-nodejs')

// Create the 'app_users' table
async function createUserTable() {
  return await PostgresUtil.pool.query(`CREATE TABLE app_users (
    handle         VARCHAR(100) PRIMARY KEY,
    password_hash  VARCHAR(200)
  )`)
}

// Fetch all users
async function getUsers() {
  try {
    const result = await PostgresUtil.pool.query('SELECT * FROM app_users');
    return result.rows
  } catch (exception) {
    if (exception.code === '42P01') { // 42P01 - Table is missing so we'll create it and try again
      await createUserTable();
      return getUsers();
    } else { // Unrecognized, throw error to caller
      console.error(exception);
      throw exception
    }
  }
}

// Fetch one specific user
async function getUser(handle) {
  try {
    const result = await PostgresUtil.pool.query('SELECT * FROM app_users WHERE handle = $1::text', [handle]);
    return result.rows[0];
  } catch (exception) {
    if (exception.code === '42P01') { // 42P01 - Table is missing so we'll create it and try again
      await createUserTable();
      return getUser(handle);
    } else { // Unrecognized, throw error to caller
      console.error(exception);
      throw exception
    }
  }
}

// Register a new user during sign-up
async function createUser(handle, password) {
  try {
    const passwordHash = bcrypt.hashSync(password);
    const result = await PostgresUtil.pool.query('INSERT INTO app_users VALUES ($1::text, $2::text);', [handle, passwordHash]);
    return result
  } catch (exception) {
    if (exception.code === '42P01') { // 42P01 - Table is missing so we'll create it and try again
      await createUserTable();
      return createUser(handle, password);
    } else if (exception.code === '23505') {
      throw new Error(`User ${handle} already exists`)
    } else { // Unrecognized, throw error to caller
      console.error(exception);
      throw exception
    }
  }
}

// Validate a user during log-in
async function validateUser(handle, password) {
  const user = await getUser(handle);
  if(!user) throw new Error(`no user with handle ${handle}`);
  const passwordHash = user.password_hash;
  if(!passwordHash) throw new Error('Password hash not found - time for a database refresh?');
  if(!bcrypt.compareSync(password, passwordHash)) throw new Error('Incorrect password');
}

module.exports = {
  createUser: createUser,
  getUser: getUser,
  getUsers: getUsers,
  validateUser: validateUser,
}
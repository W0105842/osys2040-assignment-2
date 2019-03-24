const PostgresUtil = require('../utils/PostgresUtil')

// Fetch all likes 
async function getLikes() {
  try {
    const result = await PostgresUtil.pool.query('SELECT * FROM likes');
    return result.rows
  } catch(exception) {
    if(exception.code === '42P01') { // Table is missing so we'll create it and try again
      await createLikeTable()
      return getLikes()
    } else { // Unrecognized...throw error
      console.error(exception)
      throw exception
    }
  }
}

// Add a new like
async function addLike(handle, messageId) {
  try {
    const result = await PostgresUtil.pool.query(
      'INSERT INTO likes (created_by, for_message) VALUES ($1::text, $2::int);', [handle, messageId])
    return result
  } catch (exception) {
    if (exception.code === '42P01') { // Table is missing so we'll create it and try again
      await createMessageTable()
      return createMessage(handle, data)
    } else { // Unrecognized...throw error
      console.error(exception)
      throw exception
    }
  }
}

// Remove a like
async function unLike(handle, messageId) {
  try {
    const result = await PostgresUtil.pool.query(
      'DELETE FROM likes WHERE created_by=$1::text AND for_message=$2::int;', [handle, messageId])
    return result
  } catch (exception) {
    if (exception.code === '42P01') { // Table is missing so we'll create it and try again
      await createMessageTable()
      return createMessage(handle, data)
    } else { // Unrecognized...throw error
      console.error(exception)
      throw exception
    }
  }
}

// Create the 'likes' table
async function createLikeTable() {
  return await PostgresUtil.pool.query(`CREATE TABLE likes (
    id          SERIAL PRIMARY KEY,
    created_by  VARCHAR(200) REFERENCES app_users(handle),
    for_message INT REFERENCES messages(id)
  )`)
}

module.exports = {
  addLike: addLike,
  getLikes: getLikes,
}
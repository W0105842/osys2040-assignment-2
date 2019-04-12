const PostgresUtil = require('../utils/PostgresUtil')

// Fetch all messages
async function getMessages() {
  try {
    const result = await PostgresUtil.pool.query('SELECT * FROM reviews')
    return result.rows
  } catch(exception) {
    if (exception.code === '42P01') { // 42P01 - Table is missing so we'll create it and try again
      await createMessageTable()
      return getMessages()
    } else { // Unrecognized...throw error to caller
      console.error(exception)
      throw exception
    }
  }
}

// Add a new message
async function createMessage(handle, message) {
  try {
    const result = await PostgresUtil.pool.query('INSERT INTO reviews (created_by, message) VALUES ($1::text, $2::text);', [handle, message])
    return result
  } catch (exception) {
    if (exception.code === '42P01') { // 42P01 - Table is missing so we'll create it and try again
      await createMessageTable()
      return createMessage(handle, message)
    } else { // Unrecognized...throw error to caller
      console.error(exception)
      throw exception
    }
  }
}

// Create the 'messages' table
async function createMessageTable() {
  return await PostgresUtil.pool.query(`CREATE TABLE reviews (
    id          SERIAL PRIMARY KEY,
    created_at  TIMESTAMP DEFAULT NOW(),
    created_by  VARCHAR(30) REFERENCES app_users(handle),
    message     VARCHAR(200)
  )`)
}

module.exports = {
  createMessage: createMessage,
  getMessages: getMessages,
}
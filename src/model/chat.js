const PostgresUtil = require('../utils/PostgresUtil')

async function createMessageTable() {
  return await PostgresUtil.pool.query(`CREATE TABLE messages (
    id          SERIAL PRIMARY KEY,
    created_at  TIMESTAMP DEFAULT NOW(),
    created_by  VARCHAR(30) REFERENCES app_users(handle),
    message     VARCHAR(200)
  )`)
}

async function createMessage(handle, data) {
  try {
    const result = await PostgresUtil.pool.query(
      'INSERT INTO messages (created_by, data) VALUES ($1::text, $2::message);', [handle, data])
    return result
  } catch (exception) {
    if (exception.code === '42P01') {
      // 42P01 - Table is missing so we'll create it and try again
      await createMessageTable()
      return createMessage(handle, data)
    } else {
      // Unrecognized...throw error to caller
      console.error(exception)
      throw exception
    }
  }
}

async function getMessages() {
  try {
    const result = await PostgresUtil.pool.query(
      'SELECT * FROM messages')
    return result.rows
  } catch(exception) {
    if (exception.code === '42P01') {
      // 42P01 - Table is missing so we'll create it and try again
      await createMessageTable()
      return getMessages()
    } else {
      // Unrecognized...throw error to caller
      console.error(exception)
      throw exception
    }
  }
}

module.exports = {
  createMessage: createMessage,
  getMessages: getMessages,
}
const fs = require('fs')
const path = require('path')

function getFilename(name) {
  return path.join(__dirname, '../../data', `${name}.json`)
}

function readDataFile(name) {
  try {
    const filename = getFilename(name)
    const json = fs.readFileSync(filename)
    return JSON.parse(json)
  } catch(exception) {
    return {}
  }
}

function writeDataFile(name, data) {
  const filename = getFilename(name)
  fs.writeFileSync(filename, JSON.stringify(data, null, 2))
}

module.exports = {
  readUsers: function() { return readDataFile('users') },
  writeUsers: function(data) { return writeDataFile('users', data) },

  readRooms: function() { return readDataFile('chat-rooms') },
  writeRooms: function(data) { return writeDataFile('chat-rooms', data) },
}

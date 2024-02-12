const DB = require('./db.js');

DB.connect()

async function updateLastAccess () {
  await DB.query(`INSERT (${Date.now()}) INTO "LastAccesses"`)
}

updateLastAccess()
setTimeout(() => {
  updateLastAccess()
}, 1000)
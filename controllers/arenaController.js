const arenaService = require('../services/arenaService')


module.exports = [{
  path: '/login',
  method: 'POST',
  handler: (ws, user) => {
    console.log('get data', user)
    arenaService.addUser(ws, user)
    ws.send('user login successfully')
  }
}]
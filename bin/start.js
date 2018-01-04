const debug = require('debug')('app:start');
const server = require('../server');
const config = require('../config');


server.listen(config.wss.port, () => {
  debug(`wss server is running at: ${config.wss.protocol}://${config.wss.host}:${config.wss.port}`)
})
const express = require('express')
const http = require('http')
const url = require('url')
const WebSocket = require('ws')
const ApiHandler = require('./controllers')
const debug = require('debug')('app:wss')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })
const apiHandler = new ApiHandler()
const heartbeat = () => { this.isAlive = true }
wss.on('connection', (ws, req) => {
  const location = url.parse(req.url, true)
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  ws.isAlive = true
  ws.on('pong', heartbeat.bind(ws))
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  // message
  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message)
      if (parsed) {
        switch (parsed && parsed.type) {
          case 'api':
            debug('received api:', parsed)
            apiHandler.handle(ws, parsed)
            break
          default:
            debug('received unhandled message: ', message)
        }
      }
    } catch (err) {
      debug('error when parse message: ', message)
    }
  })

  ws.send('pong', (err) => {
    if (err) debug(err)
  })

  ws.on('error', (err) => {
    debug('received error: ', err)
  })

  // socket health check
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate()
      ws.isAlive = false
      ws.ping('', false, true)
    })
  }, 30000)
  debug(`a client is connected from: ${ip}`)
})

module.exports = server


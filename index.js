'use strict'

require('loadenv')()

const bunyan = require('bunyan')
const httpProxy = require('http-proxy')

// Logger for the proxy
const log = bunyan
  .createLogger({
    name: 'node-http',
    streams: [{ level: process.env.LOG_LEVEL, stream: process.stdout }],
    serializers: bunyan.stdSerializers
  })
  .child({
    port: process.env.PORT,
    origin: {
      host: process.env.ORIGIN_HOST,
      port: process.env.ORIGIN_PORT
    }
  })

const proxy = httpProxy.createProxyServer({
  target: `http://${process.env.ORIGIN_HOST}:${process.env.ORIGIN_PORT}`
})

proxy.listen(process.env.PORT)

proxy.on('proxyReq', function (req) {
  log.info({ req: req }, 'Nathan BRANCH Request')
})

proxy.on('error', function (err, req, res) {
  log.error(err.data || {}, err.message || 'An unknown error occured.')
  res.writeHead(502, {
    'Content-Type': 'text/plain'
  })
  res.end('Bad Gateway')
})

//
//CHANGE

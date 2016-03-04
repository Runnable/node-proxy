'use strict'

require('loadenv')()

const bunyan = require('bunyan')
const clone = require('clone')
const http = require('http')
const request = require('request')

// Logger for the proxy
const logger = bunyan
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

// Create and start the simple proxy server
http.createServer(proxyRequest).listen(process.env.PORT, (err) => {
  if (err) {
    return log.fatal({ err: err }, 'Proxy failed to start')
  }
  logger.info(`node-proxy listening on ${process.env.PORT}`)
})

/**
 * Proxies request for the configured origin.
 */
function proxyRequest (req, response) {
  let headers = clone(req.headers)
  headers.host = `${process.env.ORIGIN_HOST}:${process.env.ORIGIN_PORT}`

  const requestOptions = {
    method: req.method,
    headers: headers,
    uri: [
      'http://',
      process.env.ORIGIN_HOST, ':', process.env.ORIGIN_PORT,
      req.url
    ].join('')
  }

  const log = logger.child({
    method: req.method,
    path: req.url,
    headers: req.headers,
    originRequest: requestOptions
  })

  log.info(`Proxying ${req.method} ${req.url}`)

  request(requestOptions, (err, originResponse, body) => {
    if (err) {
      log.error({ err: err }, 'Error when requesting from origin')
      response.writeHead(502, {'Content-Type': 'text/plain'})
      response.end('Error Requesting From Origin')
      return
    }
    log.info({ status: originResponse.statusCode }, 'Response from origin')
    response.writeHead(originResponse.statusCode, originResponse.headers)
    response.end(body)
  })
}

# node-proxy

## Overview

- Simple HTTP proxy written in node
- Listens on `process.env.PORT` (default: `3000`)
- Requests are passed to: `process.env.ORIGIN_HOST:process.env.ORIGIN_PORT`
- Logs proxy requests and responses via [bunyan](https://github.com/trentm/node-bunyan)

## Container Details

- Stack Type / Version: Node.js `>= 4`
- Packages: *none*
- Build Commands: `npm install`
- Container CMD: `npm start`

## Container Environment
```
# Host to the origin (content) server for the proxy
ORIGIN_HOST=<elastic-host>

# Port to of the origin server
ORIGIN_PORT=<some-port>
```

no more additional comments

var ts = require('ts-node')
ts.register({
    project: 'tsconfig.server.json'
})

require('./server/run')
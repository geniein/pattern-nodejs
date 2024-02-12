const http = require('http');
const consul = require('consul');
const portfinder = require('portfinder');

const serviceType = process.argv[2]
const { pid } = process

async function main () {
  const consulClient = consul()

  const port = await portfinder.getPortPromise()
  const address = process.env.ADDRESS || 'localhost'
  const serviceId = Math.floor(Math.random() * 10000)

  function registerService () { 
    consulClient.agent.service.register({
      id: serviceId,
      name: serviceType,
      address,
      port,
      tags: [serviceType]
    }, () => {
      console.log(`${serviceType} registered successfully`)
    })
  }

  function unregisterService (err) {
    err && console.error(err)
    console.log(`deregistering ${serviceId}`)
    consulClient.agent.service.deregister(serviceId, () => {
      process.exit(err ? 1 : 0)
    })
  }

  process.on('exit', unregisterService) 
  process.on('uncaughtException', unregisterService)
  process.on('SIGINT', unregisterService)

  const server = http.createServer((req, res) => {
    let i = 1e7; 
    while (i > 0) { i-- }
    console.log(`Handling request = require(${pid})`);
    res.end(`${serviceType} response = require(${pid})\n`)
  })
  

  server.listen(port, address, () => {
    registerService()
    console.log(`Started ${serviceType} at ${pid} on port ${port}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
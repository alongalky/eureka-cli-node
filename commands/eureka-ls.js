const config = require('../eureka.config')
const axiosAuth = require('./keys/axios-authenticated')
const machines = require('./machines/machines')
const program = require('commander')
const fs = require('fs')
const keys = require('./keys/keys')({fs})
const Table = require('cli-table')

program
  .option('-k, --key-id <key-id>', 'Key ID for Eureka account')
  .option('-s, --key-secret <key-secret>', 'Matching secret for Eureka account')
  .parse(process.argv)

// Verify keys:
keys.getKeys({key: program.keyId, secret: program.keySecret})
  .then(key => {
    return machines({
      get: axiosAuth(key).get,
      config}).getMachines()
  })
  .then(response => {
    const table = new Table({
      head: ['Machine Name']
    })

    for (const machine of response) {
      table.push([machine.name || ''])
    }

    console.log(table.toString())
  }).catch(err => {
    console.error(err)
  })

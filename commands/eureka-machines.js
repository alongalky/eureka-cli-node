const config = require('../config/config')
const fs = require('fs')
const axiosAuth = require('./auth/axios-authenticated')({ config, fs })
const Table = require('cli-table')
const machines = require('./machines/machines')({
  get: axiosAuth.get,
  config
})
const printError = require('../errors/print-error')

machines.getMachines()
  .then(response => {
    const table = new Table({
      head: ['Machine Name']
    })

    for (const machine of response) {
      table.push([machine.name || ''])
    }

    console.log(table.toString())
  }).catch(err => {
    printError(err)
  })

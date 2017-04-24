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
      head: ['Machine Name', 'SSH Address', 'SSH port'],
      style: {
        head: ['green'],
        compact: true
      }
    })

    for (const machine of response) {
      table.push([machine.name || '', machine.ssh_ip || '', machine.ssh_port || ''])
    }

    console.log(table.toString())
  }).catch(err => {
    printError(err)
  })

const config = require('../eureka.config')
const axios = require('axios')
const machines = require('./machines/machines')({
  get: axios.get,
  config
})
var Table = require('cli-table')

machines.getMachines()
  .then(response => {
    const table = new Table({
      head: ['Machine ID']
    })

    for (const machine of response) {
      table.push([machine.id || ''])
    }

    console.log(table.toString())
  }).catch(err => {
    console.error(err)
  })

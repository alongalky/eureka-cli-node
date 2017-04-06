const program = require('commander')
const config = require('../eureka.config')
const axiosAuth = require('./keys/axios-authenticated')
const tasks = require('./tasks/tasks')
const Table = require('cli-table')
const fs = require('fs')
const keys = require('./keys/keys')({fs})

program
  .option('-m, --machine <type>', 'Show tasks for a specific machine')
  .option('-k, --key-id <key-id>', 'Key ID for Eureka account')
  .option('-s, --key-secret <key-secret>', 'Matching secret for Eureka account')
  .parse(process.argv)

keys.getKeys({key: program.keyId, secret: program.keySecret})
  .then(key => tasks({
    get: axiosAuth(key).get,
    config
  }).getTasks(program.machine))
  .then(response => {
    const table = new Table({
      head: ['Task Name', 'Machine', 'Status', 'Command', 'Tier', 'Start Time']
    })

    for (const task of response) {
      table.push([task.name || '', task.machine || '', task.status || '', task.command || '',
        task.tier || '', task.timestamp_start])
    }

    console.log(table.toString())
  }).catch(err => {
    console.error(err)
  })

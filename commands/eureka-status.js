const program = require('commander')
const config = require('../eureka.config')
const axios = require('axios')
const tasks = require('./tasks/tasks')({
  get: axios.get,
  config
})
const Table = require('cli-table')

program
  .option('-m, --machine <type>', 'Show tasks for a specific machine')
  .parse(process.argv)

tasks.getTasks(program.machine)
  .then(response => {
    const table = new Table({
      head: ['Machine', 'Task ID', 'status', 'Command']
    })

    for (const task of response) {
      table.push([task.machine || '', task.id || '', task.status || '', task.command || ''])
    }

    console.log(table.toString())
  }).catch(err => {
    console.error(err)
  })

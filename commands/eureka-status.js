const program = require('commander')
const config = require('../eureka.config')
const axiosAuth = require('./auth/axios-authenticated')(config)
const tasks = require('./tasks/tasks')({
  get: axiosAuth.get,
  config
})
const Table = require('cli-table')

program
  .option('-m, --machine <type>', 'Show tasks for a specific machine')
  .parse(process.argv)

tasks.getTasks(program.machine)
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

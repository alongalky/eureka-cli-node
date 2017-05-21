const program = require('commander')
const config = require('../config/config')
const fs = require('fs')
const axiosAuth = require('./auth/axios-authenticated')({ config, fs })
const tasksApi = require('./tasks/tasks')({
  get: axiosAuth.get,
  config
})
const Table = require('cli-table')
const moment = require('moment')
const sprintf = require('sprintf-js').sprintf
const printError = require('../errors/print-error')

program
  .option('-c, --costs', 'Display tasks costs and grand total', false)
  .parse(process.argv)

tasksApi.getTasks()
  .then(tasks => {
    const head = program.costs ?
      ['Machine', 'Status', 'Command', 'Tier', 'Cost', 'Duration', 'Name'] :
      ['Machine', 'Status', 'Command', 'Tier', 'Duration', 'Name']
    const table = new Table({
      head,
      style: {
        head: ['green'],
        compact: true
      }
    })

    // Sort by age, from old to new
    tasks.sort((t1, t2) => moment(t1.timestamp_initializing).diff(moment(t2.timestamp_initializing)), 'minutes')
    for (const task of tasks) {
      const duration = moment.duration(task.durationInSeconds || 0, 'seconds')
      const durationString = sprintf('%4d:%02d:%02d', Math.floor(duration.asHours()), duration.minutes(), duration.seconds())
      if (program.costs) {
        const costString = sprintf('$ %6.3f', (task.costInCents || 0.0) / 100.0)

        table.push([task.machineName || '', task.status || '', task.command || '',
          task.tier || '', costString || '', durationString || '', task.name || ''])
      } else {
        table.push([task.machineName || '', task.status || '', task.command || '',
          task.tier || '', durationString || '', task.name || ''])
      }
    }

    console.log(table.toString())

    if (program.costs) {
      const totalCost = tasks.reduce((acc, task) => acc + (task.costInCents || 0.0) / 100.0, 0)
      console.log('Estimated Total Cost: %s', sprintf('$ %6.3f', totalCost))
    }
  }).catch(err => {
    printError(err)
  })

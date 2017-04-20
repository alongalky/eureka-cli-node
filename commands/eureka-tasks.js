const config = require('../config/config')
const fs = require('fs')
const axiosAuth = require('./auth/axios-authenticated')({ config, fs })
const tasks = require('./tasks/tasks')({
  get: axiosAuth.get,
  config
})
const Table = require('cli-table')
const moment = require('moment')
const sprintf = require('sprintf-js').sprintf
const printError = require('../errors/print-error')

tasks.getTasks()
  .then(response => {
    const table = new Table({
      head: ['Task Name', 'Machine', 'Status', 'Command', 'Tier', 'Start Time', 'Cost', 'Duration']
    })

    for (const task of response) {
      let durationString = ''
      if (task.durationInSeconds) {
        const duration = moment.duration(task.durationInSeconds, 'seconds')
        durationString = sprintf('%4d:%02d:%02d', Math.floor(duration.asHours()), duration.minutes(), duration.seconds())
      }
      const costString = task.costInCents ? sprintf('$ %6.2f', task.costInCents / 100.0) : ''

      table.push([task.name || '', task.machineName || '', task.status || '', task.command || '',
        task.tier || '', task.timestamp_initializing || '', costString || '', durationString || ''])
    }

    console.log(table.toString())
  }).catch(err => {
    printError(err)
  })

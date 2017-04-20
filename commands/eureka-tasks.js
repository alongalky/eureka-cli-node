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
      head: ['Machine', 'Status', 'Command', 'Tier', 'Cost', 'Duration'],
      style: {
        head: ['green'],
        compact: true
      }
    })

    for (const task of response) {
      const duration = moment.duration(task.durationInSeconds || 0, 'seconds')
      const durationString = sprintf('%4d:%02d:%02d', Math.floor(duration.asHours()), duration.minutes(), duration.seconds())
      const costString = sprintf('$ %6.3f', (task.costInCents || 0.0) / 100.0)

      table.push([task.machineName || '', task.status || '', task.command || '',
        task.tier || '', costString || '', durationString || ''])
    }

    console.log(table.toString())
  }).catch(err => {
    printError(err)
  })

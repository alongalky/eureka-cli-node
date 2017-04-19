const config = require('../eureka.config')
const fs = require('fs')
const axiosAuth = require('./auth/axios-authenticated')({ config, fs })
const tasks = require('./tasks/tasks')({
  get: axiosAuth.get,
  config
})
const Table = require('cli-table')
const moment = require('moment')
const sprintf = require('sprintf-js').sprintf

tasks.getTasks()
  .then(response => {
    const table = new Table({
      head: ['Task Name', 'Machine', 'Status', 'Command', 'Tier', 'Start Time', 'Cost', 'Duration']
    })

    for (const task of response) {
      const duration = moment.duration(task.durationInSeconds || 0, 'seconds')
      const durationString = sprintf('%4d:%02d:%02d', Math.floor(duration.asHours()), duration.minutes(), duration.seconds())
      const costString = sprintf('$ %6.3f', (task.costInCents || 0.0) / 100.0)

      table.push([task.name || '', task.machineName || '', task.status || '', task.command || '',
        task.tier || '', task.timestamp_initializing || '', costString || '', durationString || ''])
    }

    console.log(table.toString())
  }).catch(err => {
    console.error(err)
  })

const program = require('commander')
const config = require('../config/config')
const fs = require('fs')
const axiosAuth = require('./auth/axios-authenticated')({ config, fs })
const tasks = require('./tasks/tasks')({
  put: axiosAuth.put,
  config
})
const printError = require('../errors/print-error')
const chalk = require('chalk')

let taskName

program
  .arguments('<taskname>')
  .action(t => {
    taskName = t
  })
  .parse(process.argv)

if (!taskName) {
  program.help()
} else {
  tasks.killTask(taskName)
  .then(() =>
    console.log(`Task matching ${chalk.blue(taskName)} killed successfully`)
  ).catch(err => printError(err))
}

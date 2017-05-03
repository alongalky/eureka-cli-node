const program = require('commander')
const config = require('../config/config')
const fs = require('fs')
const axiosAuth = require('./auth/axios-authenticated')({ config, fs })
const tasks = require('./tasks/tasks')({
  post: axiosAuth.post,
  config
})
const uuid = require('uuid')
const printError = require('../errors/print-error')
const chalk = require('chalk')

let command
let machineName

program
  .arguments('<machine> <cmd...>')
  .action((m, cmd) => {
    machineName = m
    command = cmd.join(' ')
  })
  .option('-t, --tier [tier]', 'Run on machine of type [tier]', 'n1-standard-1')

  .parse(process.argv)

if (!machineName || !command) {
  program.help()
} else {
  const task = {
    machineName,
    command,
    tier: program.tier,
    taskName: 'task' + uuid.v4()
  }

  tasks.runTask(task)
  .then(response => {
    console.log(`Running ${chalk.blue(machineName)} with command ${chalk.blue(command)}`)
  }).catch(err => {
    printError(err)
  })
}

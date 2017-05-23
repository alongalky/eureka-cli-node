const program = require('commander')
const config = require('../config/config')
const fs = require('fs')
const axiosAuth = require('./auth/axios-authenticated')({ config, fs })
const names = require('docker-names')
const tasks = require('./tasks/tasks')({
  post: axiosAuth.post,
  config
})
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
  .option('-n, --name [name]', 'Assign a name to the task', names.getRandomName().replace(/_/g, '-'))
  .parse(process.argv)

if (!machineName || !command) {
  program.help()
} else if (!program.name.match(/^[a-z0-9][-a-z0-9]{0,50}[a-z0-9]$/)) {
  printError('Invalid task name, only lowercase alphanumeric characters allowed')
} else {
  const task = {
    machineName,
    command,
    tier: program.tier,
    taskName: program.name
  }

  tasks.runTask(task)
  .then(() => {
    console.log(`Running ${chalk.blue(machineName)} with command ${chalk.blue(command)}`)
  }).catch(err => {
    printError(err)
  })
}

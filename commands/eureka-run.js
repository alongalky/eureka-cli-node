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
  .arguments('<cmd...>')
  .action((m, cmd) => {
    command = cmd.join(' ')
  })
  .option('-n, --name [name]', 'Assign a name to the task', names.getRandomName().replace(/_/g, '-'))
  .parse(process.argv)

if (!command) {
  program.help()
} else if (!program.name.match(/^[a-z0-9][-a-z0-9]{0,50}[a-z0-9]$/)) {
  printError('Invalid task name, only lowercase alphanumeric characters allowed')
} else {
  const task = {
    machineName: 'machina',
    command,
    tier: 'n1-standard-1',
    taskName: program.name
  }

  tasks.runTask(task)
  .then(() => {
    console.log(`Running ${chalk.blue(machineName)} with command ${chalk.blue(command)}`)
  }).catch(err => {
    printError(err)
  })
}

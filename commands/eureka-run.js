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

program
  .arguments('<cmd...>')
  .action(cmd => {
    command = cmd.join(' ')
  })
  .option('-t, --tier [tier]', 'Run on machine of type [tier]', 'n1-standard-1')
  .option('-n, --name [name]', 'Assign a name to the task', names.getRandomName().replace(/_/g, '-'))

program.on('--help', () => {
  console.log('')
  console.log('  For a list of available tiers and prices https://github.com/alongalky/eureka-cli-node/blob/master/docs/tiers.MD')
  console.log('')
})

  .parse(process.argv)

if (!command) {
  program.help()
} else if (!program.name.match(/^[a-z0-9][-a-z0-9]{0,50}[a-z0-9]$/)) {
  printError('Invalid task name, only lowercase alphanumeric characters allowed')
} else {
  const task = {
    machineName: 'machina',
    command,
    workingDirectory: process.cwd(),
    tier: program.tier,
    taskName: program.name
  }

  tasks.runTask(task)
  .then(() => {
    console.log(`Running command ${chalk.green(command)}`)
  }).catch(err => {
    printError(err)
  })
}

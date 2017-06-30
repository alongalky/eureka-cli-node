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
  console.log('  Available tiers:')
  console.log(`
    +----------------------------------------------------------------------------------------------------+
    | Name               | CPUs | Memory (GB) | Disk Size (GB) | SSD Disk Size | Cost per hour ($ cents) |
    |--------------------|------|-------------|----------------|---------------|-------------------------|
    | n1-standard-1      | 1    | 3.75        | 20             | 0             | 5.3460                  |
    | n1-standard-2      | 2    | 7.5         | 40             | 0             | 10.6910                 |
    | n1-standard-4      | 4    | 15          | 80             | 0             | 21.3820                 |
    | n1-standard-4-ssd  | 4    | 15          | 0              | 375           | 33.3900                 |
    | n1-standard-8      | 8    | 30          | 120            | 0             | 42.5240                 |
    | n1-standard-8-ssd  | 8    | 30          | 0              | 375           | 54.2900                 |
    | n1-standard-16-ssd | 16   | 60          | 0              | 375           | 96.0900                 |
    | n1-standard-32-ssd | 32   | 120         | 0              | 375           | 179.6900                |
    +----------------------------------------------------------------------------------------------------+
    `)
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

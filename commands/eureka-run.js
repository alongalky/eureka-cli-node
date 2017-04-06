const axiosAuth = require('./keys/axios-authenticated')
const program = require('commander')
const config = require('../eureka.config')
const tasks = require('./tasks/tasks')
const fs = require('fs')
const keys = require('./keys/keys')({fs})
const uuid = require('uuid')

let command
let machine
let output

program
  .option('-k, --key-id <key-id>', 'Key ID for Eureka account')
  .option('-s, --key-secret <key-secret>', 'Matching secret for Eureka account')
  .arguments('<machine> <output-folder> <cmd...>')
  .action((m, o, cmd) => {
    machine = m
    output = o
    command = cmd
  })
  .parse(process.argv)

if (!machine || !output || !command) {
  program.help()
} else {
  const task = {
    machine,
    output,
    command,
    tier: 'normal',
    taskName: 'task' + uuid.v4()
  }

  keys.getKeys({key: program.keyId, secret: program.keySecret})
    .then(key => {
      console.log(`Running ${machine} with command ${'"' + command.join(' ') + '"'}, output folder is ${output}`)
      return tasks({
        put: axiosAuth(key).put,
        config
      }).runTask(task)
    }).then(response => {
      console.log(response)
    }).catch(err => {
      console.error(err.toString())
    })
}

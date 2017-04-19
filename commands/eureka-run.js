const program = require('commander')
const config = require('../config/config')
const fs = require('fs')
const axiosAuth = require('./auth/axios-authenticated')({ config, fs })
const tasks = require('./tasks/tasks')({
  post: axiosAuth.post,
  config
})
const uuid = require('uuid')

let command
let machineName
let output

program
  .arguments('<machine> <output-folder> <cmd...>')
  .action((m, o, cmd) => {
    machineName = m
    output = o
    command = cmd.join(' ')
  })
  .parse(process.argv)

if (!machineName || !output || !command) {
  program.help()
} else {
  const task = {
    machineName,
    output,
    command,
    tier: 'n1-standard-1',
    taskName: 'task' + uuid.v4()
  }

  console.log(`Running ${machineName} with command ${command}, output folder is ${output}`)
  tasks.runTask(task)
  .then(response => {
    console.log(response)
  }).catch(err => {
    console.log(err.response.data || '')
    console.error(err.toString())
  })
}

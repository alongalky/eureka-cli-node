const program = require('commander')
const config = require('../eureka.config')
const axiosAuth = require('./auth/axios-authenticated')(config)
const tasks = require('./tasks/tasks')({
  post: axiosAuth.post,
  config
})
const uuid = require('uuid')

let command
let machine
let output

program
  .arguments('<machine> <output-folder> <cmd...>')
  .action((m, o, cmd) => {
    machine = m
    output = o
    command = cmd.join(' ')
  })
  .parse(process.argv)

if (!machine || !output || !command) {
  program.help()
} else {
  const task = {
    machine,
    output,
    command,
    tier: 'tiny',
    taskName: 'task' + uuid.v4()
  }

  console.log(`Running ${machine} with command ${command}, output folder is ${output}`)
  tasks.runTask(task)
  .then(response => {
    console.log(response)
  }).catch(err => {
    console.log(err.response.data || '')
    console.error(err.toString())
  })
}

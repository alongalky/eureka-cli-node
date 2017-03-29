const program = require('commander')
const tasks = require('./tasks/tasks')

let command
let machine
let output

program
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
    command
  }

  tasks.runTask(task)
    .then(response => console.log(response))
    .catch(err => {
      console.error(err.toString())
    })
}


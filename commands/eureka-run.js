const program = require('commander')
const tasks = require('./tasks/tasks')

let command = null
let machine = null

program
  .option('-o, --output <output-folder>', 'Output folder to save after task ends')
  .arguments('<machine> <cmd...>')
  .action((m, cmd) => {
    command = cmd
    machine = m
  })
  .parse(process.argv)

tasks.runTask({
  machine,
  output: program.output,
  command
})

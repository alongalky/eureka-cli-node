module.exports = {
  getTasks: machine => Promise.resolve(
    [
      {id: 'task1', status: 'Running', machine: 'machina', command: '/bin/run.sh -input 2'},
      {id: 'task2', status: 'Initializing', machine: 'machina', command: '/bin/run.sh -input 3'}
    ]
  ),

  runTask: ({machine, command, output}) => {
    console.log(`Running ${machine} with command ${'"' + command.join(' ') + '"'}, output folder is ${output}`)
  }
}

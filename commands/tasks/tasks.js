const url = require('url')
const querystring = require('querystring')

module.exports = ({get, put, config}) => ({
  getTasks: machine =>
    get(url.resolve(config.endpoint, '/api/tasks'), querystring.stringify({machine: machine && machine.id}))
      .then(response => response.data),

  runTask: ({machine, command, output, taskName, tier}) => {
    const body = {
      command,
      output,
      machine,
      taskName,
      tier
    }

    let address = url.resolve(config.endpoint, '/api/tasks')
    return put(address, body)
      .then(response => 'Response: Task queued successfully')
  }
})
